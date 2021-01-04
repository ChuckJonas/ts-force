# Composite

Executes a series of REST API requests in a single call. You can use the output of one request as the input to a subsequent request. The response bodies and HTTP statuses of the requests are returned in a single response body. The entire series of requests counts as a single call toward your API limits.

```typescript
const restInstance = new Rest();
const composite = new Composite();
const acc = new Account({
  name: 'Sample Account'
});
composite.addRequest({
  referenceId: 'refAccount',
  method: 'POST',
  url: `/services/data/v${restInstance.config.version}/sobjects/Account`,
  body: acc.toJson( {dmlMode: 'insert'} )
});

const con = new Contact({
  name: 'Sample Contact',
  accountId : "@{refAccount.id}"
});

composite.addRequest({
  referenceId: 'refContact',
  method: 'POST',
  url: `/services/data/v${restInstance.config.version}/sobjects/Contact`,
  body: con.toJson( {dmlMode: 'insert'} )
});

composite.addRequest({
  referenceId: 'contact',
  method: 'GET',
  url: `/services/data/v${restInstance.config.version}/sobjects/Contact/@{refContact.id}`,
});

const results = await composite.send();
const conWithData = Contact.fromSFObject(results.compositeResponse[2].body);
```

{% hint style="info" %}
See [Salesforce's documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_composite.htm) for more information.
{% endhint %}

