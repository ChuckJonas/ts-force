import { Rest, QueryResponse } from './rest';
import { AxiosResponse } from 'axios';
import { getSFieldProps, SFieldProperties } from './sObjectDecorators';
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

export abstract class RestObject extends SObject {

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
      console.log(error);
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
  protected prepareData(): any {
    let data = {};
    //remove anything that we can't update
    for (var i in this) {
      //clean properties
      if (this.hasOwnProperty(i)) {
        //remove readonly && reference types
        let sFieldProps = getSFieldProps(this, i);
        if (sFieldProps) {
          if (!sFieldProps.readOnly && sFieldProps.reference == null) {
            data[sFieldProps.apiName] = this[i];
          }
        }
      }
    }
    return data;
  }

  //copies data from a json object to restobject
  protected static mapData(sob: SObject, data: any): SObject {

    //create a map of lowercase API names -> sob property names
    let apiNameMap = new Map<string, string>();
    for (var i in sob) {
      //clean properties
      if (sob.hasOwnProperty(i)) {
        let sFieldProps = getSFieldProps(sob, i);
        if(sFieldProps){
           apiNameMap.set(sFieldProps.apiName.toLowerCase(), i);
        }else{
          apiNameMap.set(i,i);
        }
      }
    }

    //remove anything that we can't update
    for (var i in data) {
      //clean properties
      if (data.hasOwnProperty(i)) {
        //get decorators

        let sobPropName = apiNameMap.get(i.toLowerCase());
        let sFieldProps = getSFieldProps(sob, sobPropName);

        if (sFieldProps) {
          if (sFieldProps.reference != null) {
            var type: { new(): SObject; } = sFieldProps.reference();
            if (sFieldProps.childRelationship == true) {
              sob[sobPropName] = [];
              if (data[i]) {
                data[i].records.forEach(record => {
                  sob[sobPropName].push(RestObject.mapData(new type(), record));
                })
              }
            } else {
              sob[sobPropName] = RestObject.mapData(new type(), data[i]);
            }
          } else {
            sob[sobPropName] = data[i];
          }
        }
      }
    }
    return sob;
  }

}
