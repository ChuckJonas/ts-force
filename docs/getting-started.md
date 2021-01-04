---
description: >-
  This tutorial will walk you through setting up a simple node project,
  generating code and making requests against the API.
---

# Getting Started

## Prerequisites

Before starting this guide you will need the following:

* `npm` & `node` installed on your environment
* the [sfdx-cli](https://developer.salesforce.com/tools/sfdxcli) installed and a developer or scratch ORG connected

{% hint style="warning" %}
This tutorial will create records, so do not connect with a production org!
{% endhint %}

## Project Setup

Create a new typescript project:

```bash
$ mkdir ts-force-example
$ cd ts-force-example
$ mkdir src
$ npm init
$ npm install -D typescript ts-node
$ npx tsc --init
```

Open `tsconfig.json` and add the following:

```javascript
"experimentalDecorators": true
```

{% hint style="info" %}
The generated classes use "experimentalDecorators".
{% endhint %}

## Install ts-force

```text
$ npm install ts-force
$ npm install -D ts-force-gen
```

{% hint style="info" %}
These two packages should always be on the same version!
{% endhint %}

### Configure code generation

Next we need to create the configuration file which will tell the code generator what to do:

```bash
$ npx ts-force-gen --init
```

You should now see a `ts-force-config.json` in the folder where you ran the command. It's contents should look something like this:

{% code title="ts-force-config.json" %}
```javascript
{
  "$schema": "https://raw.githubusercontent.com/ChuckJonas/ts-force/master/ts-force-gen/ts-force-config.schema.json",
  "sObjects": [
    "Account",
    "Contact"
  ],
  "auth": {
    "username": "sf_user@example.com"
  },
  "outPath": "./src/generated/"
}
```
{% endcode %}

For now, just update the `auth.username` property to a connected `sfdx-cli` username.

{% hint style="info" %}
Alternate authentication methods are supported. To see a full list of options, see  
"ts-force-config" api section
{% endhint %}

## Run Code Generation

```bash
$ npx ts-force-gen
```

After this completes, you should see that generated classes have been added to `src/generated` for the `sObjects` listed in our config.

## Using ts-force

We will again use the `sfdx-cli` obtain a Salesforce access token. To do so from node, we'll need an additional dependency:

```typescript
$ npm install @salesforce/core
```

{% hint style="info" %}
In a production environment, you would likely obtain the access token via oAuth or other means. See the "Connecting with Salesforce" section for more details.
{% endhint %}

Create a new file `src/index.ts` and add the following code

{% code title="src/index.ts" %}
```typescript
import { AuthInfo, Connection, Org } from '@salesforce/core';
import { Account, Contact } from './generated';
import { CompositeCollection, getStandardError, Rest } from 'ts-force';

// an async self invoking function (main)
(async () => {
  // setup client
  const { accessToken, instanceUrl } = await auth('sf-user@example.com'); // update username!
  const restInstance = new Rest({
    accessToken,
    instanceUrl,
  });

  // create a new account
  const acmeAccount = new Account({ name: 'acme', industry: 'manufacturing' }, restInstance);
  await acmeAccount.insert();

  console.log(acmeAccount.id);

  // create 2 contacts
  const collection = new CompositeCollection(restInstance);
  await collection.insert([
    new Contact({ accountId: acmeAccount.id, firstName: 'road', lastName: 'runner' }),
    new Contact({ accountId: acmeAccount.id, firstName: 'wile', lastName: 'coyote' }),
  ]);

  // run query contacts on "manufacturing" accounts
  const contacts = await Contact.retrieve(
    (f) => ({
      select: [...f.select('id', 'name'), ...f.parent('account').select('id', 'name')],
      where: [{ field: f.parent('account').select('industry'), val: 'manufacturing' }],
    }),
    { restInstance },
  );

  console.log(contacts.length);
  contacts.forEach((c) => console.log(c.name, c.account?.name));

  // cleanup records
  await acmeAccount.delete();
  await collection.delete(contacts);
})().catch((e) => {
  const stdErr = getStandardError(e);
  console.error(JSON.stringify(stdErr.errorDetails));
});

/* helper function to get connection for SFDX-CLI */
async function auth(username: string) {
  const authInfo = await AuthInfo.create({ username });
  const connection = await Connection.create({ authInfo });
  const org = await Org.create({ connection });
  await org.refreshAuth();
  return org.getConnection();
}
```
{% endcode %}

This code does the following:

* Creates a `Rest` instance from via a `sfdx-cli` org connection
* Inserts an `Account`
* Inserts 2 `Contacts` related to the `Account`
* Queries `Contacts` where `Account.Industry = 'manufacturing'`
* Cleans up \(deletes\) the created records

## See it in action

Use the following command to run the code:

```bash
$ npx ts-node src/index
```

## Next Steps

Check out the following resources:

* [Connecting with Salesforce](guides/connecting-with-salesforce/)
* RestObject API
* [SOQL Builder](guides/query-builder/)

