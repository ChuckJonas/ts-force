import { RestObject } from '../restObject';
import { Rest } from '../rest';
import { QueryResponse } from '../restTypes';
import { SObject } from '../sObject';
import { StandardRestError } from '../errors';

export interface BatchResponse {
  hasErrors: boolean;
  results: CompositeBatchResult<any, any>[];
}

export interface CompositeBatchSuccessResult<T> {
  readonly statusCode: number;
  result: T;
}

export interface CompositeBatchFailResult<T> {
  readonly statusCode: number;
  result: T;
}

export type CompositeBatchResult<T, E> = CompositeBatchSuccessResult<T> | CompositeBatchFailResult<E>;

export const isCompositeBatchSuccessResult = <T, E>(result: CompositeBatchResult<T, E>): result is CompositeBatchSuccessResult<T> => {
  return result.statusCode < 300;
};

export const isCompositeBatchFailResult = <T, E>(result: CompositeBatchResult<T, E>): result is CompositeBatchFailResult<E> => {
  return result.statusCode >= 300;
};

export interface BatchRequest {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  richInput?: any;
}

export interface CompositeBatchPayload {
  batchRequests: BatchRequest[];
}

export class CompositeBatch {
  public batchRequests: BatchRequest[];

  public callbacks: Array<(n: CompositeBatchResult<any, any>) => void>;

  private client: Rest;

  /**
   * Creates a composite batch to allow multiple requests to be sent in one round-trip
   * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
   */
  constructor (client?: Rest) {
    this.batchRequests = [];
    this.callbacks = [];
    this.client = client || new Rest();
  }
  /**
   * Sends all added requests
   * @returns Promise<BatchResponse> the completed response data.  Should be returned in order added
   */
  public async send (): Promise<BatchResponse> {
    let batchResponses: BatchResponse[] = [];
    for (let payload of this.createPayloads()) {
      let batchResponse = (await this.client.request.post(`/services/data/${this.client.version}/composite/batch`, payload)).data;

      batchResponses.push(batchResponse);
      for (let i = 0; i < this.callbacks.length; i++) {
        let callback = this.callbacks[i];
        if (callback !== undefined) {
          callback(batchResponse.results[i]);
        }
      }
    }
    let hasErrors = false;
    let results: CompositeBatchResult<any, any>[] = [];
    for (let br of batchResponses) {
      if (br.hasErrors) {
        hasErrors = true;
      }
      results = results.concat(br.results);
    }

    return { hasErrors, results };
  }

  /**
   * Adds request to retrieve an SObject
   * @param  {RestObject} obj sObject to retrieve
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addGet (obj: RestObject, callback?: (n: CompositeBatchResult<SObject, any>) => void): CompositeBatch {
    let request: BatchRequest = {
      method: 'GET',
      url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
    };
    this.addBatchRequest(request, callback);
    return this;
  }

  /**
   * Adds request to update an SObject
   * @param  {RestObject} obj sObject to update
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addUpdate (obj: RestObject, opts?: { callback?: ((n: CompositeBatchResult<any, any>) => void), sendAllFields?: boolean }): CompositeBatch {
    opts = opts || {};
    let sobData = obj.prepareFor(opts.sendAllFields ? 'update_all' : 'update');
    let request: BatchRequest = {
      method: 'PATCH',
      url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`,
      richInput: sobData
    };
    this.addBatchRequest(request, opts.callback);
    return this;
  }

  /**
   * Adds request to insert an SObject
   * @param  {RestObject} obj sObject to insert
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addInsert (obj: RestObject, callback?: (n: CompositeBatchResult<any, any>) => void): CompositeBatch {
    let request: BatchRequest = {
      method: 'POST',
      url: `${this.client.version}/sobjects/${obj.attributes.type}/`,
      richInput: obj.prepareFor('insert')
    };
    this.addBatchRequest(request, callback);

    return this;
  }

  /**
   * Adds request to delete an SObject
   * @param  {RestObject} obj sObject to insert
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addDelete (obj: RestObject, callback?: (n: CompositeBatchResult<any, any>) => void): CompositeBatch {
    let request: BatchRequest = {
      method: 'DELETE',
      url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
    };
    this.addBatchRequest(request, callback);

    return this;
  }

  /**
   * Adds a query request
   * @param  {string} query the SOQL query to execute
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addQuery (query: string, callback?: (n: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void): CompositeBatch {
    let qryString = encodeURIComponent(query);
    let request: BatchRequest = {
      method: 'GET',
      url: `${this.client.version}/query?q=${qryString}`
    };
    this.addBatchRequest(request, callback);

    return this;
  }

  /**
   * Adds a query request
   * @param  {string} nextRecordsUrl next url to query
   * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
   * @returns this instance is returned for easy chaining
   */
  public addQueryMore (nextRecordsUrl: string, callback?: (n: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void): CompositeBatch {

    let request: BatchRequest = {
      method: 'GET',
      url: nextRecordsUrl
    };
    this.addBatchRequest(request, callback);

    return this;
  }

  private addBatchRequest (request: BatchRequest, callback?: (n: CompositeBatchResult<any, any>) => void) {
    this.batchRequests.push(request);
    this.callbacks.push(callback);
  }

  private createPayloads (): CompositeBatchPayload[] {
    let batches = [],
      i = 0,
      n = this.batchRequests.length;

    while (i < n) {
      let payload: CompositeBatchPayload = {
        batchRequests: this.batchRequests.slice(i, i += 25)
      };
      batches.push(payload);
    }
    return batches;
  }
}
