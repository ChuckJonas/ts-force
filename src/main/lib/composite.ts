import { RestObject } from './sObject';
import { Rest } from './rest';
import { AxiosResponse } from 'axios';

export class CompositeBatch {
    public batchRequests: BatchRequest[];

    public callbacks: Array<(n: CompositeBatchResult) => void>;

    private client: Rest;
    constructor () {
        this.batchRequests = [];
        this.callbacks = [];
        this.client = Rest.Instance;
    }

    public async send (): Promise<BatchResponse> {
        console.log(this.batchRequests);
        let payload: CompositeBatchPayload = {
            batchRequests: this.batchRequests
        };
        let resp = await this.client.request.post(`/composite/batch`, payload);
        let batchResponse: BatchResponse = resp.data;
        for (let i = 0; i < this.callbacks.length; i++) {
            let callback = this.callbacks[i];
            if (callback !== undefined) {
                callback(batchResponse.results[i]);
            }
        }

        return batchResponse;
    }

    public addGet (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
             method: 'GET',
            url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
        };
        this.addBatchRequest(request, callback);
        return this;
    }

    public addUpdate (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
                method: 'PATCH',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`,
                richInput: obj.prepareForDML()
            };
        this.addBatchRequest(request, callback);
        return this;
    }

    public addInsert (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
                method: 'POST',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/`,
                richInput: obj.prepareForDML()
            };
        this.addBatchRequest(request, callback);

        return this;
    }

    public addDelete (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
                method: 'DELETE',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
            };
        this.addBatchRequest(request, callback);

        return this;
    }

    public addQuery (query: string, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let qryString = encodeURIComponent(query);
        let request: BatchRequest = {
                method: 'GET',
                url: `${this.client.version}/queryAll?q=${qryString}`
            };
        this.addBatchRequest(request, callback);

        return this;
    }

    private addBatchRequest (request: BatchRequest, callback?: (n: CompositeBatchResult) => void) {
        this.batchRequests.push(request);
        this.callbacks.push(callback);
    }
}

export interface BatchResponse {
    hasErrors: boolean;
    results: CompositeBatchResult[];
}

export interface CompositeBatchResult {
    statusCode: number;
    result: any;
}

export interface BatchRequest {
    method: string;
    url: string;
    richInput?: any;
}

export interface CompositeBatchPayload {
    batchRequests: BatchRequest[];
}

export class Composite {
    public compositeRequest: CompositeRequest[];
    public callbacks: Array<(n: CompositeResponse) => void>;
    private client: Rest;
    constructor () {
        this.compositeRequest = [];
        this.callbacks = [];
        this.client = Rest.Instance;
    }

    public addRequest (request: CompositeRequest, callback?: (n: CompositeResponse) => void): Composite {
        this.compositeRequest.push(request);
        this.callbacks.push(callback);
        return this;
    }

    public async send (): Promise<CompositeResult> {
        console.log(this.compositeRequest);
        let payload: CompositePayload = {
            compositeRequest: this.compositeRequest
        };
        let resp = await this.client.request.post(`/composite`, payload);

        let result: CompositeResult = resp.data;
        for (let i = 0; i < this.callbacks.length; i++) {

            let callback = this.callbacks[i];
            if (callback !== undefined) {
                callback(result.compositeResponse[i]);
            }
        }

        return result;
    }
}

export interface CompositeRequest extends BatchRequest {
    referenceId: string;
    body?: any;
}

export interface CompositePayload {
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
