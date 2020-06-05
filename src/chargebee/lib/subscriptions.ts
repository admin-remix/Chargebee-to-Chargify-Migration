import chargebee from '../index'

async function getSubscriptionWithOffset (offset: string | null = null): Promise<{ list: any[], next_offset: string | null }> {
  return new Promise((resolve, reject) => {
    chargebee.subscription.list({
      limit: 100,
      'plan_id[is]': process.env.CHARGEBEE_ACCOUNT_NAME,
      offset,
    }).request(function(error: Error, result: any)  {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })
}

export async function getSubscriptions(): Promise<any[]> {
  try {
    const subscriptions = []
    let nextPageToken = null
    do {
      const subs: { list: any[], next_offset: string | null } = await getSubscriptionWithOffset(nextPageToken)
      if (subs.list && subs.list.length) subscriptions.push(...subs.list)
      if (subs.next_offset) {
        console.log({nextPageToken: subs.next_offset, msg: 'Downloading Data'})
        nextPageToken = subs.next_offset
      } else {
        nextPageToken = null
      }
    } while (nextPageToken);
    return subscriptions 
  } catch (error) {
    console.log(error)
    return []
  }
}

