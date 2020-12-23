# Changelog

## 3.0.0-rc.x

### Added

- Added support for `queryAll` (`ALL ROWS`) in retrieve methods 
- generation can now use default sfdx-cli user #76
- `keepNamespace` config #66
- `ts-force-gen --init` command to initialize `ts-force-config.json`
- Added `useComposite` retrieve mode for better efficiency (experimental)
- `getAuthorizationUrl` & `requestAccessToken` methods to support oAuth2 web server flow

### Changed

- Blank relationships will now be set `null` instead of as empty `RestObject` #72
- Blank queried fields are set as `null` instead of `undefined` #73
- `Date` is now represented as `CalendarDate` instead of js `Date` #69
- types to work with `strict:true`
- more consistent casing for name sanitation #82
- query builder now filters out duplicate fields
- Namespaces removed from SObjects & Properties by default
- `ts-force-gen` now defaults the config path to `ts-force-config.json` if not set
- replaced `OAuth` classes simpler & more flexible functions
### Fixed

- relationships parsing when data comes from `@RemoteAction`
- removed limit on axios request size
- fixed `Name` object imports in generation
- fixed various types
- mapping cache when generating objects for multiple orgs

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


## 1.x

- alpha/beta changes not documented
