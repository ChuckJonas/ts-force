# ts-force

![alt text](https://img.shields.io/badge/stage-alpha-yellow.svg)
![alt text](https://img.shields.io/travis/ChuckJonas/ts-force.svg)
![alt text](https://img.shields.io/npm/v/ts-force.svg)

a typescript client for connecting with salesforce APIs.  Currently meant to run on Visualforce and have "Access Token" passed in via global scope.

`npm install ts-force`

***NOTE: ts-force is still very young and will likely under-go breaking refactors for some time***

## Usage

### Generate code

This library is intended to use with code generation.  Files can be generated using the following command:

`ts-force-gen`

#### Configuartions file

A json configuration file can be passed in via the `--config|c` arg:

`ts-force-gen -j ./config/ts-force-config.json`

*Username/Pass configuration:*

```json
{
  "auth": {
    "username": "john@example.com",
    "password": "password1",
    "clientId": "asdgasdg",
    "clientSecret": "12314515",
    "oAuthHost": "https://na31.salesforce.com"
  },
  "sObjects": ["Account", "Contact"],
  "outPath": "./src/generated/sobs.ts"
}
```

*sfdx configuration:*

If you only pass the `username`, the code generator will attempt to auth using `sfdx force:org:display -u [username]` (this means you can also pass the org alias).

```json
"auth": {
    "username": "john@example.com",
  },
```

*access token configuration:*

You can also pass the access token and instance url in directly

```json
"auth": {
    "accessToken": "12312321",
    "instanceUrl": "https://na31.salesforce.com",
  },
```

#### Commandline Args

Most args can also be passed in directly via the command line.  Config File & args will be merged with args taking presidence.

- `--username|-u`: If specified with password, generation will attempt to use username/password flow.  If specified without password, will attempt to retrieve token and instance url using `sfdx force:org:display` (Requires that [sfdx cli](https://developer.salesforce.com/tools/sfdxcli) is installed).
- `--password|-p`: password to use in auth flow
- `--clientId|-c`: client Id of connected app for username/password auth flow
- `--clientSecret|-s`: client Secret of connected app for username/password auth flow
- `--accessToken|-a`: access token to connect to tooling API with.  Not required if using the user/pass or dx flows
- `--instanceUrl|-i`: instance of the org your connecting with.  Not required if using the user/pass or dx flows
- `--sobs|-s`: list of comma seperated sobs to generate classes for
- `--outputFile|-o`: where to save the output
- `--config|-j`: path to config JSON file.  If specified, all above args will pull from file instead

#### generated classes

Decorators are used to determine how to map query responses and which fields we can send to which methods.

Properties will be transformed from api names to the standard javascript convention: `My_Object__c -> myObject`.

#### extending generated classes

Obviously don't change the generated classes if possible unless you want to deal with "merge hell" when you need to regenerate.

Will add details on how to extend once I figure it out myself (mix-ins?).

### Configuring Client

To connect with salesforce, and `accessToken` and `instanceUrl` must be passed into `Rest.config`

#### hosted on salesforce (visualforce)

This will need to be injected in the visualforce page:

```html
 <script type="text/javascript">
        //rest details
        const __ACCESSTOKEN__ = '{!$Api.Session_ID}';
        //leave blank to use realitive path
        const __RESTHOST__ = '';
    </script>
```

Then, in our app, we just need to setup `RestClient`.

```typescript
import {Rest, BaseConfig} from 'type-force';

//let typescript know we expect these on global scope
declare var __RESTHOST__ : string;
declare var __ACCESSTOKEN__ : string;

//set configurations
let config = {
  instanceUrl: __RESTHOST__,
  accessToken: __ACCESSTOKEN__
};
//set static config on Rest
Rest.config = config;
```

#### hosted elsewhere

If you don't already have a accessToken, you can use the username & password flow in the `OAuth` module:

```typescript
let config = new UsernamePasswordConfig(
    'client-id9012fjasiojfajflfa.adjfgojasjdf',
    'client-secert12131312',
    'https://na31.salesforce.com',
    'john@example.com',
    'password1');

  let oAuth = new OAuth(config);
  Rest.config = await oAuth.initialize()
  ```

### DML

Each DML opporation is provided through the `RestObject` base class that each generated class implements.

```typescript
let acc = new Account();
acc.name = 'John Doe';
await acc.insert();
acc.name = 'Jane Doe';
await acc.update();
await acc.refresh(); //retrieves all properties
await acc.delete();
```

#### insert/update refresh

`insert` and `update` have an optional `refresh` parameter.  Setting this to true will, use the composite API to `GET` the object properties after DML is performed.  This is extremely helpful for getting changes to formulas and from workflow rules and DOES NOT consume and additional API call!

``` typescript
await acc.insert(); //object properties not updated
await acc.insert(true); //object properties updated from GET result
```

### Quering Records

Query record via a static method on each generated class.

```typescript
let accs: Account[] = Account.retrieve('SELECT Id FROM Account');
```

#### Relationships

Both Parent & Child relationships are supported.  Returned objects are instances of `RestObject` and you can permform DML.

```typescript

let accs: Account[] = await Account.retrieve(
  `SELECT Id, Name, Website, Active__c, (SELECT Id, Name, Email, Parent_Object__r.Id, Parent_Object__r.Name FROM Contacts) FROM Account WHERE Id = '0010m000006vmwJ'`
);

let contact = records[0].Contacts[0];
contact.name = 'new name';
await contact.update();
let parentObj = contact.parentObject;
parentObj.account = records[0].Id;
await parentObj.update();
```

### Composite API

The [Composite API](https://developer.salesforce.com/blogs/tech-pubs/2017/01/simplify-your-api-code-with-new-composite-resources.html) is a powerful way to bundle API calls into a single request

#### Batch

Composite Batch allows you to bundle multiple requests into a single API call.  Here's what a custom `upsert` implementaion would look like:

```typescript
let accounts = Account.retrieve('SELECT Id FROM Account');
let newAcc = new Account();
newAcc.name = 'I need to be inserted!';
accounts.add(newAcc);

let batchRequest = new CompositeBatch()
accounts.forEach(acc=>{
  if(acc.id){ //update
    batchRequest.addUpdate(sob);
  }else{ //insert
    batchRequest.addInsert(sob);
  }
})
await batchRequest.send();
```

#### Composite

The Composite calls allow you to bind data from the previous call to the following!  The downside is they take a bit more work to setup.

Imagine we wanted to update a record and then retrieve it's properties in a single API call.  We can achieve this with the following

```typescript
let acc = new Account();
acc.id = '12324123124';
acc.refresh();

const compositeRef = 'myAccount';

let composite = new Composite().addRequest(
  'POST',
  `sobjects/${this.attributes.type}`,
  compositeRef,
  acc.prepareForDML()
);

composite.addRequest(
    'GET',
    `sobjects/${this.attributes.type}/@{${compositeRef}.id}`,
    'getObject'
);


const compositeResult = await composite.send();
```

## Running Unit Tests

In order to run unit test you must first create a .env.test file with the following credentals that link to a valid salesforce account

```.env.test
CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =
```

Then run

```
npm test
```

Test should run automagically

## todo

- reactor `Rest` class to be more testable (statics are bad mmmk)
- add bulk API support
- Most robost authinication configuration (oAuth?)