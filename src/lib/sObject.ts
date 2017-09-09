import { Rest } from './rest'
import { AxiosResponse } from 'axios'
/* Base SObject */

export class SObjectAttributes {
  public type: string // sf apex name
}

export abstract class SObject {
  public id: string | undefined
  public attributes: SObjectAttributes

  constructor (type: string) {

    this.attributes = new SObjectAttributes()
    this.attributes.type = type
  }
}

export interface DMLResponse {
  id: string
  errors: any[]
  success: boolean
}

export class RestObject extends SObject {

  constructor (type: string) {
    super(type)
  }

  public async insert (): Promise<DMLResponse> {
    try {
      const response = await this.generateCall(`/sobjects/${this.attributes.type}/`, this)
      return response.data
    } catch (error) {
      console.log(error.response.data)
      return error
    }
  }

  public async update (): Promise<DMLResponse> {

    if (this.id == null) {
      throw new Error('Must have Id to update!')
    }
    let data = Object.assign({}, this)
    data.id = undefined
    try {
      const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.id}?_HttpMethod=PATCH`, data)
      return response.data
    } catch (error) {
      console.log(error.response.data)
      return error
    }
  }
  public generateCall (path: string, data: SObject): Promise<AxiosResponse> {
    return Rest.Instance.request.post(path, data)
  }

}
