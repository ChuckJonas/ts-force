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

export interface MappedListenOptions<T extends RestObject> extends BaseSubscribeOptions {
    sObjectType: SObjectStatic<T>; // optional, if set we will pass a mapped event into the stream
    onEvent: (event: MappedStreamingEvent<T>) => void;
}

export interface ListenOptions extends BaseSubscribeOptions {
    onEvent: (event: StreamingEvent) => void;
}

interface BaseSubscribeOptions {
    topic: string;
}


export class SObjectStream {

    private client: Rest;
    private listener: CometD;
    private subscribers: Map<string, SubscriptionHandle>;

    /**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor(client?: Rest) {
        this.client = client || new Rest();
        this.listener = new CometD();
        this.subscribers = new Map<string, SubscriptionHandle>();
        this.listener.configure({
            url: `${this.client.config.instanceUrl}/cometd/${this.client.config.version.toFixed(1)}/`,
            requestHeaders: { Authorization: `OAuth ${this.client.config.accessToken}` },
            appendMessageTypeToURL: false,
        });
        console.log(this.listener.unregisterTransport('websocket'));

        // console.log(this.listener.unregisterTransport('Websocket'));

    }

    /**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {ListenOptions} opts:
     *   - topic: the topic to listen to
     *   - handler: the function to call when a new steaming event is received.  Takes a `StreamingEvent` as a param
     * @returns the cometd listener
     */
    public subscribe(opts: ListenOptions): Promise<SubscriptionHandle>;
    public subscribe<T extends RestObject>(opts: MappedListenOptions<T>): Promise<SubscriptionHandle>;
    public subscribe<T extends RestObject>(opts: MappedListenOptions<T> | ListenOptions): Promise<SubscriptionHandle> {

        return new Promise((resolve, reject) => {
            if (this.listener.isDisconnected()) {
                reject('Streaming Listener is not connected!  Must run connect first!');
            }
            let { topic } = opts;

            // Subscribe to receive messages from the server.
            let topicUri = `/topic/${topic}`;
            let subscriber = this.listener.subscribe(
                topicUri,
                // data handler
                (m: { data: any }) => {
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
                },
                // success handler
                (message) => {
                    if (message.successful) {
                        this.subscribers.set(topicUri, subscriber);
                        resolve(subscriber);
                    } else {
                        reject(message);
                    }
                }
            )
        });
    }

    public unsubscribe = (topic: string) => {
        return new Promise((resolve, reject) => {
            let topicUri = `/topic/${topic}`;
            if (this.subscribers.has(topicUri)) {
                let subscriber = this.subscribers.get(topicUri);
                this.listener.unsubscribe(subscriber, (m) => {
                    if (m.successful) {
                        resolve();
                    } else {
                        reject(m);
                    }
                });
            } else {
                reject(`No subscriber for ${topic} found`);
            }
        })

    }

    public connect = () => {
        return new Promise((resolve, reject) => {
            this.listener.handshake((resp) => {
                if (resp.successful) {
                    resolve()
                } else {
                    reject(resp)
                }
            });
        });
    }

    public disconnect = () => {
        return new Promise((resolve, reject) => {
            this.listener.disconnect(m => {
                if (m.successful) {
                    resolve();
                } else {
                    reject(m);
                }
            });
        });
    }

    public isConnected = () => {
        return !this.listener.isDisconnected();
    }

}

function isMappedListenOptions(shape: any): shape is MappedListenOptions<any> {
    return (shape as any).sObjectType !== undefined;
}
