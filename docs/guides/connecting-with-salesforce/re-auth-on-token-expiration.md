# "Re-Auth" on token expiration

If you are using `ts-force` on a server or long-running process, you might want to setup automatic reauth when your current token expires.

While this is not support "natively", the `AxiosInstance` is exposed via `Rest.request` for use cases like this.

Below is an example using [axios-auth-refresh](https://www.npmjs.com/package/axios-auth-refresh) to automatically create a new token via Username/Password flow, but the same concept applies for other methods.

```typescript
import {Rest, requestAccessToken} from 'ts-force';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

async function getToken(){
  return await requestAccessToken({
    grant_type: 'password',
    instanceUrl: process.env.HOST,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
 });
}

const restInstance = new Rest(await getToken());

const refreshAuthLogic = async (failedRequest: any) => {
    const newToken = await getToken();
    const newAuthHeader = 'Bearer ' + newToken.accessToken;
    failedRequest.response.config.headers['Authorization'] = newAuthHeader;
    //also update our instance so any additional request use the new token
    restInstance.request.defaults.headers['Authorization'] = newAuthHeader;
};

createAuthRefreshInterceptor(restInstance.request, refreshAuthLogic);
```

