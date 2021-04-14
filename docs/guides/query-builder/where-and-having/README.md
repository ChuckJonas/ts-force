# WHERE & HAVING

## Structure

The `where` and `having` clauses use the following format:

```text
WHERE: = [ CONDITION | ('AND'|'OR') | WHERE ],
CONDITION: = {field, op, val} | {field, op, subqry}
```

{% tabs %}
{% tab title="1 AND 2" %}
```typescript
//...
where: [
    { field: f.select('name'), op: '=', val: 'acme' },
    { field: f.select('annualRevenue'), op: '>=', val: 100 }
]
```
{% endtab %}

{% tab title="OUTPUT" %}
```sql
WHERE Name = 'acme' AND AnnualRevenue >= 100
```
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="1 OR 2" %}
```typescript
where: [
    { field: f.select('name'), op: '=', val: 'acme' },
    'OR',
    { field: f.select('annualRevenue'), op: '>=', val: 100 }
]
```
{% endtab %}

{% tab title="OUTPUT" %}
```sql
WHERE Name = 'acme' OR AnnualRevenue >= 100
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
* putting `AND` between conditions is optional.  If left out, it will be implied \(but may be included for readability\)
* If `op` is omitted, it defaults to either `=` or`IN` depending on the `val` type
* nothing prevents multiple LogicalConditions \(`AND|OR`\) from occurring back to back.  If this happens, the last condition will be used
{% endhint %}

### Nesting Conditions

Conditions can be grouped/nested in parentheses by starting a new array

{% tabs %}
{% tab title="1 AND \(2 OR 3\)" %}
```typescript
 where: [
    { field: f.select('name'), op: '=', val: 'acme' },
    'AND',
    [
        { field: f.select('annualRevenue'), op: '>=', val: 100 },
        'OR',
        { field: f.select('active'), op: '=', val: true }
    ]
]
```
{% endtab %}

{% tab title="OUTPUT" %}
```sql
WHERE Name = 'acme' 
AND (AnnualRevenue >= 100 OR Active__c = true)
```
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="\(1 OR 2\) AND \(3 OR 4\)" %}
```typescript
where: [
    [
        { field: f.select('name'), op: '=', val: 'acme' },
        'OR',
        { field: f.select('name'), op: '=', val: 'stark' },
    ],
    'AND',
    [
        { field: f.select('annualRevenue'), op: '>=', val: 100 },
        'OR',
        { field: f.select('active'), op: '=', val: true }
    ]
]
```
{% endtab %}

{% tab title="OUTPUT" %}
```sql
WHERE 
  (Name = 'acme' OR Name = 'stark')
  AND 
  (AnnualRevenue >= 100 OR Active__c = true)
```
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="1 OR \(2 AND \(3 OR 4\) \)" %}
```typescript
where: [
    { field: f.select('name'), op: '=', val: 'acme' },
    'OR',
    [
        { field: f.select('annualRevenue'), op: '>=', val: 100 },
        'AND',
        [
            { field: f.select('active'), op: '=', val: true },
            'OR',
            { field: f.select('accountSource'), op: '=', val: 'web' }
        ]
    ]
]
```
{% endtab %}

{% tab title="OUTPUT" %}
```sql
WHERE
  Name = 'acme'
  OR (
    AnnualRevenue >= 100
    AND (
      Active__c = true
      OR AccountSource = 'web'
    )
  )
```
{% endtab %}
{% endtabs %}

## Value Rendering

Condition values are automatically converted based on their type:

### **`string`**

```typescript
{ field: f.select('name'), op: '=', val: 'acme' }
//-> Name = 'acme'
```

### `string[]`

```typescript
{ field: f.select('name'), op: 'IN', val: ['acme', 'stark'] }
//-> Name IN ('acme', 'stark')
```

### **`number`**

```typescript
{ field: f.select('annualRevenue'), op: '>', val: 100 } 
//-> AnnualRevenue > 100
```

### **`boolean`**

```typescript
{ field: f.select('active'), op: '=', val: false }
//-> Active__c = false
```

### **`Date`**

```typescript
{ field: f.select('createdDate'), op: '<', val: new Date() }
//-> CreatedDate < 2020-12-23T02:44:49z
```

