# ts-force
![alt text](https://img.shields.io/badge/build-experimental-orange.svg)

a typescript client for connecting with salesforce APIs.  Currently meant to run on Visualforce and have "Access Token" passed in via global scope.

`npm install ts-force`

***NOTE: ts-force is still very experimental and will likely continue to under-go breaking refactors for sometime.  USE AT OWN RISK!***

## Usage

### Generate code

This library is intended to use with code generation.  Files can be generated using the following command:

#### `ts-force-gen` cmd

`ts-force-gen --accessToken '123abc' --instanceUrl https://cs65.my.salesforce.com --sobs Account,Contact --outputFile ./src/generated/sobs.ts`

##### args

- `--userAlias|-u`: If specified `accessToken` & `instanceUrl` will be loaded using the `sfdx force:org:display` command.  Requires that [sfdx cli](https://developer.salesforce.com/tools/sfdxcli) is installed.
- `--accessToken|-a`: access token to connect to tooling API with
- `--instanceUrl|-i`: host url of the org your connecting with
- `--sobs|-s`: list of comma seperated sobs to generate classes for
- `--outputFile|-o`: where to save the output
- `--config|-c`: path to config json file.  If specified, all above args will pull from file instead

##### json config

Example `ts-force-config.json`:

```json
{
  "auth": {
    "userAlias": "scratch"
  },
  "sObjects": ["Account", "Contact"],
  "outPath": "./src/generated/sobs.ts"
}
```

Decorators are used to determine how to map query responses and which fields we can send to which methods.

Properties will be transformed from api names to the standard javascript convention: `My_Object__c -> myObject`.

#### extending generated classes

Obviously don't change the generated classes if possible unless you want to deal with "merge hell" when you need to regenerate.

Will add details on how to extend once I figure it out myself (mix-ins?).

### Configure Access Token

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

TBD

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

if(refresh === true){
  composite.addRequest(
    'GET',
    `sobjects/${this.attributes.type}/@{${compositeRef}.id}`,
    'getObject'
  );
}

const compositeResult = await composite.send();
```

## todo

- reactor `Rest` class to be more testable (statics are bad mmmk)
- add bulk API support
- Most robost authinication configuration (oAuth?)