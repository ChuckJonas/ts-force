# Create/Update/Delete

When operating on single records, DML operation can be preformed via an instance method.

{% hint style="success" %}
Use [CompositeCollection](../composite-api/composite-collections.md) to perform updates of 200 records at a time!
{% endhint %}

### `insert(opts?)`

```typescript
import { Account } from './generated';

// properties can be set during construction
const acc = new Account({
   name: 'hello world'
});

await acc.insert();
console.log(acc.id); // will be set
```

{% hint style="info" %}
After operation complete, the `id` property will automatically be set.
{% endhint %}

| KEY | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| `refresh` | `boolean` | if `true`, ALL direct properties of object will be retrieved AFTER the operation complete.  This is done via the Composite API so no additional requests are consumed.  Defaults to `false` |

### `update(opts?)`

```typescript
const acc = (await Account.retrieve(
  'SELECT Id, Name FROM Account LIMIT 1'
))[0]

acc.name = 'Acme';
await acc.update();
```

{% hint style="warning" %}
By default, ONLY fields you explicitly have modified will be sent to Salesforce!
{% endhint %}

| KEY | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| `refresh` | `boolean` | if `true`, ALL direct properties of object will be retrieved AFTER the operation complete.  This is done via the Composite API so no additional requests are consumed.  Defaults to `false` |
| `sendAllFields` | `boolean` | Sends ALL fields to Salesforce, regardless of if the property has been modified.  Defaults to `false` |

### `delete()`

```typescript
//...
await acc.delete();
```

