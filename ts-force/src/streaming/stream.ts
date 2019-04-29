import { Rest, SObjectStatic, StreamConnection } from '..';
import { CometD } from 'cometd';
import { RestObject } from '../rest/restObject';
import { SObject } from '../rest/sObject';
export { CometD as StreamConnection } from 'cometd';

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
    handler: (event: MappedStreamingEvent<T>) => void;
}

export interface ListenOptions {
    topic: string;
    handler: (event: StreamingEvent) => void;
}

export class SObjectStream {

    private client: Rest;

    /**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor (client?: Rest) {
        this.client = client || new Rest();
    }

    /**
     * Creates a SObjectStream which can listen to streaming events
     * @param  {ListenOptions} opts:
     *   - topic: the topic to listen to
     *   - handler: the function to call when a new steaming event is received.  Takes a `StreamingEvent` as a param
     * @returns the cometd listener
     */
    public listen (opts: ListenOptions): StreamConnection;
    public listen<T extends RestObject> ( opts: MappedListenOptions<T>): StreamConnection;
    public listen<T extends RestObject> ( opts: MappedListenOptions<T> | ListenOptions): StreamConnection {

        let {topic} = opts;

        const listener = new CometD();
        listener.configure({
            url: `${this.client.config.instanceUrl}/cometd/${this.client.config.version.toFixed(1)}/`,
            requestHeaders: { Authorization: `OAuth ${this.client.config.accessToken}` },
            appendMessageTypeToURL: false
        });

        listener.handshake((handshakeResp: any) => {
            if (handshakeResp.successful) {
              // Subscribe to receive messages from the server.
              listener.subscribe(`/topic/${topic}`, (m: any) => {
                if (isMappedListenOptions(opts)) {
                    const {event, sobject: sObject} = m.data as StreamingEvent;
                    let mappedEvent: MappedStreamingEvent<T> = {
                        event,
                        sObject: opts.sObjectType.fromSFObject(sObject)
                    };
                    return opts.handler(mappedEvent);
                }else {
                    return opts.handler(m.data);
                }
              });
            }
        });

        return listener;
    }
}

function isMappedListenOptions (shape: any): shape is MappedListenOptions<any> {
    return (shape as any).sObjectType !== undefined;
}
