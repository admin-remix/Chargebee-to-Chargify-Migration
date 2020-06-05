import fetch from 'node-fetch'
import Chance from 'chance'

const chance = new Chance()

export async function createSubscription (data: any): Promise<any> {
  const rawCreateSubscription = await fetch(`https://${process.env.CHARGIFY_DOMAIN}.chargify.com/subscriptions.json`, {
    method: 'post',
    headers: {
      'authorization': `basic ${Buffer.from(process.env.CHARGIFY_CLIENT_KEY ?? '')?.toString('base64')}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      subscription: {
        product_handle: process.env.CHARGIFY_ACCOUNT_NAME,
        next_billing_at: new Date(data.subscription.next_billing_at * 1000).toISOString() ?? '',
        customer_attributes: {
          first_name: data.customer.first_name ? data.customer.first_name : `${chance.first({ nationality: 'en' })}:MOCK`,
          last_name: data.customer.last_name ? data.customer.last_name : `${chance.last({ nationality: 'en'})}:MOCK`,
          email: data.customer.email,
          organization: data.customer.company
        },
        credit_card_attributes: null
      }
    })
  })
  const subscription = await rawCreateSubscription.json()
  return subscription
}