import axios, { AxiosError, AxiosInstance } from 'axios'
import { SObject } from './sObject'
import { SObjectDescribe } from './sObjectDescribe'
import { BaseConfig } from './baseConfig';


export class Rest {
  public static config: BaseConfig;

  private static _instance: Rest;

  public request: AxiosInstance;
  public version: string;
  constructor() {
    this.version = 'v40.0';
    this.request = axios.create({
      baseURL: `${Rest.config.instanceUrl}/services/data/${this.version}/`,
      headers: {
        'Authorization': 'Bearer ' + Rest.config.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  public async getSObjectDescribe(apiName: string): Promise<SObjectDescribe>{

    try {
      let resp = await this.request.get(`/sobjects/${apiName}/describe/`);
      return resp.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  // get records of type T.  Do magic to cast plain json to T
  public async query(query: string): Promise<QueryResponse<any>> {
    let qryString = encodeURIComponent(query);

    try {
      let resp = await this.request.get(`/queryAll?q=${qryString}`);
      return resp.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

}
export interface QueryResponse<T> {
  totalSize: number;
  records: T[];
}


