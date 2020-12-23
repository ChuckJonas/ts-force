# Resolving Fields

The `FieldResolver` class allows you to generate field API names via the properties & relationships on the objects. 

### `select()`

Accepts one or more non-relationship properties key or `FunctionField` 

Field functions can be used in SELECT or WHERE clauses. Aggregate functions will require that your query includes `GROUP BY`, however, this is not enforced by this library.

```typescript
//you can generate SOQL functions using the FunctionField Type
fields.select({fn: 'COUNT', field: 'id', alias: 'c'})// returns "COUNT(Id) c"
//these can be use along side regular key selects or other function selects
fields.select({fn: 'COUNT', field: 'id', alias: 'c'}, name)// returns "['COUNT(Id) c', name]"
```

### `parent()`

`parent(relationship: K extends Parent Keys)` allows you to traverse a parent relationship. Returns a new `FieldResolver` for the parent SObject type \(`T[K]`\)

```typescript
//example showing how relationships paths are built using parent().  typically these would be chained
let fields = new FieldResolver(Contact); //base SObject to build paths from
let accFields = fields.parent('account');
let customObjectFields = accFields.parent('myCustomObject');
let selected = customObjectFields.select('name', 'customField')
//result: ['Account.My_Custom_Object__r.Name', 'Account.My_Custom_Object__r.Custom_Field__c']
```

### `subQuery()`

`subQuery(childRelationship: K extends Child Keys, subqry: (fields: FieldResolver<T[K]>) => SOQLQueryParams))` allows you to generate a subquery. The first parameter is a key of a child relationship. The second parameter is a function, which accepts a FieldResolver for the child SObject type and return the subquery to generate.

**NOTE:** You will only be able to reference relationships for models you have generated. However, you can always manually set any fields if you need to query a relationship outside your models, by simply passing strings instead of using the `FieldResolver`

