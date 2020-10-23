### upgrading from to 2.x from 1.x

- Regenerate Classes
- change any refresh update calls from `sob.update(true)` to `sob.update({refresh: true})`
- change any `CompositeBatch.addUpdate` calls with callback params to `{callback:()=>{}}`
- if you want to include fields returned from query in update request use `sob.update({sendAllFields: true})`
- Changed Batch to accept
- change any references from `prepareForDML` to new `prepareFor` method
- if running on IE11, you must [polyfill-proxy](https://www.npmjs.com/package/proxy-polyfill)
