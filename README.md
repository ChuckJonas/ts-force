# ts-force

[![alt text](https://travis-ci.org/ChuckJonas/ts-force.svg?branch=master)](https://travis-ci.org/ChuckJonas/ts-force)
[![alt text](https://img.shields.io/npm/v/ts-force.svg)](https://www.npmjs.com/package/ts-force)
[![alt text](https://img.shields.io/badge/license-BSD--3--CLAUSE-blue.svg)](https://github.com/ChuckJonas/ts-force/blob/master/LICENSE)

A client for connecting with salesforce APIs written in typescript, which also provides types & mappings for your salesforce `sObjects`.

`npm install ts-force`

## Usage

### Generate code

This library is intended to be used with code generation. Each Salesforce SObject you need to work with will get it's own class to handle mapping and DML.

The code generation has been split out into a seperate package so it can easily be exclude from your build. Start by installing the generation package: `npm install -D ts-force-gen` and reviewing the [ts-force-gen readme](https://github.com/ChuckJonas/ts-force-gen).

### Configuring Client

To connect with salesforce, and `accessToken` and `instanceUrl` must be passed into `Rest()`.  However, if you're only need a single configuration, you can instead set the `DEFAULT_CONFIG`

*** NOTE: Client Configuration has changed in `v1.1.0` in order to better support multiple configurations.  See details below to upgrade ***

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
import {setDefaultConfig, Rest} from 'ts-force';

//let typescript know we expect these on global scope
declare var __RESTHOST__ : string;
declare var __ACCESSTOKEN__ : string;

//setup default configurations
setDefaultConfig({
    instanceUrl = __RESTHOST__,
    accessToken = __ACCESSTOKEN__
});

let defaultClient = new Rest(); // uses default configuration
let otherClient = new Rest({accessToken: 'abc'}); // uses passed in config
```

#### hosted elsewhere

If you don't already have a accessToken, you can use the "username & password flow" in the `OAuth` module:

```typescript
import {setDefaultConfig, Rest} from 'ts-force';
let config = new UsernamePasswordConfig(
    'client-id9012fjasiojfajflfa.adjfgojasjdf',
    'client-secert12131312',
    'https://na31.salesforce.com',
    'john@example.com',
    'password1');

  let oAuth = new OAuth(config);
  let config = await oAuth.initialize();
  setDefaultConfig(config);
  ```

### DML

Each DML opporation is provided through the `RestObject` base class that each generated class implements.

```typescript

let acc = new Account({ //all props can be set in constructor
    name: 'John Doe',
    website: 'example.com'
});
await acc.insert();
acc.name = 'Jane Doe';
await acc.update();
await acc.refresh(); //retrieves all first class properties
await acc.delete();

```

#### insert/update refresh

`insert` and `update` have an optional `refresh` parameter.  Setting this to true will, use the composite API to `GET` the object properties after DML is performed.  This is extremely helpful for getting changes to formulas and from workflow rules and DOES NOT consume any additional API calls!

``` typescript

await acc.insert(); //object properties not updated
await acc.insert(true); //object properties updated from GET result

```

### Quering Records

You can Query records via a static method on each generated class.

```typescript

let accs: Account[] = Account.retrieve('SELECT Id FROM Account');

```

#### Relationships

Both Parent & Child relationships are supported.  Relational objects are also instances of `RestObject` which you can normal DML on.

```typescript

let accs: Account[] = await Account.retrieve(
  `SELECT Id, Active__c,
    (SELECT Name, Email, Parent_Object__c, Parent_Object__r.Type__c FROM Contacts)
   FROM Account
   WHERE Type__c = 'industry'`
);

let contact = records[0].Contacts[0];
contact.name = 'new name';
await contact.update();
let parentObj = contact.parentObject;
parentObj.account = records[0].Id;
await parentObj.update();
```

#### Using mapped properties to build queires

Each SObject class contains field API information that can be helpful for buiding queries. For example, the above query can be rewritten as such:

```typescript
let aFields = Account.FIELDS;
let cfields = Contact.FIELDS;
let pFields = ParentObject.FIELDS;
let qry =   `SELECT ${aFields.id.apiName},
                    ${aFields.active.apiName},
                    (
                        SELECT ${cFields.name.apiName},
                            ${cFields.email.apiName},
                            ${cFields.parentObjectId.apiName},
                            ${cFields.parentObject.apiName}.${pFields.type.apiName}
                        FROM ${aFields.contacts.apiName}
                    )
                FROM ${Account.API_NAME}
                WHERE ${aFields.type.apiName} = 'industry'`
```

Other than `apiName` you can also access other property meta information like `readOnly`, `required`, `salesforceLabel`, etc.  This can be helpful for building dynamic user forms.

To help make these queries more concise, there are currently 2 "Query Helpers": `generateSelect` & `generateInValues`.

``` typescript
let contactIds = ['2312321','2312312']

//get all related account fields from a contact
qry = `SELECT ${generateSelect(Object.values(Account.FIELDS), Contact.FIELDS.Account)}
       FROM ${Contact.API_NAME}
       WHERE Id IN (${generateInValues(contactIds)})`
```

#### Non-Mapped Queries

You can easily run queries that can't neccaraly be mapped back to an SObject.  This is useful for aggregated queries or even if you just want to query an object without having it included in your generated code.

```typescript
import { Rest } from "ts-force";

const sfdcClient = Rest.Instance;
let results = await sfdcClient.query<{c: number}>('SELECT Count(Id) c FROM Account');
console.log(results);
```


### Composite API

The [Composite API](https://developer.salesforce.com/blogs/tech-pubs/2017/01/simplify-your-api-code-with-new-composite-resources.html) is a powerful way to bundle API calls into a single request.

#### Collection

As of API v42.0 you can now send a DML request containing a collection of up to 200 records.  Unlike Batch & Composite, this request will be processed in a single execution transiton (making it much faster, but also more likely to exceed platform limits).

```typescript

let bulk = new CompositeCollection();

let accounts: List<Account> = [];
for(let i = 0; i < 200; i++){
    accounts.push(new Account({
        name: 'I need to be inserted!'
    }));
}

let saveResults = await bulk.insert(accounts, false);
accounts.forEach(acc => {
    acc.type = 'about to be deleted'
});

saveResults = await bulk.update(accounts);

await bulk.delete(accounts);

```

#### Batch

Composite Batch allows you to bundle multiple requests into a single API call.  Here's what a custom `upsert` implementaion would look like:

```typescript
let accounts = Account.retrieve(`SELECT Id FROM Account LIMIT 5`);
let newAcc = new Account({name: 'I need to be inserted!'});
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

let composite = new Composite()
.addRequest(
  {
    method: 'POST',
    url: `sobjects/${acc.attributes.type}`,
    referenceId: compositeRef
  },
  acc.prepareForDML()
)
.addRequest(
    {
        method: 'GET',
        url: `sobjects/${this.attributes.type}/@{${compositeRef}.id}`,
        referenceId: 'getObject'
    },
    acc.handleCompositeResult
);

const compositeResult = await composite.send();

```

#### passing callbacks

Optionally, a callback can be passed into each composite request that will be passed the respective data once the composite request is complete.  You can see this in action in the above example where `acc.handleCompositeResult` is passed into the function.  The result from the `GET` request will be passed to this function in the rest object:

```typescript

handleCompositeResult = (result: CompositeResponse) => {
    this.mapFromQuery(result.body)
}

```

### Custom Endpoints

You can leverage the generated SObjects in your custom endpoints.  For example, if you had the following `@HttpPost` method that takes an Account and returns a list of Contacts:

```java
@RestResource(urlMapping='/myservice/*')
global with sharing class MyRestResource {
    @HttpPost
    global static Contact[] doPost(Account acc) {
        return [SELECT Id, Name FROM Contact WHERE AccountId = :acc.id];
    }
}
```

You can use `prepareForDML(true)` to map to a salesforce & then `Contact.fromSFObject(sfContact);` to map the response back to the ts-force class.

```typescript
const acc = (await Account.retrieve('SELECT Id, Name FROM Account LIMIT 1'))[0];
const sfSob = acc.prepareForDML(true);
const contacts = (await Rest.Instance.request.post<SObject[]>(
    '/services/apexrest/myservice',
    {acc: sfSob},
)).data.map((sfContact) => {
    return Contact.fromSFObject(sfContact);
});

```

## Contributing

Contributions are encouraged!

### Running Tests

In order to run unit test you must first create a .env.test file with the following credentals that link to a valid salesforce account

```bat

CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =

```

Then run `npm test`

Test should run automagically
