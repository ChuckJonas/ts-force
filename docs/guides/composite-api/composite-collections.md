# Composite Collections

A frequent use-case you will encounter is that you will want to insert/update/delete a collection of records. Obviously, making each request one at a time is extremely inefficient. In these cases you will want to use the [`CompositeCollection` API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections.htm).  This provides functionality very similar to Apex's `Database` methods.

```typescript
import { CompositeCollection } from 'ts-force';

let bulk = new CompositeCollection();

for(let c of contacts){
    c.description = 'updated by ts-force bulk';
}

let results = await bulk.update(
  contacts, { allOrNothing: false }
);

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

{% hint style="info" %}
See [Salesforce's Documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections.htm) for more information.
{% endhint %}

{% hint style="warning" %}
The BULK API should be considered for very large volumes. It is not supported via `ts-force` at this time.
{% endhint %}

