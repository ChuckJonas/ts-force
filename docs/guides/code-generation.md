# Code Generation

While some aspects of `ts-force` can be used without it, the real power of this library comes from generated classes. The code generation command has been split out to the `ts-force-gen` package so that it can easily be excluded from production builds.

Generation is controlled via a json config file. A default file can be initialized by running `ts-force-gen --init`

```javascript
{
  "$schema": "https://raw.githubusercontent.com/ChuckJonas/ts-force/master/ts-force-gen/ts-force-config.schema.json",
  "sObjects": [
    "Account",
    "Contact"
  ],
  "auth": {
    "username": "charlie+wtr21-dxdl@force.com"
  },
  "outPath": "./src/generated/"
}
```

## Authorization

Several methods are provided to handle authorization. The recommended approach is to use the `sfdx-cli` connected orgs \(as shown above\).

{% hint style="info" %}
You should always generated classes using a profile that represents the END USER of the application. Using Permissions Sets makes it easier to manage.
{% endhint %}

## SObject Config

The `sObjects` array can accept either a `string` of the API name or an object with additional configuration.

### Naming Conflicts

If two fields or SObjects sanitize to the same name, the latter one processed with be appended with a number:

```text
# SObject
Account    -> Account
Account__c -> Account1

# Field
Name    -> name
Name__c -> name1
```

Custom field mappings can be defined on an individual "SObject Config" to better control conflicts:

```javascript
{
  "apiName": "Account__c",
  "className": "CustomAccount",
  "fieldMappings": [
    {
      "apiName" : "Name__c",
      "propName": "customName"
    }
  ]
}
```

## Handling Namespaces

TODO

## Generating Picklist

TODO

