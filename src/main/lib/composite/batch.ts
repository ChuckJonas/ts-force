import { RestObject } from '../restObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';
import { BaseConfig } from 'type-force';

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

    /**
     * Creates a composite batch to allow multiple requests to be sent in one round-trip
     * @param  {BaseConfig} config? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor (config?: BaseConfig) {
        this.batchRequests = [];
        this.callbacks = [];
        this.client = new Rest(config);
    }
    /**
     * Sends all added requests
     * @returns Promise<BatchResponse> the completed response data.  Should be returned in order added
     */
    public async send (): Promise<BatchResponse> {
        let batchResponses: BatchResponse[] = [];
        for (let payload of this.createPayloads()) {
            let batchResponse = await this.client.handleRequest<BatchResponse>(
                () => {
                    return this.client.request.post(`/services/data/${this.client.version}/composite/batch`, payload);
                }
            );

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

    /**
     * Adds request to retrieve an SObject
     * @param  {RestObject} obj sObject to retrieve
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    public addGet (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
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
    public addUpdate (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
            method: 'PATCH',
            url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`,
            richInput: obj.prepareForDML()
        };
        this.addBatchRequest(request, callback);
        return this;
    }

    /**
     * Adds request to insert an SObject
     * @param  {RestObject} obj sObject to insert
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    public addInsert (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
        let request: BatchRequest = {
            method: 'POST',
            url: `${this.client.version}/sobjects/${obj.attributes.type}/`,
            richInput: obj.prepareForDML()
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
    public addDelete (obj: RestObject, callback?: (n: CompositeBatchResult) => void): CompositeBatch {
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
