# Streaming API

`ts-force` support streaming and platform events, via the `Streaming` class.

## Push Topics \(Steaming API\)

The `Streaming` class has two "subscribe" methods for listening to push topics:

* `subscribeToTopic`: Provides raw data. Does NOT map resulting data to an generated class SObject
* `subscribeToTopicMapped`: Maps returned data to a generated class SObject \(type provided in first parameter\)

```typescript
let stream = new Streaming();
await stream.connect();

// sObject mapping
await stream.subscribeToTopicMapped(
    Account,                      // generated SObject static
    'MyTopic',                    // topic name to subscribe to
    e => {                        // on event callback
        let acc = e.data.sObject;
        console.log(acc.name);
    }
);
```

{% hint style="info" %}
**Tip**: Add `PushTopic`to your `ts-force-config`to create topics from code:

```javascript
let topic = new PushTopic({
    name: 'MyTopic',
    notifyForOperationCreate: true,
    description: 'for unit test',
    apiVersion: DEFAULT_CONFIG.version,
    query: buildQuery(Account, f => (
        {
            select: [
                ...f.select('id', 'name', 'active'),
            ]
        }
    ))
});
await topic.insert();
```
{% endhint %}

## Platform Events

Platform events work similar to `PushTopics` but instead you listen using `subscribeToEvent<T>`.

Automatic mapping to a Platform event generated object is not yet supported \(coming soon\), but in the meantime you can define the resulting type via the `<T>` parameterized interface.

## Disconnect / Unsubscribing

It is important to call `disconnect()` or `unsubscribe` with you are done:

```text
await stream.unsubscribe('MyTopic', 'topic'); //unsubscribes from `/topic/MyTopic`
await stream.unsubscribe('MyEvent__e', 'event'); //unsubscribes from `/event/MyEvent__e`
await stream.disconnect();                    //unsubscribes from all open subscriptions and closes client connection
```

## Using with Node

We are using the to manage subscriptions. In order for this library to run on node, you must polyfill it.

1. `npm install -s cometd-nodejs-client`
2. Before you attempt to connect your client, run: `require('cometd-nodejs-client').adapt();`

