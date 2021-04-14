# Transformation \(serialization\)

The **RestObject** exposes the means by which data is round trip serialized between the Salesforce API and the RestObject state.

### `toJson(opts)`

Used to transform RestObject back to it's raw "SObject" form which will be accepted by the rest API.

```typescript
import { Account } from './generated';

const acc = new Account({
   name: 'hello world'
});

acc.toJson({dmlMode: 'insert'});
```

| KEY | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| `dmlMode` | `all | insert | update | update_modified_only` | Controls which data to serialize.  |
| `sendParentObj` | `boolean` | Includes related parent objects. Defaults to `false`. |
| `sendChildObj` | `boolean` | Includes related children lists. Defaults to `false`. |
| `hideAttributes` | `boolean` | Hides the `Attributes` property which contains the sObject `type` name and `url`. Defaults to `false`. |

### `fromSObject(data)`

Parses a raw "SObject" data \(in API form\) into a `RestObject`. Useful when dealing with json directly from Salesforce.  

```typescript
import { Account } from './generated';

const salesforceRawData = {
  Name: 'hello',
  My_Custom_Field__c: true
};


const acc = Account.fromSObject(salesforceRawData);
console.log(acc.myCustomField); // -> true
```

Round Trip Serialization

See [Using with Custom Endpoints](using-with-custom-endpoints.md) for common example for usage of these methods.

