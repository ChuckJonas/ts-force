# JWT Flow

To use [JWT Flow](https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5), you'll need to install an additional library \(such as [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)\) to create JWT tokens.

```typescript
import { Rest, requestAccessToken } from 'ts-force';
import * as jwt from 'jsonwebtoken';

const instanceUrl = 'https://login.salesforce.com';
const options: jwt.SignOptions = {
    issuer: process.env.CLIENT_ID,
    audience: instanceUrl,
    expiresIn: 3,
    algorithm: 'RS256'
}

const assertion = jwt.sign(
   { prn: process.env.USER_NAME }, 
   process.env.PRIVATE_KEY, 
   options
);

const resp = await requestAccessToken({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    instanceUrl,
    assertion
 });

 const restInstance = new Rest(resp);
```

