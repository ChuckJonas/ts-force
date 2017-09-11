import { Rest, QueryResponse } from './rest';
import { AxiosResponse } from 'axios';
import { isReadOnly, getReferenceTypeConstructor } from './sObjectDecorators';
/* Base SObject */

export class SObjectAttributes {
  public type: string; // sf apex name
  public url: string // sf rest API url for record
}

export abstract class SObject {
  public Id: string | undefined;
  public attributes: SObjectAttributes;

  constructor(type: string) {

    this.attributes = new SObjectAttributes();
    this.attributes.type = type;
  }
}

export interface DMLResponse {
  id: string;
  errors: any[];
  success: boolean;
}

export class RestObject extends SObject {

  constructor(type: string) {
    super(type);
  }

  public static async query<T extends SObject>(type: { new(): T; }, qry: string): Promise<T[]> {
    try {
      const response = await Rest.Instance.query(qry);
      let sobs: Array<T> = [];
      for (let i = 0; i < response.records.length; i++) {
        let sob = new type();
        //recursivly build up concrete restobjects
        RestObject.mapData(sob, response.records[i]);
        sobs.push(sob);
      }
      return sobs;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  public async insert(): Promise<DMLResponse> {
    try {
      let data = this.prepareData();
      const response = await this.generateCall(`/sobjects/${this.attributes.type}/`, data);
      // auto set the id to here
      this.Id = response.data.id;
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  public async update(): Promise<DMLResponse> {
    if (this.Id == null) {
      throw new Error('Must have Id to update!');
    }
    let data = this.prepareData();

    try {
      const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.Id}?_HttpMethod=PATCH`, data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  public async delete(): Promise<DMLResponse> {
    if (this.Id == null) {
      throw new Error('Must have Id to Delete!');
    }
    try {
      const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.Id}?_HttpMethod=DELETE`, this);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  private generateCall(path: string, data: SObject): Promise<AxiosResponse> {
    return Rest.Instance.request.post(path, data);
  }

  //removes any readonly/reference properties to prepare for update/insert
  private prepareData(): any{
    let data = Object.assign({}, this);
    //remove anything that we can't update
    for (var i in data) {
      //clean properties
      if (data.hasOwnProperty(i)) {
        //remove readonly && reference types
        if (isReadOnly(this, i) || getReferenceTypeConstructor(this, i) != null) {
          console.log(`removed readonly/reference field: ${i}`)
          data[i] = undefined;
        }
      }
    }
    return data;
  }

  //copies data from a json object to restobject
  private static mapData(sob: SObject, data: any): SObject{
    //remove anything that we can't update
    for (var i in data) {
      //clean properties
      if (data.hasOwnProperty(i)) {
        //remove readonly && reference types
        var type: { new(): SObject; } = getReferenceTypeConstructor(sob, i)
        if (type != null) {
          sob[i] = RestObject.mapData(new type(), data[i]);
        }else{
          sob[i] = data[i];
        }
      }
    }
    return sob;
  }

}
