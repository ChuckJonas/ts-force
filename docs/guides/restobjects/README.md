# RestObjects

In this guide we use the term "**RestObject**" to refer to the classes generated for your Salesforce sObjects.

Most of the functionality of this library built around the **RestObject**.

"**RestObjects" provide the following capabilities:**

* mapping between the javascript naming conventions and the Salesforce API names
* `CRUD` operations
* Tracking of modified fields \(allows sending updates of only changes\)
* Metadata information about fields

## Construction

```typescript
import { Account } from './generated';

// properties can be set during construction
const acc1 = new Account({
   name: 'hello world',
   revenue: 100
});

// or cloned from another Account
const acc2 = new Account(acc1);
```



