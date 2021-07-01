# Using with Custom Endpoints

There are instances where the standard rest API may not meet all your needs. This typically happens if:

1. You need more transactional control over a series of operations
2. The end user does not have access to object/fields/operations you need to perform
3. This is a public endpoint and you need to enforce logic on the server-side

We can still call these custom endpoints using `ts-force` and often even use our generated classes with the request and response.

## @RestResource

{% tabs %}
{% tab title="RestServiceTesting.cls" %}
```java
@RestResource(urlMapping='/myservice')
global with sharing class RestServiceTesting {
    @HttpPost
     global static Account doPost(Account acc) {
        return acc;
    }
}
```
{% endtab %}

{% tab title="client.ts" %}
```typescript
let acc = new Account({
    id: '123',
    contacts: [new Contact({
        firstName: 'john',
        lastName: 'doe'
    })],
    owner: new User({
        'email': 'example@gmail.com'
    })
});

const sfSob = acc.toJson(
    { dmlMode: 'all', sendChildObj: true, sendParentObj: true }
);
let data = (await new Rest().request.post<SObject>(
    '/services/apexrest/myservice',
    { acc: sfSob }
)).data;
const retAcc = Account.fromSFObject(data);
console.log(retAcc.id, retAcc.contacts.length);
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Things to Note:

* We can call our endpoint by using `new Rest().request.post<SObject>`.
* We can use `acc.toJson` to map our `Account` object into the format that salesforce is expecting
* `Account.fromSFObject(data)` to parse the response from salesforce back to our `Account` object
{% endhint %}

## Invokable

A special method `invokeAction` is provided to make it easier to call invokable methods

{% tabs %}
{% tab title="AccountInsertAction.cls" %}
```java
public class AccountInsertAction {
  @InvocableMethod(label='Insert Accounts' description='Inserts the accounts specified and returns the IDs of the new accounts.')
  public static List<ID> insertAccounts(List<Account> accounts) {
    Database.SaveResult[] results = Database.insert(accounts);
    List<ID> accountIds = new List<ID>();
    for (Database.SaveResult result : results) {
      if (result.isSuccess()) {
        accountIds.add(result.getId());
      }
    }
    return accountIds;
  }
}
```
{% endtab %}

{% tab title="client.ts" %}
```typescript
let acc1 = new Account({
    name: 'acme',
    annualRevenue: 10
});

let acc2 = new Account({
    name: 'stark',
    annualRevenue: 10000
});


//prepare data for invokable
const data = [
   { accounts: acc1.toJson({ dmlMode: 'all' }) },
   { accounts: acc1.toJson({ dmlMode: 'all' }) }
];

let results = await rest.invokeAction<SObject>('AccountInsertAction', data);

// map list of results be to ts-force RestObjects
const returnedAccounts = results.map(rData => Account.fromSFObject(rData.outputValues.output));

console.log(returnedAccounts[0].id);
```
{% endtab %}
{% endtabs %}

## @RemoteAction

If you are running inside a VisualForce page, you may want to use @RemoteActions to call dedicated controller code.

{% tabs %}
{% tab title="MyController.cls" %}
```java
public class MyController{
  @RemoteAction
  public static String foo(Account acc) {
    return "hello world";
  }
}
```
{% endtab %}

{% tab title="client.ts" %}
```typescript
import { promisifyRemoteAction } from 'remote-action-promise';
 
//this gets injected on the global scope so we need to declare it if using typescript
declare var MyController: {
  foo: any;
};
 
type FooParams = [acc: {}];
 
const fooRemoteAction = promisifyRemoteAction<FooParams, string>(MyController.foo);
 
(async() => {
 let acc = new Account({
    id: '123',
    contacts: [new Contact({
        firstName: 'john',
        lastName: 'doe'
    })],
    owner: new User({
        'email': 'example@gmail.com'
    })
  });

  const sfSob = acc.toJson(
    { dmlMode: 'all', sendChildObj: true, sendParentObj: true }
  );
  try{
    const stringResult = await fooRemoteAction(sfSob);
  }catch(e){
    console.log('error', e);
  }
 
})()
```
{% endtab %}
{% endtabs %}

See [remote-action-promise](https://www.npmjs.com/package/remote-action-promise) for more details on calling `@RemoteActions` from VisualForce apps.

