# ts-force

a typescript client for connecting with salesforce APIs.  Currently meant to run on Visualforce and have "Access Token" passed in via global scope.

`npm install ts-force`

## Usage

### Create concerete RestObject types

Create a type for each SObject you with to use:

```javascript
export class Account extends RestObject {
    constructor(){
        //pass SObject API Name
        super('Account');
    }
    Name: string;
    Website: string;
    Active__c?: boolean;
}
```

### Configure Access Token

This will need to be injected in the visualforce page:

```html
 <script type="text/javascript">
        //rest details
        const __ACCESSTOKEN__ = '{!$Api.Session_ID}';
        const __RESTHOST__ = '';
    </script>
```

Then we need to pass it to `RestClient`.

```typescript
import {Rest, RestBaseConfig} from 'type-force';

//let typescript know we expect these on global scope
declare var __RESTHOST__ : string;
declare var __ACCESSTOKEN__ : string;

//set configurations
let config = new RestBaseConfig();
config.host = __RESTHOST__;
config.accessToken = __ACCESSTOKEN__;
//set static config on Rest
Rest.config = config;
```

`RestClient.accessToken`: used to authinicate to the API
`RestClient.host`: used to specify the host.  primarly used for dev enviorments. Leave blank/empty if running on Visualforce page

### Quering Records

Query record via a static method on the `RestClient`:

```typescript
Rest.query<Account>(Account, 'SELECT Id FROM Account');
```

** Note: we have to specify the account as a generic and pass the type into the first aguement because we use Object.Assign to make the returned json instances implement `RestObject`.

### updating records

Each DML opporation is provided through the `RestObject` base class your concrete SObject classes extend.

```typescript
let acc = new Account();
acc.Name = 'John Doe';
acc.insert();
```

## todo

- fix how access token is provided
- add bulk API support
- add RemoteAction support
- add code gen tool to generate sObject types from meta-data API
- Most robost authinication configuration (oAuth?)