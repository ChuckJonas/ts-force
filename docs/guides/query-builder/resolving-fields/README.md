# FieldResolver

The **`FieldResolver`** class allows you to generate field API names via the properties & relationships on the objects. 

{% hint style="info" %}
**NOTE:** You will only be able to reference relationships for models you have generated. However, you can always manually set any fields if you need to query a relationship outside your models, by simply passing strings instead of using the `FieldResolver`
{% endhint %}

### `select`

Accepts one or more non-relationship properties key or `FunctionField` 

```typescript
const f = new FieldResolver(Account);
f.select('name'); //-> Name
f.select('name', 'myCustomField'); //-> ['Name', 'My_Custom_Field__c']
f.select({fn: 'COUNT', field: 'id', alias: 'c'}); //-> "COUNT(Id) c"
```

### `parent()`

Allows you to traverse to a parent relationship. Returns a new `FieldResolver` for the parent SObject type.  Keeps track of "where it's been" so resulting fields are fully qualified.  Can go multiple levels deep, but SOQL only supports a depth of 5.

```typescript
let f = new FieldResolver(Contact);
f.parent('account').select('name'); //-> Account.Name
f.parent('account').parent('owner').select('email'); //-> Account.Owner.Email
```

### `subQuery()`

Allows you to generate a "sub query" on a child relationship, to be used inside a SELECT statement of the parent object. The first parameter is a key of a child relationship. The second parameter is a function, which accepts a `FieldResolver` for the child SObject type and return the subquery to generate.

```typescript
const contactQuery = (cF: FieldResolver<Contact>): SOQLQueryParams => ({
  select: [ 
    ...cF.select('name', 'birthdate'),
    cF.parent('owner').select('name') 
  ],
  where: [
    { field: cf.select('email'), op: '!=', val: null }
  ]
});

buildQuery(Account, (aF) => ({
  select: [ aF.subQuery('contacts', contactQuery) ],
}));

/* ->
SELECT (
   SELECT Name, Birthday, Owner.Name FROM Contacts WHERE Email != null
 ) FROM Account
*/
```

{% hint style="info" %}
* `subquery` is ONLY valid to be called from the top-level resolver
* outputs of`subQuery` can ONLY be used in inside SELECT clauses
{% endhint %}

### Advanced Usage

To see the real power of the `FieldResolver` checkout the sections on [SELECT Models](select-models.md) and [WHERE Filters](where-filters.md).

