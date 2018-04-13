import axios, { AxiosError, AxiosInstance, AxiosPromise } from 'axios';
import { SObject } from './sObject';
import { SObjectDescribe } from './sObjectDescribe';
import { BaseConfig } from '../../auth/baseConfig';

export class Rest {
    public static config: BaseConfig;

    private static _instance: Rest;

    public request: AxiosInstance;
    public version: string;
    constructor () {

        this.version = `v${Rest.config.version ? Rest.config.version.toFixed(1) : '42.0'}`;
        this.request = axios.create({
            baseURL: `${Rest.config.instanceUrl}`,
            headers: {
                'Authorization': 'Bearer ' + Rest.config.accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }
    /**
     * @param  {string} apiName the object to get the describe for
     * @returns Promise<SObjectDescribe>
     */
    public async getSObjectDescribe (apiName: string): Promise<SObjectDescribe> {
        return await this.handleRequest<SObjectDescribe>(
            () => {
              return this.request.get(`/services/data/${this.version}/sobjects/${apiName}/describe/`);
            }
        );
    }

    /**
     * Executes any SOQL query
     * @param  {string} query SOQL Query to execute
     * @returns Promise<QueryResponse<T>>
     */
    public async query <T> (query: string): Promise<QueryResponse<T>> {
        let qryString = encodeURIComponent(query);
        return await this.handleRequest<QueryResponse<T>>(
            () => {
                return this.request.get<QueryResponse<T>>(`/services/data/${this.version}/query?q=${qryString}`);
            }
        );
    }

    /** axois error handler
     * @param  {()=>AxiosPromise<T>} request
     */
    public handleRequest = async <T> (request: () => AxiosPromise<T>) => {
        try {
            return (await request()).data;
        } catch (error) {
            let details;
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                details = error.response;
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                details = error.request;
            } else {
                // Something happened in setting up the request that triggered an Error
                throw error;
            }
            throw new Error(`${error} \n Details: ${JSON.stringify(details)}`);
        }
    }

    /**
     * Singleton retrive
     */
    public static get Instance () {
        if (!Rest.config) {
            return null;
        }
        return this._instance || (this._instance = new this());
    }

}
export interface QueryResponse<T> {
    totalSize: number;
    records: T[];
}
