# ts-force tutorial

This walk-through will cover the most common use cases for `ts-force`.

## install & configuration

Before starting, make sure you have the [sfdx-cli](https://developer.salesforce.com/tools/sfdxcli) installed and a "throw away" org authenticated.

1. `git clone https://github.com/ChuckJonas/ts-scratch-paper.git ts-force-tutorial`. cd into dir
2. `npm install`
3. `npm install ts-force -S`

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
5. Open `./src/generated/sobs.ts`.  Note the error due to duplicate identifier

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

1. create a new file `./src/index.ts`
2. add imports:

```typescript
import * as child_process from 'child_process'
import {setDefaultConfig, generateSelect} from 'ts-force'
import { Account, Contact } from '@src/generated/sobs'
```

1. add the following code:

```typescript
// MAKE SURE TO UPDATE 'SET_THIS' to your dev org user
let orgInfo: {result: {accessToken: string, instanceUrl: string}} = JSON.parse(child_process.execSync("sfdx force:org:display -u 'SET_THIS' --json").toString('utf8'));

setDefaultConfig({
    accessToken: orgInfo.result.accessToken,
    instanceUrl:  orgInfo.result.instanceUrl,
});
```

The above snippet uses `sfdx-cli` to get the user token & instanceUrl for your dev org user (something you'd typically never do in a production app).

Then is passes it to `setDefaultConfig`, which authenticates ts-force in the global context, which will be used by default, unless otherwise specified (see [readme](https://github.com/ChuckJonas/ts-force/blob/master/readme.md#Multiple_Connections)).

See the [Authentication section](https://github.com/ChuckJonas/ts-force/blob/master/readme.md) for more details on how to setup authentication for typical projects.

## Retrieving Data

Each generated class contains a static `retrieve` method that makes it simple to execute SOQL commands against the object.

```typescript
(async()=>{ //async anonymous self-invoking function so we can use async/await :)
    let contacts = await Contact.retrieve(`SELECT Email, Account.Name, Account.Name__c FROM Contact LIMIT 10`);
})().then(()=>console.log('done!'))
```

The `retrieve` method returns a Promise with an array of the results (EG: `Promise<Contact[]>`).

### The Query Builder

Building SOQL queries with es6 template strings isn't too bad (you can access API names via `Account.FIELDS`), but we can do better!  Instead of passing a `string` into `retrieve` we can pass a "query builder" function.

The function takes a [FieldResolver](https://github.com/ChuckJonas/ts-force/blob/master/src/qry/fieldResolver.ts) and must return a [SOQLQueryParams](https://github.com/ChuckJonas/ts-force/blob/master/src/qry/queryBuilder.ts#L32) obj.  The `FieldResolver` allows you to map the generated fields back to API names.

**WARNING:** While building queries with `FieldResolver` & `SOQLQueryParams` ensures fields and basic SOQL semantics are correct, it is still possible to generate an invalid query.

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

- `fields.select('email')`: returns `Email`

- `fields.parent('account').select('name', 'nameCustom')`: returns `[Account.Name, Account.Name__c]`.  Note how we use es6 `...` syntax to merge these values

Change `select('email')` to `select('efails')` and note what happens...
Change `parent('account')` to `parent('owner')` and note what happens...

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
            accFields.select('Id'),
            accFields.subQuery('contacts', cFields => {
                return {
                    select: cFields.select('name','phone','email'),
                    limit: 10
                }
            });
        ],
        limit: 5
    }
})
```

#### Where

To filter our data, we can add a `where` to our `SOQLQueryParams`:

```typescript
let filteredAccounts = await Account.retrieve((fields) => {
    return {
        select: [
            fields.select('Id'),
        ],
        where: [
            {field: fields.select('annualRevenue'), op: '>', val: 100}
            {field: fields.select('type'), op: 'IN', val: ['b2b', 'customer']},
            'OR',
            [
                {field: fields.select('createdDate'), op: '>', new Date()}
                'AND'
                {
                    field: fields.select('createdDate'),
                    op: 'NOT IN',
                    subqry: buildQuery(Contact, cFields => {
                        return {
                            select: [cFields.select('Id')]
                        }
                    })
                }
            ]
        ]
    }
});
```

**NOTICE**

1. `val` is are automatically parsed to the correct format based on the type of the param

2. Logical Operators can be added between conditions using 'AND' | 'OR'. 'AND' is inferred if no operator is present

3. Logic Groupings can be can made by creating a new array

4. You add subQueries passing a new query into `subqry`.

**TIP:** You'll notice that you can only select relationship fields on objects that you have pulled down.  If you need to filter on something outside your generated models, you can always just pass a string!


### Working with ts-force instances

The generated classes make accessing data very easy.  Our queried fields, parent objects and related children are available:

``` typescript
//add code to end of queryRecords()
let firstContact = contacts[0];
console.log(firstContact.email, firstContact.account.name, firstContact.account.customName);

for(let acc of accountsWithContacts){
    for(let contact of acc.contacts){
        console.log(contact.name, contact.phone, contact.email);
    }
}
```

Any SObject can be created via the constructor.  The constructor takes a single param which allows you to initialize the fields:

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

You can specify parent relationships via the corresponding `Id` field or via external id

```typescript
let contact1 = new Contact({
    firstName: 'john',
    lastName: 'doe',
    accountId: account.id
});
await contact1.insert();
console.log('contact1:',contact1.id);

let contact2 = new Contact({
    firstName: 'jimmy',
    lastName: 'smalls',
    account: new Account({myExternalId:'123'}) //add an My_External_Id__c field to account to test this
});
await contact2.insert();
console.log('contact2:',contact2.id);
```

NOTE: When executing DML on a record which children, the children ARE NOT included in the request!

### BULK

A frequent use-case you will encounter is that you will want to insert/update/delete many records.  Obviously making each callout one at a time is extremely inefficient.  In these cases you will want to use the "CompositeCollection" api.

1. Add import `CompositeCollection` to `ts-force`
2. Add the following code:

```typescript
let bulk = new CompositeCollection();
let contacts = await Contact.retrieve(qry1 + ' LIMIT 1');
for(let c of contacts){
    c.description = 'updated by ts-force';
}

let results = await bulk.update(contacts, false); //allow partial update
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

If a request fails, an Axios error can be caught.  Typically you'll want to handle this error something like this:

```typescript
try{
    //bad request
    await Account.retrieve('SELECT Id, Foo FROM Account');
}catch(e){
    if(e.response){
        console.log(e.response.status);
        console.log(JSON.stringify(e.response.data));
    }else{
        console.log(e.toString());
    }
    //do something meaningful
}
```