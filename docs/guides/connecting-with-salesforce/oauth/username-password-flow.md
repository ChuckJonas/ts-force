# Username/Password Flow

```typescript
import { Rest, requestAccessToken } from 'ts-force';

const resp = await requestAccessToken({
    grant_type: 'password',
    instanceUrl: process.env.HOST,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
 });

 const restInsatance = new Rest(resp);
```





