import { RestObject } from '../restObject';
import { Rest } from '../rest';
import { AxiosResponse } from 'axios';
import { BatchRequest } from './batch';
import { BaseConfig } from '../../auth/baseConfig';

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

export class Composite {
    public compositeRequest: CompositeRequest[];
    public callbacks: Array<(n: CompositeResponse) => void>;
    private client: Rest;

    /**
     * @param  {BaseConfig} config? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor (config?: BaseConfig) {
        this.compositeRequest = [];
        this.callbacks = [];
        this.client = new Rest(config);
    }
    /**
     * @param  {CompositeRequest} request A request to add.
     * @param  {(n:CompositeResponse)=>void} callback? Optional callback that gets passed the response
     * @returns `this` instance for chaining
     */
    public addRequest (request: CompositeRequest, callback?: (n: CompositeResponse) => void): Composite {
        this.compositeRequest.push(request);
        this.callbacks.push(callback);
        return this;
    }

    /**
     * Sends the composite requests
     * @returns Promise<CompositeResult>
     */
    public async send (): Promise<CompositeResult> {
        let payload: CompositePayload = {
            compositeRequest: this.compositeRequest
        };
        let result = await this.client.handleRequest<CompositeResult>(
            () => {
                return this.client.request.post(`/services/data/${this.client.version}/composite`, payload);
            }
        );

        for (let i = 0; i < this.callbacks.length; i++) {

            let callback = this.callbacks[i];
            if (callback !== undefined) {
                callback(result.compositeResponse[i]);
            }
        }

        return result;
    }
}
