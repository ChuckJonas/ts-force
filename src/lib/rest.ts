import axios, { AxiosError, AxiosInstance } from 'axios'
import { SObject } from './sObject'

export class RestBaseConfig {
  public accessToken: string
  public host: string
}

export class Rest {
  public static config: RestBaseConfig

  private static _instance: Rest

  public request: AxiosInstance
  public version: string
  private constructor () {
    this.version = 'v40.0'
    this.request = axios.create({
      baseURL: `${Rest.config.host}/services/data/${this.version}/`,
      headers: {
        'Authorization': 'Bearer ' + Rest.config.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  // get records of type T.  Do magic to cast plain json to T
  public static async query(type: { new(): SObject ;}, query: string): Promise<QueryResponse> {
    let qryString = encodeURIComponent(query)
    return new Promise<QueryResponse>((resolve, reject) => {
      if (!this._instance) {
        this._instance = new this()
      }
      this._instance.request.get(`/query?q=${qryString}`)
            .then((response) => {
              let sobs: Array<SObject> = []
              for (let i = 0; i < response.data.records.length; i++) {
                let sob = Object.assign(new type(), response.data.records[i])
                sobs.push(sob)
              }
              response.data.records = sobs
              resolve(response.data)
            }).catch((error: AxiosError) => {
              reject(error)
            })
    })
  }

  public static get Instance () {
    return this._instance || (this._instance = new this())
  }

}

export interface QueryResponse {
  totalSize: number
  records: any
}
