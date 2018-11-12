#Changelog

## 2.0.0

- Added `buildQuery()`
- Made updates ONLY send fields that have been explicitly set by default.  MUST OVERRIDE to send queried fields
- added support for multiple connections to generated objects
- better support for custom rest services

### Upgrade instructions

- Regenerate Classes USING `ts-force-gen:1.5.0`
- change any refresh update calls from `sob.update(true)` to `sob.update({refresh: true})`
- change any `CompositeBatch.addUpdate` calls with callback params to `{callback:()=>{}}`
- if you want to include fields returned from query in update request use `sob.update({sendAllFields: true})`
- Changed Batch to accept
- change any references from `prepareForDML` to new `prepareFor` method
- if running on IE11, you must [polyfill-proxy](https://www.npmjs.com/package/proxy-polyfill)