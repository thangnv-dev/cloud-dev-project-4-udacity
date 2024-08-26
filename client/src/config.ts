// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
export const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT ||
  `https://arn9s7gm2j.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: process.env.REACT_APP_AUTH0_DOMAIN, // Auth0 domain
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID, // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
