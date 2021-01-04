# WHERE Filters

There are often times where you need to run multiple queries with the same WHERE conditions. In those cases, you can create a "filter" function which accepts a `FieldResolver<T>` and returns a `ConditionalClause`

{% tabs %}
{% tab title="Example" %}
```typescript
import { buildQuery, ConditionalClause, FieldResolver } from 'ts-force';

const accountFilter = (f: FieldResolver<Account>): ConditionalClause => {
  return [
    { field: f.select('active'), val: true },
    { field: f.select('accountSource'), val: 'email' },
    { field: f.select('annualRevenue'), op: '>', val: 100 },
  ];
};


let accountQuery = buildQuery(Account, f => (
    {
      select: ['Id'],
      where: accountFilter(f),
      limit: 1
    }
));

let contactQuery = buildQuery(Contact, f => (
    {
      select: ['Id'],
      where: accountFilter(f.parent('account')),
      limit: 1
    }
));

let contactQueryNested = buildQuery(Contact, f => (
    {
      select: ['Id'],
      where: [
        {field: f.select('leadSource'), val: 'web'},
        accountFilter(f.parent('account'))
      ],
      limit: 1
    }
));
```
{% endtab %}

{% tab title="Output: accountQuery" %}
```sql
SELECT
  Id
FROM
  Account
WHERE
  Active__c = true
  AND AccountSource = 'email'
  AND AnnualRevenue > 100
LIMIT
  1
```
{% endtab %}

{% tab title="Output: contactQuery" %}
```sql
SELECT
  Id
FROM
  Contact
WHERE
  Account.Active__c = true
  AND Account.AccountSource = 'email'
  AND Account.AnnualRevenue > 100
LIMIT
  1
```
{% endtab %}

{% tab title="Output: contactQueryNested" %}
```sql
SELECT
  Id
FROM
  Contact
WHERE
  LeadSource = 'web'
  AND (
    Account.Active__c = true
    AND Account.AccountSource = 'email'
    AND Account.AnnualRevenue > 100
  )
LIMIT
  1
```
{% endtab %}
{% endtabs %}

