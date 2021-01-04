# SELECT Models

The real value of the `FieldResolver` is its' ability to create "views" or "models" which can be used in any query to ensure that you always pull consistent data for an object.  
  
To do so, simply create a function that accepts a `FieldResolver<T>` and returns a `string[]`

{% tabs %}
{% tab title="Example" %}
```typescript
const userModel = (userFields: FieldResolver<User>): string[] => {
    return userFields.select('address', 'aboutMe', 'email')
}

const accountModel = (accFields: FieldResolver<Account>): string[] => {
    return [
        ...accFields.select('accountNumber', 'active', 'billingCity'),
        ...userModel(accFields.parent('owner')),
        ...userModel(accFields.parent('lastModifiedBy'))
    ]
}

const contactModel = (contactFields: FieldResolver<Contact>): string[] => {
    return [
        ...contactFields.select('email', 'name'),
        ...accountModel(contactFields.parent('account')),
        ...userModel(contactFields.parent('owner')),
        ...userModel(contactFields.parent('lastModifiedBy')),
    ]
}

// See output in tab
let accountQuery = buildQuery(Account, cFields => (
    {
      select: accountModel(cFields),
      limit: 1
    }
));

let contactQuery = buildQuery(Contact, cFields => (
    {
      select: contactModel(cFields),
      limit: 1
    }
));
```
{% endtab %}

{% tab title="Output: accountQuery" %}
```sql
SELECT
  AccountNumber,
  Active__c,
  BillingCity,
  Owner.Address,
  Owner.AboutMe,
  Owner.Email,
  LastModifiedBy.Address,
  LastModifiedBy.AboutMe,
  LastModifiedBy.Email
FROM
  Account
LIMIT
  1
```
{% endtab %}

{% tab title="Output: contactQuery" %}
```sql
SELECT
  Email,
  Name,
  Account.AccountNumber,
  Account.Active__c,
  Account.BillingCity,
  Account.Owner.Address,
  Account.Owner.AboutMe,
  Account.Owner.Email,
  Account.LastModifiedBy.Address,
  Account.LastModifiedBy.AboutMe,
  Account.LastModifiedBy.Email,
  Owner.Address,
  Owner.AboutMe,
  Owner.Email,
  LastModifiedBy.Address,
  LastModifiedBy.AboutMe,
  LastModifiedBy.Email
FROM
  Contact
LIMIT
  1
```
{% endtab %}
{% endtabs %}

### Recursive Models

In some cases you might need a model that SELECTS a parent of the same type.  This can be done by adding an "termination condition" that checks the `traversed` array in the model function:

{% tabs %}
{% tab title="Example" %}
```typescript
const contactViewRecursive = (contactFields: FieldResolver<Contact>): string[] => {
    if(contactFields.traversed.length == 5){
        return [];
    }
    return [
        ...contactFields.select('email', 'name'),
        ...contactViewRecursive(contactFields.parent('reportsTo'))
    ]
}
let qry = buildQuery(Contact, cFields => (
    {
      select: contactViewRecursive(cFields),
      limit: 1
    }
));
```
{% endtab %}

{% tab title="Output" %}
```sql
SELECT
  Email,
  Name,
  ReportsTo.Email,
  ReportsTo.Name,
  ReportsTo.ReportsTo.Email,
  ReportsTo.ReportsTo.Name,
  ReportsTo.ReportsTo.ReportsTo.Email,
  ReportsTo.ReportsTo.ReportsTo.Name,
  ReportsTo.ReportsTo.ReportsTo.ReportsTo.Email,
  ReportsTo.ReportsTo.ReportsTo.ReportsTo.Name
FROM
  Contact
LIMIT
  1
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
Salesforce limits relationship traversals to a depth of 5
{% endhint %}

