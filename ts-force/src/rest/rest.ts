import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SObjectDescribe } from './sObjectDescribe';
import { BaseConfig, DEFAULT_CONFIG } from '../auth/baseConfig';

const LIMITS_REGEX = /api-usage=(\d+)\/(\d+)/;

export class Rest {
    private static defaultInstance: Rest;

    public config: BaseConfig;

    public request: AxiosInstance;
    public version: string;

    public limits: ApiLimit = {
        used: null,
        limit: null
    };
    
    /**
     * Constructor
     * @param {BaseConfig} [config] Optional authenication configuration.   
     *     If not passed in will return a "singleton" client from the default config
     * @memberof Rest
     */
    constructor (config?: BaseConfig) {

        this.config = config;
        // setup/get "singleton" if using default config
        if (!this.config) {
            if (Rest.defaultInstance && 
                Rest.defaultInstance.config.accessToken === DEFAULT_CONFIG.accessToken)
            {
                return Rest.defaultInstance;
            }
            this.config = DEFAULT_CONFIG;
            Rest.defaultInstance = this;
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

        const updateLimits = (response) => this.updateLimits(response);
        this.request.interceptors.response.use(updateLimits, updateLimits);
    }

    private updateLimits (response: AxiosResponse) {
        if (response.headers['sforce-limit-info']) {
            const [_, used, total] = LIMITS_REGEX.exec(response.headers['sforce-limit-info']);
            this.limits = {
                used: Number(used),
                limit: Number(total)
            };
        }
        return response;
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

export interface ApiLimit {
    used?: number;
    limit?: number;
}
