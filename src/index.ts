import './env'
import { getSubscriptions } from './chargebee/lib/subscriptions'
import { searchUser } from './chargify/lib/searchUser'
import { createSubscription } from './chargify/lib/createUser'
import { deleteChargebeeUser } from './chargebee/lib/delete'

async function migrateChargeeUserAccounts(chargebeeSubscriptions: any[]): Promise<any[]> {
  const readyToMigrateChargebeeSubscriptions: any[] = []
  for await (const data of chargebeeSubscriptions) {
    const found = await searchUser(data.customer.email)
    const deleteId = data.customer.id
    if (!found) {
      console.log({
        msg: 'User not found, making new user',
        email: data.customer.email
      })
      // create chargify customer
      await createSubscription(data)
      // after we make an account delete it from chargebee
      if (process.env.DELETE_ON_CREATE) {
        console.log({
          msg: `Deleted: ${deleteId}, after account creation`
        })
        await deleteChargebeeUser(deleteId)
      }
    } else {
      console.log({
        msg: 'User is not migrateable',
        email: data.customer.email
      })
      // user is already in chargify and we should delete duplicate
      if (process.env.DELETE_ON_DUPLICATE) {
        console.log({
          msg: `Deleted: ${deleteId}, due to duplicate`
        })
        await deleteChargebeeUser(deleteId)
      }
    }
  }
  return readyToMigrateChargebeeSubscriptions
}

async function main () {
  const chargebeeSubscriptions = await getSubscriptions()
  await migrateChargeeUserAccounts(chargebeeSubscriptions)
  console.log('MIGRATION DONE')
}

main()