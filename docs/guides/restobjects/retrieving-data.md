# Retrieving Data

To pull data from Salesforce, each **RestObject** provides a static `retrieve` function. 

### `SObject.retrieve(qry, opts?)`

```typescript
import { Account } from './generated';

const accounts = await Account.retrieve(
  'SELECT Id, Name FROM Account LIMIT 1'
);

//using query builder (recommended)
const accounts = await Account.retrieve(f => ({
    select: f.select('id','name'),
    limit: 1
}));

// explicitly setting the Rest client
const accounts = await Account.retrieve(
  'SELECT Id, Name FROM Account LIMIT 1',
  { restInstance: someOtherOrg }
);
```

{% hint style="info" %}
It is highly recommended that you use the [SOQL builder](../query-builder/) to construct queries!
{% endhint %}

{% hint style="warning" %}
This function returns the entire result set by automatically making additional requests until all rows have been returned.  Be careful when operating on large datasets and use the `LIMIT` clause accordingly.
{% endhint %}

### Opts

| Key | Type | Description |
| :--- | :--- | :--- |
| `restInstance` | `Rest` | The `Rest` client to retrieve data from. If not set, "default" client is used.  See [Connecting with Salesforce](../connecting-with-salesforce/#default-vs-instance-connections) |
| `allRows` | `boolean` | Include deleted or achieved records. Defaulted to `false`.  See [queryAll](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_queryall.htm). |
| `useComposite` | `boolean` | _**Experimental!**_  Uses the composite API to reduce the number of queries and in theory offer better performance.  NOTE: It seems Salesforce has started throttling queries made this way and thus it is not recommended to use this setting at this time. |



