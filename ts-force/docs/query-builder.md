
# Type Safe Query building

This library allows for the generation of type-safe* queries, by using generated classes to resolve fields.

## Resolving Fields

The `FieldResolver` allows you to generate field API names via the properties & relationships on the objects.
It has the following methods:

`select(field: K|K[]): string|string[]`: Accepts one or more non-relationship properties or `FunctionField`s (see examples) from the generated SObject and returns a `string|string[]` of the API name(s) for each field (based on how many keys are passed in).  Includes the relationship paths of any previously traversed relationships via the `parent()` method.

Field functions can be used in SELECT or WHERE clauses.  Aggregate functions will require that your query includes `GROUP BY`, however, this is not enforced by this library

```typescript
//you can generate SOQL functions using the FunctionField Type
fields.select({fn: 'COUNT', field: 'id', alias: 'c'})// returns "COUNT(Id) c"
//these can be use along side regular key selects or other function selects
fields.select({fn: 'COUNT', field: 'id', alias: 'c'}, name)// returns "['COUNT(Id) c', name]"
```

`parent(relationship: K extends Parent Keys)` allows you to traverse a parent relationship.  Returns a new `FieldResolver` for the parent SObject type (`T[K]`)

```typescript
//example showing how relationships paths are built using parent().  typically these would be chained
let fields = new FieldResolver(Contact); //base SObject to build paths from
let accFields = fields.parent('account');
let customObjectFields = accFields.parent('myCustomObject');
let selected = customObjectFields.select('name', 'customField')
//result: ['Account.My_Custom_Object__r.Name', 'Account.My_Custom_Object__r.Custom_Field__c']
```

`subQuery(childRelationship: K extends Child Keys, subqry: (fields: FieldResolver<T[K]>) => SOQLQueryParams))` allows you to generate a subquery.  The first parameter is a key of a child relationship. The second parameter is a function, which accepts a FieldResolver for the child SObject type and return the subquery to generate.

**NOTE:** You will only be able to reference relationships for models you have generated.  However, you can always manually set any fields if you need to query a relationship outside your models, by simply passing strings instead of using the `FieldResolver`

## WHERE & HAVING Conditions

The `where` and `having` clauses use the following format:

```
WHERE: = [ CONDITION | ('AND'|'OR') | WHERE ],
CONDITION: = {field, op, val} | {field, op, subqry}
```

**1 AND 2**

```typescript
where: [
    { field: fields.select('name'), op: '=', val: '123' },
    { field: fields.select('annualRevenue'), op: '>=', val: 123 }
]
```

**1 OR 2**

```typescript
where: [
    { field: fields.select('name'), op: '=', val: '123' },
    'OR',
    { field: fields.select('annualRevenue'), op: '>=', val: 123 }
]
```

- putting `AND` between conditions is option.  If left out, it will be implied (but may be included for readability)
- If `op` is omitted, it defaults to either `=` | `IN` depending on the `value`
- Nested arrays are grouped using parentheses
- unfortunately, nothing prevents multiple LogicalConditions (`AND|OR`) from occurring back to back.  If this happens, the last condition will be used

### Value Rendering

Condition values are automatically converted based on their type:

**string**

```typescript
// Name = 123
{ field: fields.select('name'), op: '=', val: '123' }
```

**string[]**

```typescript
// Name IN ('123','456')
{ field: fields.select('name'), op: 'IN', val: ['123', '456'] }
```

**boolean**

```typescript
// Active__c = false
{ field: fields.select('active'), op: '=', val: false }
```

**sub query**

Sub-queries can be made my forming an new query using `buildQuery()`

```typescript
let qry = buildQuery(Account, fields => {
    return {
        select: [fields.select('id')],
        where: [
            {
                field: fields.select('id'),
                op: 'IN',
                subqry: buildQuery(Contact, cFields => {
                    return { select: [cFields.select('accountId')]}
                })
            }
        ]
    }
})
//SELECT Id FROM Account WHERE Id IN (SELECT AccountId FROM Contact)
```

### Nesting conditions

Conditions can be grouped/nested in parentheses by starting a new array



**1 AND (2 OR 3)**

```typescript
 where: [
    { field: fields.select('name'), op: '=', val: '123' },
    'AND',
    [
        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
        'OR',
        { field: fields.select('active'), op: '=', val: true }
    ]
]
```

**(1 OR 2) AND (3 OR 4)**

```typescript
where: [
    [
        { field: fields.select('name'), op: '=', val: '123' },
        'OR',
        { field: fields.select('name'), op: '=', val: '456' }
    ],
    'AND',
    [
        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
        'OR',
        { field: fields.select('active'), op: '=', val: true }
    ]
]
```

**1 OR (2 AND (3 OR 4))**

```typescript
where: [
    { field: fields.select('name'), op: '=', val: '123' },
    'OR',
    [
        { field: fields.select('annualRevenue'), op: '>=', val: 123 },
        'AND',
        [
            { field: fields.select('active'), op: '=', val: true },
            'OR',
            { field: fields.select('accountSource'), op: '=', val: 'web' }
        ]
    ]
]
```

### End to End Example


```typescript
let qry = buildQuery(Account, fields => {
    return {
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
    }
});
```

Outputs

```sql
SELECT Name, Owner.Name, Owner.Phone,
    (SELECT CreatedBy.ManagerId, Phone FROM Contacts WHERE OtherCity LIKE '%YORK' OR MailingCity LIKE '%YORK'
FROM Account
WHERE Name = 'Acme'
ORDER BY Rating DESC
LIMIT 5 OFFSET 5
```

## Legal

License MIT

This library has borrowed type definitions from [soql-parser-ts](https://github.com/paustint/soql-parser-js) by Austin Turner.