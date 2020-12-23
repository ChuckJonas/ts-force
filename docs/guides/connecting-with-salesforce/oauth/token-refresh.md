# Token Refresh

A refresh token can be used to generate a new `accessToken` as follows:

```typescript
import { Rest, requestAccessToken } from 'ts-force';

const refreshToken = 'abc132';

const resp = await requestAccessToken({
    grant_type: 'refresh_token',
    instanceUrl: process.env.HOST,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: refreshToken,
 });

 const restInsatance = new Rest(resp);
```

