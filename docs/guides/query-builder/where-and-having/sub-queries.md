# Inner Queries \(JOINS\)

SOQL supports using "Inner Queries" to effectively perform JOIN filters on tables.

```sql
//Accounts with Contacts that have Gmail emails
SELECT Name FROM Account WHERE Id IN (
  SELECT AccountId FROM Contact WHERE Email LIKE '%@gmail.com'
)
```

This can be accomplished by using `buildQuery` inside a condition:

```typescript
let qry = buildQuery(Account, aF => ({
    select: [aF.select('name')],
    where: [
      {
        field: 'id',
        op: 'IN',
        subqry: buildQuery(Contact, cF => ({
          select: [cF.select('accountId')],
          where: [
            { field: cF.select('email'), op: 'LIKE', val: '%@gmail.com' }
          ]
        }))
      }
    ]
}));
```

{% hint style="info" %}
For Readability & Reusability, it's recommended to split out Inner Queries to there own functions
{% endhint %}

