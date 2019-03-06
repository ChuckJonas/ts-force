# ts-force

[![alt text](https://travis-ci.org/ChuckJonas/ts-force.svg?branch=master)](https://travis-ci.org/ChuckJonas/ts-force)
[![alt text](https://img.shields.io/npm/v/ts-force.svg)](https://www.npmjs.com/package/ts-force)
[![alt text](https://img.shields.io/badge/license-BSD--3--CLAUSE-blue.svg)](https://github.com/ChuckJonas/ts-force/blob/master/LICENSE)

A client/ORM for connecting with salesforce APIs written in typescript, which also provides types & field mappings for your salesforce `sObjects`.

**NOTE:** This repository has been refactored to include both `ts-force` and `ts-force-gen`.

## Getting Started

The fastest way to get up and going with this library is to follow the ["Getting Started" tutorial](https://github.com/ChuckJonas/ts-force/wiki).
## Install/Setup

1. `npm install ts-force -S`
2. `npm install ts-force-gen -D`
3. This library uses ES6 `Proxy`.  If you need to support browsers which do not handle es6 (<IE11), then you must install and setup [polyfill-proxy](https://www.npmjs.com/package/proxy-polyfill)
4. [configure ts-force-gen](https://github.com/ChuckJonas/ts-force-gen)
5. generate classes: `npx ts-force-gen ...`

### Code Generation

This library is primarily intended to be used with code generation. Each Salesforce SObject you need to work with will get it's own class to handle mapping and DML.

The [code generation command](./ts-force-gen) has been split out into a separate package so it can easily be excluded from your production build.

**NOTE:** Your installed version of `ts-force-gen` should ALWAYS match your `ts-force` Major and Minor version (EG: `1.5.1`).

## Usage

### Managing Connections

#### Global/Default Configuration

For projects where you only need a single salesforce connection, this is the most convenient approach. Simply pass `accessToken` and `instanceUrl` into `setDefaultConfig()` and every action you take will automatically be authenticated to that connection

#### Multiple Connections

If needed, you can override the default configuration by explicitly passing a `Rest` client into any "entry point". Any `RestObjects` returned will inherit the connection of their initializer (see example below).

#### Example

```typescript
import {setDefaultConfig, Rest} from 'ts-force';

//setup default conn
setDefaultConfig({
    instanceUrl = 'https://test.salesforce.com',
    accessToken = 'abc1234'
});

let defaultClient = new Rest(); // uses default conn

let otherClient = new Rest({accessToken: 'abc123', instanceUrl: 'https://salesforce.com'});

let defaultConnAcc = new Account({name: 'foo'}); // uses default conn

let otherConnAcc = new Account({name: 'foo'}, otherClient); //uses other conn

let defaultConnSelect = await Account.retrieve('select Id from Account');

//retrieved objects inherit their connection!!!
let otherConnSelect = await Account.retrieve('select Id from Account', otherClient);
otherConnAcc = otherConnSelect[0];
otherConnAcc.name = 'foo bar';
otherConnAcc.update();

//rest collection client
let defaultConnBulk = new CompositeCollection();
let otherConnBulk = new CompositeCollection(otherClient);
```

### Getting an Access Token

#### OAuth

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

#### hosted on salesforce (visualforce)

If you're running on a visualforce page, the easiest way to authenticate is just by injecting your access token into the global scope:

```html
 <script type="text/javascript">
        //rest details
        const __ACCESSTOKEN__ = '{!$Api.Session_ID}';
        //leave blank to use relative path
        const __RESTHOST__ = '';
    </script>
```

Before you use these variables, you'll just need to let typescript know they exist:

```typescript
//let typescript know we expect these on global scope
declare var __RESTHOST__ : string;
declare var __ACCESSTOKEN__ : string;
```

### DML

Single object DML operations are provided through the `RestObject` base class that each generated class implements.

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
await acc.insert({refresh:true}); //object properties updated from GET result

```

#### update sendAllFields

In order to prevent unintendedly overwriting data, update calls will ONLY send fields which have been explicitly set.  In other words, values which were queried via a retrieve call, will not be included in the update request.

If you wish to override this behavior, you can use:

``` typescript
await acc.update({sendAllFields:true}); //forces all properties to be included
let bulk = new CompositeCollection();
await bulk.update(accs, {sendAllFields:true});
```

### Querying Records

You can Query records via a static method on each generated class.

```typescript
let accs: Account[] = Account.retrieve('SELECT Id FROM Account');
```

Type-safe queries can be generated by instead passing a function which, accepts a `FieldResolver` and returns `SOQLQueryParams`:

```typescript
let accs: Account[] = Account.retrieve(fields => {
    return {
        select: [
            fields.select('id')
        ]
    }
});
```

For additional details on building typed queries, see the [dedicated readme](https://github.com/ChuckJonas/ts-force/blob/master/docs/query-builder.md).

#### Relationships

Both Parent & Child relationships are supported.  Relational objects are also instances of `RestObject` which you can normal DML on.

```typescript

// SOQL:
//// SELECT Id, Active__c,
//    (SELECT Name, Email, Parent_Object__c, Parent_Object__r.Type__c FROM Contacts)
//   FROM Account
//   WHERE Type__c = 'industry'
let accs: Account[] = await Account.retrieve(fields => {
    return {
        select: [
            fields.select('id', 'active'),
            fields.subQuery('contacts', cFields => {
                return {
                    select: [
                        ...cFields.select('name', 'email', 'parentObjectId'),
                        cFields.parent('parentObject').select('type')
                    ]
                }
            })
        ],
        where: [
            {field: fields.select(type), op: '=', val: 'industry'}
        ]
    }
 }
);

let contact = records[0].Contacts[0];
contact.name = 'new name';
await contact.update();
let parentObj = contact.parentObject;
parentObj.account = records[0].Id;
await parentObj.update();
```

#### Non-Mapped Queries

You can easily run queries that can't necessarily be mapped back to an SObject.  This is useful for aggregated queries or even if you just want to query an object without having it included in your generated code.

```typescript
import { Rest } from "ts-force";

const sfdcClient = Rest.Instance;
let results = await sfdcClient.query<{c: number}>('SELECT Count(Id) c FROM Account');
console.log(results);
```


### Composite API

The [Composite API](https://developer.salesforce.com/blogs/tech-pubs/2017/01/simplify-your-api-code-with-new-composite-resources.html) is a powerful way to bundle API calls into a single request.

#### Collection

As of API v42.0 you can now send a DML request containing a collection of up to 200 records.  Unlike Batch & Composite, this request will be processed in a single execution transition (making it much faster, but also more likely to exceed platform limits).

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

Composite Batch allows you to bundle multiple requests into a single API call.  Here's what a custom `upsert` implementation would look like:

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
  acc.prepareFor('update')
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

You can use `prepareFor('apex')` to map to a salesforce & then `Contact.fromSFObject(sfContact);` to map the response back to the ts-force class.

```typescript
const acc = (await Account.retrieve('SELECT Id, Name FROM Account LIMIT 1'))[0];
const sfSob = acc.prepareFor('apex');
const contacts = (await new Rest().post<SObject[]>(
    '/services/apexrest/myservice',
    {acc: sfSob},
)).data.map((sfContact) => {
    return Contact.fromSFObject(sfContact);
});

```

## Contributing

Contributions are encouraged!

### Running Tests

In order to run unit test you must first create a `.env` file with the following credentials that link to a valid salesforce account

```bat

CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =

```

***WARNING: TESTS WILL RUN DML IN THIS ORG!!!! While they attempt to reset state after complete, failed tests could result in test data being left behind ***

Then run `npm test`

Test should run automagically
