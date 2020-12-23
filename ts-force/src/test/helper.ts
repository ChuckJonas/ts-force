import { setDefaultConfig } from '../auth/baseConfig';
import { requestAccessToken } from '../auth/oAuth2'

export async function createDefaultClient() {
  const resp = await requestAccessToken({
    instanceUrl: process.env.HOST,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    grant_type: 'password'
  });

  setDefaultConfig(resp);
}
