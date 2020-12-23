# SOQL Builder

`ts-force`  provides a built-in "query builder" that allows generation of SOQL queries via structured data.  
  
There are several advantages of using the SOQL builder over hardcode or templated strings:

* type-safe\*
* reusable
* composable
* consistent

Checkout the [Query Playground](https://stackblitz.com/edit/ts-force-query-playground) to see it in action!

{% hint style="warning" %}
Builder is not fully "type-safe"... It's still possible to generate invalid queries!
{% endhint %}

### Example

```typescript
let qry = buildQuery(Account, fields => ({
    select: [
      fields.select('name'),
      ...fields.parent('owner').select('name', 'phone'),
      fields.subQuery('contacts', subFields => {
        return {
          select: [
            subFields.parent('createdBy').select('managerId'),
            subFields.select('phone')
          ],
          where: [
            { field: subFields.select('otherCity'), op: 'LIKE', val: '%YORK' },
            'OR',
            { field: subFields.select('mailingCity'), op: 'LIKE', val: '%YORK' }
          ]
        }
      })
    ],
    where: [
      { field: fields.select('name'), op: '=', val: 'Acme' }
    ],
    orderBy: { field: fields.select('rating'), order: 'DESC' },
    limit: 5,
    offset: 5
});
```

**Outputs**

```sql
SELECT Name, Owner.Name, Owner.Phone,
 (
    SELECT CreatedBy.ManagerId, Phone 
      FROM Contacts 
      WHERE OtherCity LIKE '%YORK' OR MailingCity LIKE '%YORK'
 )
FROM Account
WHERE Name = 'Acme'
ORDER BY Rating DESC
LIMIT 5 OFFSET 5
```

