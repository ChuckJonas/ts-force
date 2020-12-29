# RestObjects

The term "RestObject" used to refer to the classes generated for your Salesforce SObjects.

Most of the functionality of this library built around the RestObject.    
  
"**RestObjects" provide the following capabilities:**

* mapping between the javascript naming conventions and the Salesforce API names
* `CRUD` operations
* Tracking of modified fields \(allows sending updates of only changes\)
* Metadata information about fields

## CONSTRUCTOR

```typescript
import { Account } from './generated';

// properties can be set during construction
const acc1 = new Account({
   name: 'hello world'
});

// or cloned from another Account
const acc2 = new Account(acc1);
```

## INSTANCE METHODS

### `insert()`

```typescript
import { Account } from './generated';

// properties can be set during construction
const acc = new Account({
   name: 'hello world'
});

await acc.insert();
console.log(acc.id); // will be set
```

### `update()`

```typescript
//...
await acc.update();
```

### `delete()`

```typescript
//...
await acc.delete();
```

### `toJson()`

Used to transform RestObject back to it's raw "SObject" form which will be accepted by the rest API.

```typescript
import { Account } from './generated';

const acc = new Account({
   name: 'hello world'
});

acc.toJson({dmlMode: 'insert'});
```

## STATIC METHODS

### `retrieve()`

```typescript
import { Account } from './generated';

const accounts = await Account.retrieve('SELECT Id, Name FROM Account LIMIT 1');

const accounts = await Account.retrieve(f => ({
    select: f.select('id','name'),
    limit: 1
}));
```

{% hint style="info" %}
See [SOQL Builder](../query-builder/) guide for more information
{% endhint %}

### `fromSObject()`

Parses a raw "SObject" into a `RestObject`. Useful when dealing with json directly from Salesforce

```typescript
import { Account } from './generated';

const salesforceRawData = {
  Name: 'hello',
  My_Custom_Field__c: true
};


const acc = Account.fromSObject(salesforceRawData);
console.log(acc.myCustomField); // -> true
```

