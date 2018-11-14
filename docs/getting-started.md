# ts-force tutorial

This walk-through will cover the most common use cases for `ts-force`.

## install & configuration

Before starting, make sure you have the [sfdx-cli](https://developer.salesforce.com/tools/sfdxcli) installed and a "throw away" org authenticated.

1. create a new typescript project. (You can clone this if you want one already configured with vscode debugging `git clone https://github.com/ChuckJonas/ts-scratch-paper.git ts-force-tutorial`).
2. cd into dir
3. `npm install`
4. `npm install ts-force -S`

## generation

While some aspects of ts-force can be used without it, the real value of this libraries comes from generated classes.

1. `npm install ts-force-gen -d`.  This is a dev tool that allow class generation
2. create a file in the root call `ts-force-config.json`
3. Add the following:

```json
{
  "auth": {
    "username": "SET_THIS_TO_DX_USER"
  },
  "sObjects": [
      "Account",
      "Contact",
      "User"
    ],
  "outPath": "./src/generated/sobs.ts"
}
```

For `username`, you will need to use a sfdx-cli authorized user of a developer or scratch org which you can muck up (see [ts-force-gen readme](https://github.com/ChuckJonas/ts-force-gen) for other authentication & command line options).

1. run `npx ts-force-gen -j ts-force-config.json`. Using [npx](https://www.npmjs.com/package/npx) is preferred to ensure compatibility between ts-force & ts-force gen.
2. Look at `./src/generated/sobs.ts` and scan over what has been created.  You'll see an interface and class for each SObject. Notice that the properties have all been 'prettified' to [javascript standard naming conventions](https://www.w3schools.com/js/js_conventions.asp).
3. Open your dev org.  On Account, create a new text field with API name of `Name` (EG: `Name__c` once created)
4. run `ts-force-gen -j ts-force-config.json` again
5. Open `./src/generated/sobs.ts`.  Note the error: `Duplicate identifier 'name'.`

In this case, the auto-mapping is in conflict with the standard name field.  You can override the auto-mapping by replacing 'Account' literal string with:

```json
{
  "apiName": "Account",
  "fieldMappings": [
    {
      "apiName" : "Name__c",
      "propName": "nameCustom"
    }
  ]
}
```

1. Run the generate cmd again and you'll now see that `Name__c` has been mapped to `nameCustom`.


## setup/authentication ts-force

Now let dive into some code...

1. create/open a new file `./src/index.ts`
2. add these imports:

```typescript
import * as child_process from 'child_process'
import {setDefaultConfig} from 'ts-force'
import { Account, Contact } from './generated/sobs'
```

1. add the following code:

```typescript
// MAKE SURE TO UPDATE 'SET_THIS' to your dev org user
let user = 'SET_THIS'
let orgInfo: {result: {accessToken: string, instanceUrl: string}} = JSON.parse(
    child_process.execSync(`sfdx force:org:display -u ${user} --json`
).toString('utf8'));

setDefaultConfig({
    accessToken: orgInfo.result.accessToken,
    instanceUrl:  orgInfo.result.instanceUrl,
});
```

The above snippet uses `sfdx-cli` to get the `accessToken` & `instanceUrl` for your dev org user.  In a real app, you would typically get these values from [oAuth or Visualforce getSessionId](https://github.com/ChuckJonas/ts-force#getting-an-access-token).

The configuration is passes it to `setDefaultConfig`, which creates a connection which will be used by default. (see [readme for using with multiple connections](https://github.com/ChuckJonas/ts-force#multiple-connections)).

## Retrieving Data

Each generated class contains a static `retrieve` method that makes it simple to execute SOQL commands against the object. The `retrieve` method returns a Promise with an array of the results (EG: `Promise<Contact[]>`).

```typescript
(async()=>{ //async anonymous self-invoking function so we can use async/await :)
    //put all example code inside here

    let contacts = await Contact.retrieve(`SELECT Email, Account.Name, Account.Name__c FROM Contact LIMIT 10`);
    console.log(contacts.length);

})().then(()=>console.log('done!'))
```

Add and run the following code (if you don't have any contacts in your org, create some test data to work with).

### The Query Builder

Building SOQL queries with es6 template strings isn't too bad (you can even access API names via `Account.FIELDS`), but we can do better!  This library allows you to build "typed" queries:

1. Add import `buildQuery` to `ts-force`
2. Add and run the following code:

```typescript
let soqlQry = buildQuery(Account, fields => {
    return {
        select: [fields.select('id')]
    }
});
console.log(soqlQry); //SELECT Id FROM Account
```

The first parameter of the `buildQuery` function is the type for the generated SObject that we want to query on.  The second, is a function that takes a [FieldResolver](https://github.com/ChuckJonas/ts-force/blob/master/src/qry/fieldResolver.ts) and must return a [SOQLQueryParams](https://github.com/ChuckJonas/ts-force/blob/master/src/qry/queryBuilder.ts#L32) obj.  You can use the injected `FieldResolver` to map the generated fields back to API names and handles relationships in the context of the root object.

**WARNING:** While "built queries" ensures fields and basic SOQL semantics are correct, it is still possible to generate an invalid query.

Even better, the `retrieve()` method makes this even easier by allowing us to pass JUST the "builder" function:

```typescript
let contacts = await Contact.retrieve((fields)=>{
    return {
        select: [
            fields.select('email'),
            ...fields.parent('account').select('name', 'nameCustom')
        ],
        limit: 10
    }
});
```

#### `fields.select()` & `fields.parent()`

In the above code, note how `fields` is being used in various places above.

1. `fields.select('email')`
   - returns `Email`
   - Change `select('email')` to `select('efails')` and see what happens...

2. `fields.parent('account').select('name', 'nameCustom')`
    - returns `['Account.Name', 'Account.Name__c']`.
    - Change `parent('account')` to `parent('owner')` and see what happens...
    - Note how we use es6 `...` syntax to merge these values

#### Child SubQueries

The `FieldResolver` also allows us to make sub-queries on a child relationships via a method called `subQuery`.  It's similar to building a query with `retrieve`, except the first parameter of `subQuery` is the child relationship property we want to query on.  For example, we can build the following query:

```sql
SELECT Id, (SELECT Name, Phone, Email From Contacts LIMIT 10)
FROM ACCOUNT
LIMIT 5
```

like so:

```typescript
let accountsWithContacts = await Account.retrieve((aFields) => {
    return {
        select: [
            aFields.select('id'),
            aFields.subQuery('contacts', cFields => {
                return {
                    select: cFields.select('name', 'phone', 'email'),
                    limit: 10
                }
            })
        ],
        limit: 5
    }
})
console.log(accountsWithContacts.length);
```

#### Where Clause

To filter our data, we can add a `where` to our `SOQLQueryParams`:
To generate the following query:

```sql
SELECT Id
FROM Account
WHERE AnnualRevenue > 100
AND (
    Type IN ('b2b', 'customer') OR CreatedDate > 2018-11-14T12:46:01z
)
AND Id NOT IN (SELECT AccountId FROM Contact)
```

We can do this:

```typescript
let filteredAccounts = await Account.retrieve((fields) => {
    return {
        select: [
            fields.select('id'),
        ],
        where: [
            { field: fields.select('annualRevenue'), op: '>', val: 100 },
            'AND',
            [
                { field: fields.select('type'), op: 'IN', val: ['b2b', 'customer'] },
                'OR',
                { field: fields.select('createdDate'), op: '>', val: new Date() },
            ],
            'AND',
            {
                field: fields.select('id'),
                op: 'NOT IN',
                subqry: buildQuery(Contact, cFields => {
                    return {
                        select: [cFields.select('accountId')]
                    }
                })
            }
        ]
    }
});
```

**Notice how...**

1. `val` is automatically parsed to the correct format based on the type of the param.  You can pass a `format` function, if you need to override the default formatting.

2. Logical Operators can be added between conditions using `'AND' | 'OR'`. `'AND'` is inferred if no operator is present

3. Logic Groupings can be created by starting a new array

4. You can add subQueries by passing SOQL into `subqry`.

**TIP:** You'll notice that you can only select relationship fields on objects that you have pulled down.  If you need to filter on something outside your generated models, you can always just pass a string!

For more details on building queries, see [this readme](https://github.com/ChuckJonas/ts-force/blob/master/docs/query-builder.md).

### Working with ts-force instances

Once queried, the generated classes make working with our data very easy:

``` typescript
let firstContact = contacts[0];
console.log(firstContact.email, firstContact.account.name, firstContact.account.nameCustom);

for(let acc of accountsWithContacts){
    for(let contact of acc.contacts){
        console.log(contact.name, contact.phone, contact.email);
    }
}
```

Any SObject can be created via the constructor.  The first param to the constructor is an object of fields:

```typescript
let account = new Account({
    name: 'abc',
    accountNumber: '123',
    website: 'example.com'
});
```

Each `SObject` also standard DML operations on it's instance.  `insert(), update(), delete()`

```typescript
await account.insert();
console.log(account.id);
account.name = 'abc123';
await account.update();
```

You can specify parent relationships via the corresponding `Id` field (eg: `accountId`) or via external id

```typescript
let contact1 = new Contact({
    firstName: 'john',
    lastName: 'doe',
    accountId: account.id
});
await contact1.insert();
console.log('contact1:',contact1.id);

//add an My_External_Id__c field to account and regenerate classes to test
let contact2 = new Contact({
    firstName: 'jimmy',
    lastName: 'smalls',
    account: new Account({myExternalId:'123'})
});
await contact2.insert();
console.log('contact2:',contact2.id);
```

NOTE: When executing DML on a record with children, the children ARE NOT included in the request!

### BULK

A frequent use-case you will encounter is that you will want to insert/update/delete a collection of records.  Obviously, making each call-out one at a time is extremely inefficient.  In these cases you will want to use the `CompositeCollection` api.

1. Add import `CompositeCollection` to `ts-force`
2. Add the following code:

```typescript
let bulk = new CompositeCollection();
for(let c of contacts){
    c.description = 'updated by ts-force bulk';
}

let results = await bulk.update(contacts, {allOrNothing: false}); //allow partial update
//results returned in same order as request
for(let i = 0; i < results.length; i++){
    let result = results[i];
    let c = contacts[i];
    if(result.success){
        console.log('updated contact:', c.id)
    }else{
        let errs = result.errors.map(e=>`${e.message}: ${e.fields.join(',')}`).join('\n');
        console.log('Failed to update contact:', c.id, errs);
    }
}
```

## Error Handling

When a request fails, the resulting error could be of a few different shapes. To make it easier to handle, there is a method `getStandardError(e: Error)`.

This method does two things:

1. It parses the error details (`errorDetails`) to a `{message: string, errorCode?: string}[]`.
2. It classifies the error (`e`) as one of three types: `any|axios|composite`, making it possible to type discriminate the raw exception details if needed.

```typescript
try{
    //bad request
    await Account.retrieve('SELECT Id, Foo FROM Account');
}catch(e){
    let stderr = getStandardError(e);
    //draft message for user
    let showUIError = stderr.errorDetails.map(eDet => `${eDet.errorCode}: ${eDet.message}`).join(',');
    //thrown error can be type discriminated
    switch(stderr.type){
        case 'any':
            console.log(stderr.e.message);
            break;
        case 'axios':
            console.log(stderr.e.request);
            console.log(stderr.e.response);
            break;
        case 'composite':
            console.log(stderr.e.compositeResponses);
            break;
    }
}
```