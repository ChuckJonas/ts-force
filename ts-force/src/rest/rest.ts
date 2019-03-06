import axios, { AxiosError, AxiosInstance, AxiosPromise } from 'axios';
import { SObject } from './sObject';
import { SObjectDescribe } from './sObjectDescribe';
import { BaseConfig, DEFAULT_CONFIG } from '../auth/baseConfig';

export class Rest {
    public config: BaseConfig;

    public request: AxiosInstance;
    public version: string;
    constructor (config?: BaseConfig) {
        if (!config) {
            this.config = DEFAULT_CONFIG;
        }

        this.version = `v${(this.config.version ? this.config.version : DEFAULT_CONFIG.version).toFixed(1)}`;
        this.request = axios.create({
            baseURL: `${this.config.instanceUrl}`,
            headers: {
                'Authorization': 'Bearer ' + this.config.accessToken,
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
        return (await this.request.get(`/services/data/${this.version}/sobjects/${apiName}/describe/`)).data;
    }

    /**
     * Executes any SOQL query
     * @param  {string} query SOQL Query to execute
     * @returns Promise<QueryResponse<T>>
     */
    public async query <T> (query: string): Promise<QueryResponse<T>> {
        let qryString = encodeURIComponent(query);
        return (await this.request.get<QueryResponse<T>>(`/services/data/${this.version}/query?q=${qryString}`)).data;
    }

    public async queryMore <T> (resp: QueryResponse<T>): Promise<QueryResponse<T>> {
        return (await this.request.get<QueryResponse<T>>(resp.nextRecordsUrl)).data;
    }

    public async search <T> (query: string): Promise<SearchResponse<T>> {
        let qryString = encodeURIComponent(query);
        return (await this.request.get<SearchResponse<T>>(`/services/data/${this.version}/search?q=${qryString}`)).data;
    }
}

export interface QueryResponse<T> {
    totalSize: number;
    records: T[];
    done: boolean;
    nextRecordsUrl?: string;
}

export interface SearchResponse<T> {
    searchRecords: T[];
}
