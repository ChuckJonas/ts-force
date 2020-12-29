# OAuth

Common oAuth flows are supported via two "utility" functions:

* **`getAuthorizationUrl()`**: Creates the oAuth URL for flows which redirect the end User \([Web-Server](web-server-flow.md) & [User-Agent](user-agent-flow.md) flows\)
* **`requestAccessToken()`**: Makes a request to `/services/oauth2/token` to get an Access Token.  Used by most flows.

See sub sections for examples of each supported flow.

[Reference Salesforce's official documentation](https://help.salesforce.com/articleView?id=remoteaccess_oauth_flows.htm&type=5) to see full list of parameters for each oAuth flow.

