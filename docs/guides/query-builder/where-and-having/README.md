# WHERE & HAVING

The `where` and `having` clauses use the following format:

```text
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



{% hint style="info" %}
* putting `AND` between conditions is optional.  If left out, it will be implied \(but may be included for readability\)
* If `op` is omitted, it defaults to either `=` \| `IN` depending on the `value`
* Nested arrays are grouped using parentheses
* unfortunately, nothing prevents multiple LogicalConditions \(`AND|OR`\) from occurring back to back.  If this happens, the last condition will be used
{% endhint %}

## Value Rendering

Condition values are automatically converted based on their type:

### **`string`**

```typescript
{ field: fields.select('name'), op: '=', val: '123' } 
//-> Name = '123'
```

### `string[]`

```typescript
{ field: fields.select('name'), op: 'IN', val: ['123', '456'] }
//-> Name IN ('123','456')
```

### **`number`**

```typescript
{ field: fields.select('revenue'), op: '>', val: 100 } 
//-> Revenue__c > 100
```

### **`boolean`**

```typescript
{ field: fields.select('active'), op: '=', val: false }
//-> Active__c = false
```

### **`Date`**

```typescript
{ field: fields.select('createdDate'), op: '<', val: new Date() }
//-> CreatedDate < 2020-12-23T02:44:49z 
```

## Nesting conditions

Conditions can be grouped/nested in parentheses by starting a new array

**1 AND \(2 OR 3\)**

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

**\(1 OR 2\) AND \(3 OR 4\)**

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

**1 OR \(2 AND \(3 OR 4\)\)**

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

