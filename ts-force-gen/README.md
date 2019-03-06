# ts-force-gen

[![alt text](https://travis-ci.org/ChuckJonas/ts-force-gen.svg?branch=master)](https://travis-ci.org/ChuckJonas/ts-force-gen)
[![alt text](https://img.shields.io/npm/v/ts-force-gen.svg)](https://www.npmjs.com/package/ts-force-gen)
[![alt text](https://img.shields.io/badge/license-BSD--3--CLAUSE-blue.svg)](https://github.com/ChuckJonas/ts-force-gen/blob/master/LICENSE)

A command line utility for generating SObject classes to use with [ts-force](https://www.npmjs.com/package/ts-force)

`npm install ts-force-gen`

## Usage

### Generate code

Files can be generated using the following command:

`ts-force-gen`

***NOTE: Because these generated files control seralization of readonly properties, you should generated the classes using a user that as the same permissions as the end user.***

#### Configuartions file

A json configuration file can be passed in via the `--config|c` arg:

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

*enviroment configuration:*

You can also authinicate via Username/Password via enviroment variables by setting the `-e` flag (helpful for CI or build processes):

`ts-force-gen -e -o 'Account,Contact'`

The following variables must be set on in your enviroment:

```bat

CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =

```

#### Commandline Args

Most args can also be passed in directly via the command line.  Config File & args will be merged with args taking presidence.

- `--username|-u`: If specified with password, generation will attempt to use username/password flow.  If specified without password, will attempt to retrieve token and instance url using `sfdx force:org:display` (Requires that [sfdx cli](https://developer.salesforce.com/tools/sfdxcli) is installed).
- `--password|-p`: password to use in auth flow
- `--clientId|-c`: client Id of connected app for username/password auth flow
- `--clientSecret|-s`: client Secret of connected app for username/password auth flow
- `--accessToken|-a`: access token to connect to tooling API with.  Not required if using the user/pass or dx flows
- `--instanceUrl|-i`: instance of the org your connecting with.  Not required if using the user/pass or dx flows
- `--sobs|-s`: list of comma seperated sobs to generate classes for
- `--outputFile|-o`: where to save the output
- `--config|-j`: path to config JSON file.  If specified, all above args will pull from file instead
- `-e`: authinicate using .env vars

#### generated classes

Decorators are used to determine how to map query responses and which fields we can send to which methods.

Properties will be transformed from api names to the standard javascript convention: `My_Object__c -> myObject`.

#### extending generated classes

Obviously don't change the generated classes if possible unless you want to deal with "merge hell" when you need to regenerate.

Will add details on how to extend once I figure it out myself (mix-ins?).

## Contributing

Contributions are encouraged!

### Running Tests

In order to run unit test you must first create a .env.test file with the following credentals that link to a valid salesforce account

```bat

CLIENT_ID =
CLIENT_SECRET =
USERNAME =
PASSWORD =
HOST =

```

***WARNING: TESTS WILL RUN DML IN THIS ORG!!!! While they attempt to reset state after complete, failed tests could result in test data being left behind ***

Then run:

- `npm run build`: to make sure the program is built
- `npm run generate-test-code`: to generated classes which are used in the tests
- `npm test`:to run tests which assert the generated classes are valid & working