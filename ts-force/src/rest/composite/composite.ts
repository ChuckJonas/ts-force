import { Rest } from "../rest";
import { BatchRequest } from "./batch";

export interface CompositeRequest extends BatchRequest {
  referenceId: string;
  body?: any;
  httpHeaders?: Record<string, string>;
}

export interface CompositePayloadOptions {
  allOrNone?: boolean;
  collateSubrequests?: boolean;
}

export interface CompositePayload extends CompositePayloadOptions{
  compositeRequest: CompositeRequest[];
}

export interface CompositeResponse {
  body: any;
  httpStatusCode: number;
  referenceId: string;
}

export interface CompositeResult {
  compositeResponse: CompositeResponse[];
}

export class Composite {
  public compositeRequest: CompositeRequest[];
  public callbacks: Array<(n: CompositeResponse) => void>;
  private client: Rest;

  /**
   * @param  {Rest=Rest.DEFAULT_CONFIG} client - Optional.  If not set, will use Rest.DEFAULT_CONFIG
   */
  constructor(client?: Rest) {
    this.client = client || new Rest();
    this.compositeRequest = [];
    this.callbacks = [];
  }
  /**
   * @param  {CompositeRequest} request A request to add.
   * @param  {(n:CompositeResponse)=>void} [callback] Optional callback that gets passed the response
   * @returns `this` instance for chaining
   */
  public addRequest(
    request: CompositeRequest,
    callback?: (n: CompositeResponse) => void
  ): Composite {
    this.compositeRequest.push(request);
    this.callbacks.push(callback);
    return this;
  }

  /**
   * Sends the composite requests
   * @returns Promise<CompositeResult>
   */
  public async send(options: CompositePayloadOptions = {}): Promise<CompositeResult> {
    let payload: CompositePayload = {
      compositeRequest: this.compositeRequest,
      ...options
    };
    let result = (
      await this.client.request.post(
        `/services/data/${this.client.version}/composite`,
        payload
      )
    ).data;
    for (let i = 0; i < this.callbacks.length; i++) {
      let callback = this.callbacks[i];
      if (callback !== undefined) {
        callback(result.compositeResponse[i]);
      }
    }

    return result;
  }
}
