# Changelog

## 3.0.0-rc.x

- Added support for `queryAll` (`ALL ROWS`) in retrieve methods
- Added "High Volume" retrieve mode for better performance and efficiency 
- Blank relationships will now be set `null` instead of as empty `RestObject` #72
- Blank queried fields are set as `null` instead of `undefined` #73
- `Date` is now represented as `CalendarDate` instead of js `Date` #69
- generation can now use default sfdx-cli user #76
- more consistent casing for name sanitation #82
- ability to remove namespace #66
- fixed relationships parsing when data comes from @remoteaction
- removed limit on request size
- fixed `Name` object imports in generation
- fixed various types

## 2.7.0

- Added default de-duping property name logic

**NOTE** Must use typescript > 3.4.x to use classes generated with picklists!

## 2.6.x

- various type fixes
- better multi-picklist support

## 2.5.0

- Changed picklist away from namespaces to use `as const`

**NOTE** Must use typescript > 3.4.x to use classes generated with picklists!

## 2.4.0

- added `Streaming` class for streaming and platform events
- added `limits()` method to query full limits data
- `Rest` client now captures rest limits from header (thxs @joeruello)
- fixed missing optional Rest instance `retrieve` method on generated classes (thxs @joeruello)

## 2.2.3

- Added `json.schema` for `ts-force-config.json`
- changed sfdx user login to use @salesforce/core instead of `exec`

## 2.2.1

- restarted changelog :0
- added optional picklist enums generation
- added optional restrictive types
- mapping of multi-picklists to arrays

## 2.1.24

- improved stability of release process
- combined projects together in one repo

**WARNING: versions prior to 2.1.x did not follow semver**

## 2.1.0

- major performance optimization on retrieve calls (+70% improvement!)
- Added `readonly` to generated fields which cannot be written to salesforce
- reduced generated class size.  Removed SObjectFields concrete interface in favor for mapped type
- Allow generation to multiple files

## 2.0.3

- Added `getStandardError()` for better error handling

## 2.0.2

- Added `buildQuery()`
- Made updates ONLY send fields that have been explicitly set by default.  MUST OVERRIDE to send queried fields
- added support for multiple connections to generated objects
- better support for custom rest services

### upgrading from 1.x.x

- Regenerate Classes
- change any refresh update calls from `sob.update(true)` to `sob.update({refresh: true})`
- change any `CompositeBatch.addUpdate` calls with callback params to `{callback:()=>{}}`
- if you want to include fields returned from query in update request use `sob.update({sendAllFields: true})`
- Changed Batch to accept
- change any references from `prepareForDML` to new `prepareFor` method
- if running on IE11, you must [polyfill-proxy](https://www.npmjs.com/package/proxy-polyfill)

## 1.x

- alpha/beta changes not documented
