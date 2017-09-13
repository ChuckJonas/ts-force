import { RestObject } from './sObject'
import { Rest } from './rest'
import { AxiosResponse } from 'axios'

export class CompositeBatch {
    public batchRequests: BatchRequest[]

    private client: Rest
    constructor () {
        this.batchRequests = []
        this.client = Rest.Instance
    }

    public async send (): Promise<BatchResponse> {
        console.log(this.batchRequests)
        let payload: CompositeBatchPayload = {
            batchRequests: this.batchRequests
        }
        let resp = await this.client.request.post(`/composite/batch`, payload)
        return resp.data
    }

    public addGet (obj: RestObject): CompositeBatch {
        this.batchRequests.push(
            {
                method: 'GET',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
            }
        )
        return this
    }

    public addUpdate (obj: RestObject): CompositeBatch {
        this.batchRequests.push(
            {
                method: 'PATCH',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`,
                richInput: obj.prepareForDML()
            }
        )
        return this
    }

    public addInsert (obj: RestObject): CompositeBatch {
        this.batchRequests.push(
            {
                method: 'POST',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/`,
                richInput: obj.prepareForDML()
            }
        )
        return this
    }

    public addDelete (obj: RestObject): CompositeBatch {
        this.batchRequests.push(
            {
                method: 'DELETE',
                url: `${this.client.version}/sobjects/${obj.attributes.type}/${obj.id}`
            }
        )
        return this
    }

    public addQuery (query: string): CompositeBatch {
        let qryString = encodeURIComponent(query)
        this.batchRequests.push(
            {
                method: 'GET',
                url: `${this.client.version}/queryAll?q=${qryString}`
            }
        )
        return this
    }
}

export interface BatchResponse {
    hasErrors: boolean
    results: CompositeResult[]
}

export interface CompositeResult {
    statusCode: number
    result: any
}

export interface BatchRequest {
    method: string
    url: string
    richInput?: any
}

export interface CompositeBatchPayload {
    batchRequests: BatchRequest[]
}

export class Composite {
    public compositeRequest: CompositeRequest[]
    private client: Rest
    constructor () {
        this.compositeRequest = []
        this.client = Rest.Instance
    }

    public addRequest (method: string, resource: string, referenceId: string, body?: any): Composite {
        this.compositeRequest.push({
            method: method,
            url: `/services/data/${this.client.version}/${resource}`,
            referenceId: referenceId,
            body: body
        })
        return this
    }

    public async send (): Promise<CompositeResult> {
        console.log(this.compositeRequest)
        let payload: CompositePayload = {
            compositeRequest: this.compositeRequest
        }
        let resp = await this.client.request.post(`/composite`, payload)
        return resp.data
    }
}

export interface CompositeRequest extends BatchRequest {
    referenceId: string
    body?: any
}

export interface CompositePayload {
    compositeRequest: CompositeRequest[]
}

export interface CompositeResponse {
    body: any
    httpStatusCode: number
    referenceId: string
}

export interface CompositeResult {
    compositeResponse: CompositeResponse[]
}
