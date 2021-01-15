# Version 3 Upgrade Guide

## API Name Sanitation

The API name sanitation in 3.x has been improved for more consistent results. However, when you regenerate your SObject classes, this may result in property names being changed. **Carefully review changes after generating new classes and make sure to update any code which is impacted.**

### Examples:

API NAME: `Number_of_Units__c` 2.x: `numberofUnits` 3.x: `numberOfUnits`

API NAME: `Date_Of_SLA__c` 2.x: `dateOfSla` 3.x: `dateOfSLA`

API NAME: `SLA_Date__c` 2.x: `sLADate` 3.x: `slaDate`

API NAME: `Zendesk__Domain_Mapping__c` 2.x: `zendeskCreateInZendesk` 3.x: `createInZendesk`

_NOTE: Namespaces can be kept by setting `keepNamespaces` in `ts-force-config.json`_

## `insert(refresh)` refactored to "opts" object

```typescript
const acc = new Account();

// < 3.1

acc.insert(true);

// >= 3.1

acc.insert({refresh: true});
```

## `prepareFor()`

The `prepareFor()` function has been replaced with `toJson()`. This is more flexible and supports more scenarios. The most likely place that this may have been used is when sending SObject to a custom rest endpoint or `@remoteAction` using `prepareFor('apex');`.

The same functionality can be achieved via `c.toJson({ dmlMode: 'all', sendChildObj: true, sendParentObj: true })`

## `retrieve()` accepts `QueryOpts` as second parameter

The optional second parameter of the `retrieve` function to specify the `Rest` instance has been refactored to support additional functionality. If you are specifying the Rest instance, you must refactor calls as following:

### 2.x

```typescript
const myClient = new Rest();
const res = await Account.retrieve('SELECT Id FROM Account', myClient);
```

### 3.x

```typescript
const myClient = new Rest();
const res = await Account.retrieve('SELECT Id FROM Account', { restInstance: myClient });
```

## Salesforce `Date` now represented as `CalendarDate` obj

In 2.x, salesforce `Date` fields were converted to javascript `Date` object. This caused localization issues and could result in inconsistent handling of the dates. With 3.x, we now parse these to a new object called `CalendarDate`.

```typescript
type CalendarDate = { year: number; month: number; date: number; };
```

_Note: To be consistent with other date libraries, Month is 0 based... Year and Date are 1 based_

The following helper methods are available to make this easier to work with:

* `getCalendarDate`: converts a `Date | String` to `CalendarDate`
* `calendarToDateObj`: converts a `CalendarDate` to `Date`
* `calendarToString`: converts a `CalendarDate` to `yyyy-mm-dd` format

## Queried Parent relationships no longer construct empty objects if null

In 2.x, if a queried parent object was null, this library would initialize a blank `SObject`. In 3.x the relationship will be set to `null`.

Queried child relationships with no results will result in an empty \(`[]`\) array

## Queried fields that are blank are set as `null` instead of `undefined`

In 2.x if a queried field was blank, it was set as `undefined`. In 3.x, the field will now be set as `null` to differate between "not queried" \(`undefined`\) and "queried but blank" \(`null`\)

## Replace OAuth with `requestAuthToken()`

The `OAuth` class which was used to generate a token from the "username/password oAuth flow" token has been replaced with a function that is much more flexible.

Replace:

```typescript
  const passwordConfig = new UsernamePasswordConfig(
    process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.HOST, process.env.USERNAME, process.env.PASSWORD
  );
  let oAuth = new OAuth(passwordConfig);
  await oAuth.initialize();
  setDefaultConfig(await oAuth.initialize());
```

With:

```typescript
 const resp = await requestAccessToken({
    grant_type: 'password'
    instanceUrl: process.env.HOST,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });

  setDefaultConfig(resp);
```

