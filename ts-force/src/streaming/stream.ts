import { Rest, SObjectStatic } from '..';
import { CometD, SubscriptionHandle } from 'cometd';
import { RestObject } from '../rest/restObject';
import { SObject } from '../rest/sObject';

export interface StreamingEvent {
    event: {
        createdDate: Date,
        replayId: number,
        type: SteamEventType
    };
    sobject: SObject;
}

export interface MappedStreamingEvent<T extends RestObject> {
    event: {
        createdDate: Date,
        replayId: number,
        type: SteamEventType
    };
    sObject: T;
}

export type SteamEventType = 'created' | 'updated' | 'deleted' | 'undeleted';

export interface MappedListenOptions<T extends RestObject> {
    topic: string;
    sObjectType: SObjectStatic<T>; // optional, if set we will pass a mapped event into the stream
    onSubscriptionChange: (m: any) => void;
    onEvent: (event: MappedStreamingEvent<T>) => void;
}

export interface ListenOptions {
    topic: string;
    onSubscriptionChange: (m: any) => void;
    onEvent: (event: StreamingEvent) => void;
}

export class SObjectStream {

    private client: Rest;
    private listener: CometD;
    private connected: boolean;

    private subscribers: Map<string, {subscriber: SubscriptionHandle, connected: boolean, onSubscriptionChange?: (m) => void}>;
    /**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor (client?: Rest) {
        this.client = client || new Rest();
        this.subscribers = new Map<string, {subscriber: SubscriptionHandle, connected: boolean, onSubscriptionChange?: (m) => void}>();
        this.listener = new CometD();
        this.listener.configure({
            url: `${this.client.config.instanceUrl}/cometd/${this.client.config.version.toFixed(1)}/`,
            requestHeaders: { Authorization: `OAuth ${this.client.config.accessToken}` },
            appendMessageTypeToURL: false
        });

    }

/**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {ListenOptions} opts:
     *   - topic: the topic to listen to
     *   - handler: the function to call when a new steaming event is received.  Takes a `StreamingEvent` as a param
     * @returns the cometd listener
     */
    public subscribe (opts: ListenOptions): SubscriptionHandle;
    public subscribe<T extends RestObject> (opts: MappedListenOptions<T>): SubscriptionHandle;
    public subscribe<T extends RestObject> (opts: MappedListenOptions<T> | ListenOptions): SubscriptionHandle {

        if (!this.connected) {
            throw new Error('Streaming Listener is not connected!  Must run connect first!');
        }
        let { topic, onSubscriptionChange } = opts;

        // Subscribe to receive messages from the server.
        let topicUri = `/topic/${topic}`;
        let subscriber = this.listener.subscribe(`/topic/${topic}`, (m: { data: any }) => {
            if (isMappedListenOptions(opts)) {
                const { event, sobject: sObject } = m.data;
                let mappedEvent: MappedStreamingEvent<T> = {
                    event,
                    sObject: opts.sObjectType.fromSFObject(sObject)
                };
                return opts.onEvent(mappedEvent);
            } else {
                return opts.onEvent(m.data);
            }
        }, (message) => { console.log('other handler', message.data, message.successful); });
        console.log(subscriber.id);
        this.subscribers.set(topicUri, {
            subscriber: subscriber,
            connected: false,
            onSubscriptionChange
        });
        return subscriber;
    }

    public unsubscribe = (topic: string) => {
        if (this.subscribers.has(topic)) {
            let {subscriber, connected} = this.subscribers.get(topic);
            this.listener.unsubscribe(subscriber, (m) => {
                console.log(m);
            });
        }
    }

    public connect = (onResponse: (m) => void) => {
        console.log('connecting');
        this.listener.handshake((handshakeResp) => {
            console.log('response', handshakeResp);
            if (handshakeResp.successful) {
                this.connected = true;
                // setup subscriber listener to managed status
                this.listener.addListener(`/meta/subscribe`, (m: any) => {
                    console.log(`/meta/subscribe`, m);
                    let subscriber = this.subscribers.get(m.subscription);
                    subscriber.onSubscriptionChange(m);
                    // update subscribers connected status ?
                });
            }else {
                console.log('Failed to Connect', handshakeResp);
            }
            onResponse(handshakeResp);
        });
    }

    public disconnect = () => {
        console.log('disconnecting');
        this.listener.disconnect(m => {
            this.connected = false;
            console.log(m);
        });
    }

}

function isMappedListenOptions (shape: any): shape is MappedListenOptions<any> {
    return (shape as any).sObjectType !== undefined;
}
