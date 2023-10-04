## Setup for testing
These test require an active connection to a salesforce org.  It runs actual DML, so this should not be a production or even sandbox org!

1. Create an .env with a connection to the org

.env
```
CLIENT_ID=
CLIENT_SECRET
USERNAME=
PASSWORD=
HOST=
```

2. Deploy the code from `sfdc-metadata` to the org.



