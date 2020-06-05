import chargebee from '../index'

export async function deleteChargebeeUser(deleteId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chargebee.customer.delete(deleteId).request(function(error: Error, result: any)  {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })
}