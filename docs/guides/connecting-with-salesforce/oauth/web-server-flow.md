# Web-Server Flow

Start by redirecting the user to the authorization url:

```typescript
import { getAuthorizationUrl } from 'ts-force';

const authUrl = getAuthorizationUrl({
   instanceUrl: 'https://login.salesforce.com',
   client_id: process.env.CLIENT_ID,
   redirect_uri: `${process.env.SITE_URL}/api/token`,
   prompt: 'login',
});

//res.redirect(authUrl) or window.location.href = authUrl
```

```typescript
import { Rest, requestAccessToken } from 'ts-force';

// example using express
app.get('/api/token', function(req, res) {
    const code = req.param('code') as string;
    const resp = await requestAccessToken({
        grant_type: 'authorization_code',
        instanceUrl: req.headers.referer,
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${process.env.SITE_URL}/api/token`,
     });

     //typically you would now store token & instanceUrl in user session (via jwt).  
     // Then you can later create a ts-force client like so:
     const restInstance = new Rest(resp);
});
```

