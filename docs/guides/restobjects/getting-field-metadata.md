# Getting Field Metadata

`ts-force` provides metadata about each field via the generated classes.

### via Static `FIELDS` property

```typescript
import { Contact } from './src/generated'

Contact.FIELDS.contactNotes.salesforceLabel // Contact Notes
Contact.FIELDS.contactNotes.apiName // Contact_Notes__c
Contact.FIELDS.contactNotes.required // false

```

### via "Reflection"

You can use the `getSFieldProps(sObject, fieldKey)` to dynamically get metadata information on any field:

```typescript
const contact = new Contact();
for (const key in contact) {
  if (sob.hasOwnProperty(key)) {
    const sFieldProps = getSFieldProps(sob, key);
    if (sFieldProps) {
      console.log(
        sFieldProps.salesf
        sFieldProps.apiName
      )
    }
  }
}
```



