import { RestObject } from '../sObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';

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
        let batchResponses: BatchResponse[] = [];
        for (let payload of this.createPayloads()) {
            let resp = await this.client.request.post(`/services/data/${Rest.Instance.version}/composite/batch`, payload);
            let batchResponse: BatchResponse = resp.data;
            batchResponses.push(batchResponse);
            for (let i = 0; i < this.callbacks.length; i++) {
                let callback = this.callbacks[i];
                if (callback !== undefined) {
                    callback(batchResponse.results[i]);
                }
            }
        }
        let hasErrors = false;
        let results = [];
        for (let br of batchResponses) {
            if (br.hasErrors) {
                hasErrors = true;
            }
            results = results.concat(br.results);
        }

        return { hasErrors, results };
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
            url: `${this.client.version}/query?q=${qryString}`
        };
        this.addBatchRequest(request, callback);

        return this;
    }

    private addBatchRequest (request: BatchRequest, callback?: (n: CompositeBatchResult) => void) {
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
