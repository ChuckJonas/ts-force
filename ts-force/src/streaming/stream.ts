import { Rest } from '..';
import cometd from 'cometd';

export interface StreamingEvent {
    event: {
        createdDate: Date,
        replayId: number,
        type: SteamEventType
    };
    sobject: { Id: string };
}

export type SteamEventType = 'created' | 'updated' | 'deleted' | 'undeleted';

export interface ListenOptions {
    topic: string;
    handler: (event: StreamingEvent) => void;
}

export type StreamConnection = cometd.CometD;

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
    public listen = (opts: ListenOptions): StreamConnection => {
        let {topic, handler} = opts;

        const listener = new cometd.CometD();
        listener.configure({
            url: `${this.client.config.instanceUrl}/cometd/${this.client.config.version.toFixed(0)}/`,
            requestHeaders: { Authorization: `OAuth ${this.client.config.accessToken}` },
            appendMessageTypeToURL: false
        });

        listener.handshake((handshakeResp: any) => {
            if (handshakeResp.successful) {
              // Subscribe to receive messages from the server.
              listener.subscribe(`/topic/${topic}`, (m: any) => {
                const dataFromServer: StreamingEvent = m.data;
                handler(dataFromServer);
              });
            }
        });
        return listener;
    }
}
