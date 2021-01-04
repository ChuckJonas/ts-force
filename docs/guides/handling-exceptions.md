# Handling Exceptions

When a request fails, the resulting error could be of a few different shapes. To make it easier to handle, there is a method `getStandardError(e: Error)`.

This method does two things:

1. It parses the error details \(`errorDetails`\) to a `{message: string, errorCode?: string}[]`.
2. It classifies the error \(`e`\) as one of three types: `any|axios|composite`, making it possible to type discriminate the raw exception details if needed.

```javascript
try{
    //bad request
    await Account.retrieve('SELECT Id, Foo FROM Account');
}catch(e){
    let stderr = getStandardError(e);
    //draft message for user
    let showUIError = stderr.errorDetails.map(eDet => `${eDet.errorCode}: ${eDet.message}`).join(',');
    //thrown error can be type discriminated
    switch(stderr.type){
        case 'any':
            console.log(stderr.e.message);
            break;
        case 'axios':
            console.log(stderr.e.request);
            console.log(stderr.e.response);
            break;
        case 'composite':
            console.log(stderr.e.compositeResponses);
            break;
    }
}
```

