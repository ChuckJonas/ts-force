import { Rest, SObjectStatic } from '..';
import { CometD, SubscriptionHandle } from 'cometd';
import { RestObject } from '../rest/restObject';
import { SObject } from '../rest/sObject';
import { Omit } from '../types';

export class Streaming {
  private listener: CometD;
  private subscribers: Map<string, SubscriptionHandle>;

  /**
   * Creates an instance of Streaming class.  Used to listen to PushTopic and Platform Events
   * @param {Rest} [client] Optional client to use instead of the default connection
   * @memberof Streaming
   */
  constructor(client?: Rest) {
    client = client || new Rest();

    this.subscribers = new Map<string, SubscriptionHandle>();
    this.listener = new CometD();
    this.listener.websocketEnabled = false;
    this.listener.configure({
      url: `${client.config.instanceUrl}/cometd/${client.config.version.toFixed(1)}/`,
      requestHeaders: { Authorization: `OAuth ${client.config.accessToken}` },
      appendMessageTypeToURL: false,
    });
  }

  /**
   * Method to connect to salesforce.  Call before attempting to subscribe to event events or topics
   *
   * @memberof Streaming
   */
  public connect = () => {
    return new Promise<void>((resolve, reject) => {
      this.listener.handshake((resp) => {
        if (resp.successful) {
          resolve();
        } else {
          reject(resp);
        }
      });
    });
  };

  /**
   * Removes a transport from the cometd connection.
   * See: https://docs.cometd.org/current/reference/#_javascript_transports_unregistering
   * @param {('websocket' | 'long-polling' | 'callback-polling')} transport
   * @memberof Streaming
   */
  public unregisterTransport(transport: 'websocket' | 'long-polling' | 'callback-polling') {
    this.listener.unregisterTransport(transport);
  }

  /**
   * General purpose method to subscribe to any uri.
   *   Use `subscribeToTopic`, `subscribeToTopicMapped` & `subscribeToEvent` for most use cases
   *
   * @param {string} channel the relative uri to subscribe to.  EX: '/topic/abc'
   * @param {(message: any) => void} onEvent Callback handler to process received events
   * @returns {Promise<SubscriptionHandle>} A cometd SubscriberHandle.  It's recommended to use
   * @memberof StreamClient
   */
  public _subscribe(channel: string, onEvent: (message: any) => void): Promise<SubscriptionHandle> {
    return new Promise((resolve, reject) => {
      if (this.listener.isDisconnected()) {
        reject('Streaming client is not connected!  Must run connect first!');
      }
      let subscriber = this.listener.subscribe(channel, onEvent, (m) => {
        if (m.successful) {
          this.subscribers.set(channel, subscriber);
          resolve(subscriber);
        } else {
          reject(m);
        }
      });
    });
  }

  /**
   * Method to unsubscribe from any subscription.
   * @param {string} channel
   * @param {('topic' | 'event')} [type] Optional parameter to help build channel
   * @returns {Promise<void>}
   * @memberof StreamClient
   */
  public unsubscribe(channel: string, type?: 'topic' | 'event'): Promise<void> {
    channel = type ? `/${type}/${channel}` : channel;
    return new Promise((resolve, reject) => {
      if (this.subscribers.has(channel)) {
        let subscriber = this.subscribers.get(channel);
        this.listener.unsubscribe(subscriber, (m) => {
          if (m.successful) {
            resolve();
          } else {
            reject(m);
          }
        });
      } else {
        reject(`No subscriber for ${channel} found`);
      }
    });
  }

  /**
   * Method to subscribe to a platform events
   * @template T type of the event `payload`
   * @param {string} event The name of the PlatformEvent to subscribe to.  EG: `My_Event__e` (do not include `/event/`)
   * @param {(m: PlatformEvent<T>) => void} onEvent
   * @returns {Promise<SubscriptionHandle>}
   * @memberof Streaming
   */
  public subscribeToEvent<T>(event: string, onEvent: (m: PlatformEvent<T>) => void): Promise<SubscriptionHandle> {
    return this._subscribe(`/event/${event}`, onEvent);
  }

  /**
   * Method to subscribe to a push topic
   *    See `subscribeToTopicMapped` to automatically map your response to a generated SObject class
   * @template T The signature of of the event `data.sobject`
   * @param {string} topic The name of the PushTopic to subscribe to.  EG: `MyTopic` (do not include `/topic/`)
   * @param {(m: TopicMessage<T>) => void} onEvent Your event handler
   * @returns {Promise<SubscriptionHandle>}
   * @memberof Streaming
   */
  public subscribeToTopic<T extends TopicSObject>(topic: string, onEvent: (m: TopicMessage<T>) => void): Promise<SubscriptionHandle> {
    return this._subscribe(`/topic/${topic}`, onEvent);
  }

  /**
   * Method to subscribe to a PushTopic and parse event messages directly to a generated SObject type
   *
   * @template T The SObject type.  Implied from `sObjectType` param
   * @param {SObjectStatic<T>} sObjectType The static instance of the SObject type to map.  EG: `Account`
   * @param {string} topic The name of the PushTopic to subscribe to.  EG: `MyTopic` (do not include `/topic/`)
   * @param {(event: SObjectTopicMessage<T>) => void} onEvent Your event handler.  Payload will be parsed to your `sObjectType`
   * @returns {Promise<SubscriptionHandle>}
   * @memberof Streaming
   *
   * Example:
   *
   * ```typescript
   *await stream.subscribeToTopicMapped(
   *   Account,
   *   topic.name,
   *   e => {
   *      let acc: Account = e.data.sObject;
   *      console.log(acc.annualRevenue);
   *   }
   * );
   * ```
   */
  public subscribeToTopicMapped<T extends RestObject>(
    sObjectType: SObjectStatic<T>,
    topic: string,
    onEvent: (event: SObjectTopicMessage<T>) => void
  ): Promise<SubscriptionHandle> {
    return this.subscribeToTopic(topic, (m: TopicMessage<any>) => {
      let mappedEvent: SObjectTopicMessage<any> = {
        data: {
          event: m.data.event,
          sObject: sObjectType.fromSFObject(m.data.sobject as SObject),
        },
        channel: m.channel,
        clientId: m.clientId,
      };
      return onEvent(mappedEvent);
    });
  }

  /**
   * Disconnects the streaming client.  Will unsubscribe for all active subscriptions
   *
   * @memberof Streaming
   */
  public disconnect = () => {
    return new Promise<void>((resolve, reject) => {
      this.listener.disconnect((m) => {
        if (m.successful) {
          resolve();
        } else {
          reject(m);
        }
      });
    });
  };
  /**
   * Returns `true` if the client is currently connected with salesforce
   *
   * @memberof Streaming
   */
  public isConnected = () => {
    return !this.listener.isDisconnected();
  };
}

/*=== MESSAGE TYPES ===*/

// Push Topic
export interface SObjectTopicMessage<T extends RestObject> extends Omit<TopicMessage<any>, 'data'> {
  data: {
    event: Event;
    sObject: T;
  };
}

export interface TopicMessage<T extends TopicSObject> {
  clientId: string;
  data: Data<T>;
  channel: string;
}

export interface Event {
  createdDate: Date;
  replayId: number;
  type: TopicEventType;
}
export type TopicEventType = 'created' | 'updated' | 'deleted' | 'undeleted';

export interface TopicSObject {
  Id: string;
}

export interface Data<T extends TopicSObject> {
  event: Event;
  sobject: T;
}

// PLATFORM EVENTS
export interface PlatformEvent<T> {
  data: PlatformEventData<T>;
  channel: string;
}

export interface PlatformEventInfo {
  replayId: number;
}

export interface PlatformEventData<T> {
  schema: string;
  payload: T;
  event: PlatformEventInfo;
}
