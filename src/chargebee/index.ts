// @ts-ignore
import chargebee from 'chargebee';

chargebee.configure({
  site : process.env.CHARGEBEE_DOMAIN,
  api_key : process.env.CHARGEBEE_CLIENT_KEY
})

export default chargebee