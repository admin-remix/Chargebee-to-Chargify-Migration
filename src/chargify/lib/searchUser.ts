import fetch from 'node-fetch'

export async function searchUser (email: string): Promise<object | null> {
  try {
    const rawFetchCustomer = await fetch(`https://${process.env.CHARGIFY_DOMAIN}.chargify.com/customers.json?q=${email}`, {
      method: 'get',
      headers: {
        'authorization': `basic ${Buffer.from(process.env.CHARGIFY_CLIENT_KEY ?? '')?.toString('base64')}`,
        'content-type': 'application/json'
      }
    })
    const customers = await rawFetchCustomer.json()
    const customer = customers.find((user: any) => user.customer.email === email)
    if (customer) {
      return customer
    }
  } catch (error) {
    console.log(error)
  }
  return null
}