import axios, { AxiosError, AxiosInstance } from 'axios';
import { SObject } from './sObject';
import { SObjectDescribe } from './sObjectDescribe';
import { BaseConfig } from '../../auth/baseConfig';

export class Rest {
    public static config: BaseConfig;

    private static _instance: Rest;

    public request: AxiosInstance;
    public version: string;
    constructor () {

        this.version = `v${Rest.config.version ? Rest.config.version.toFixed(1) : '40.0'}`;
        this.request = axios.create({
            baseURL: `${Rest.config.instanceUrl}`,
            headers: {
                'Authorization': 'Bearer ' + Rest.config.accessToken,
                'Content-Type': 'text/plain',
                'Accept': 'application/json',
                'X-SFDC-Session': Rest.config.accessToken
            }
        });
    }

    public async getSObjectDescribe (apiName: string): Promise<SObjectDescribe> {

        let resp = await this.request.get(`/services/data/${this.version}/sobjects/${apiName}/describe/`);
        return resp.data;
    }

    // get records of type T.  Do magic to cast plain json to T
    public async query (query: string): Promise<QueryResponse<any>> {
        let qryString = encodeURIComponent(query);

        try {
            let resp = await this.request.get(`/services/data/${this.version}/query?q=${qryString}`);
            return resp.data;
        } catch (error) {
            console.log(error.response.data);
            return error;
        }
    }

    public static get Instance () {
        return this._instance || (this._instance = new this());
    }

}
export interface QueryResponse<T> {
    totalSize: number;
    records: T[];
}
