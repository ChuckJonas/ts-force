# ts-force-gen

[![alt text](https://img.shields.io/npm/v/ts-force-gen.svg)](https://www.npmjs.com/package/ts-force-gen)

A command line utility for generating SObject classes to use with [ts-force](https://www.npmjs.com/package/ts-force)

`npm install ts-force-gen`

## Usage

### Generate code

Files can be generated using the following command:

`ts-force-gen`

***NOTE: Because these generated files control serialization of read-only properties, you should generated the classes using a user that as the same permissions as the end user.***

#### Configuration file

A json configuration file can be passed in via the `-j` arg:

`ts-force-gen -j ./config/ts-force-config.json`

*Username/Pass configuration:*

``` json
{
  "auth": {
    "username": "john@example.com",
    "password": "password1",
    "clientId": "asdgasdg",
    "clientSecret": "12314515",
    "oAuthHost": "https://na31.salesforce.com"
  },
  "sObjects": [
      "Account",
      {
        "apiName": "Contact",
        "fieldMappings": [
          {
            "apiName" : "Name__c",
            "propName": "nameCustom"
          }
        ]
      }
    ],
  "outPath": "./src/generated/sobs.ts"
}
```

*sfdx configuration:*

If you only pass the `username`, the code generator will attempt to auth using `sfdx force:org:display -u [username]` (this means you can also pass the org alias).

``` json
"auth": {
    "username": "john@example.com",
  },
```

*access token configuration:*

You can also pass the access token and instance url in directly

``` json
"auth": {
    "accessToken": "12312321",
    "instanceUrl": "https://na31.salesforce.com",
  },
```

*environment configuration:*

You can also authenticate via Username/Password via environment variables by setting the `-e` flag (helpful for CI or build processes):

`ts-force-gen -e

The following variables must be set on in your environment:

```bat

CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =

```

A JSON Schema is available to make editing the config file as easy as possible.  Simply add this line to the top of your `ts-force-config.json` file

`"$schema": "https://raw.githubusercontent.com/ChuckJonas/ts-force/master/ts-force-gen/ts-force-config.schema.json",`

#### generated classes

Decorators are used to determine how to map query responses and which fields we can send to which methods.

Properties will be transformed from api names to the standard javascript convention: `My_Object__c -> myObject`.

#### extending generated classes

It is not recommended that you edit the generated classes directly.