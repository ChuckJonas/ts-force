# User-Agent Flow

```typescript
import { getAuthorizationUrl } from 'ts-force';

const authUrl = getAuthorizationUrl({
   response_type: 'token',
   instanceUrl: 'https://login.salesforce.com',
   client_id: process.env.CLIENT_ID,
   redirect_uri: `${process.env.SITE_URL}/api/token`
});
```

