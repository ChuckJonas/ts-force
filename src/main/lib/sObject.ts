import { Rest, QueryResponse } from './rest';
import { AxiosResponse } from 'axios';
import { getSFieldProps, SFieldProperties } from './sObjectDecorators';


export class SObjectAttributes {
  public type: string; // sf apex name
  public url: string // sf rest API url for record
}

/* Base SObject */
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
  errors: string[];
  success: boolean;
  warnings: string[];
}

export interface DMLError {
  message: string;
  errorCode: string;
  fields: string[];
}

export abstract class RestObject extends SObject {

  constructor(type: string) {
    super(type);
  }

  public async insert(): Promise<DMLResponse> {
    let data = this.prepareForDML();
    const response = await this.generateCall(`/sobjects/${this.attributes.type}/`, data);
    // auto set the id to here
    this.Id = response.data.id;
    return response.data;
  }

  public async update(): Promise<DMLResponse> {
    if (this.Id == null) {
      throw new Error('Must have Id to update!');
    }
    let data = this.prepareForDML();

    const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.Id}?_HttpMethod=PATCH`, data);
    return response.data;
  }

  public async delete(): Promise<DMLResponse> {
    if (this.Id == null) {
      throw new Error('Must have Id to Delete!');
    }
    const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.Id}?_HttpMethod=DELETE`, this);
    return response.data;
  }

  protected static async query<T extends RestObject>(type: { new(): T; }, qry: string): Promise<T[]> {
    const response = await Rest.Instance.query(qry);
    let sobs: Array<T> = [];
    for (let i = 0; i < response.records.length; i++) {
      let sob = new type();
      //recursivly build up concrete restobjects
      RestObject.mapFromQuery(sob, response.records[i]);
      sobs.push(sob);
    }
    return sobs;
  }

  public static sanatizeProperty(s :string): string{
    s = s.replace('__c', '').replace('_', '');
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  private generateCall(path: string, data: SObject): Promise<AxiosResponse> {
    return Rest.Instance.request.post(path, data);
  }

  //prepares data for DML opporations
  protected prepareForDML(): any {
    let data = {};

    //loop each property
    for (var i in this) {
      //clean properties
      if (this.hasOwnProperty(i)) {

        let sFieldProps = getSFieldProps(this, i);
        if (sFieldProps) {
          if (sFieldProps.readOnly || sFieldProps.reference != null) {
            //remove readonly && reference types
            continue;
          }
          //copy with mapping
          data[sFieldProps.apiName] = this[i];
        }
      }
    }
    return data;
  }

  //copies data from a json object to restobject
  protected static mapFromQuery(sob: RestObject, data: any): SObject {

    //create a map of lowercase API names -> sob property names
    let apiNameMap = sob.getNameMapping();

    //loop through returned data
    for (var i in data) {
      if (data.hasOwnProperty(i)) {

        //translate prop name & get decorator
        let sobPropName = apiNameMap.get(i.toLowerCase());
        let sFieldProps = getSFieldProps(sob, sobPropName);

        if(!sFieldProps){ //no mapping found
          continue;
        }

        if (!sFieldProps.reference) {
          sob[sobPropName] = data[i];
        } else {
          //reference type
          var type: { new(): RestObject; } = sFieldProps.reference();

          if (sFieldProps.childRelationship == true) {
            //child type, map each record
            sob[sobPropName] = [];
            if (data[i]) {
              data[i].records.forEach(record => {
                sob[sobPropName].push(RestObject.mapFromQuery(new type(), record));
              });
            }

          } else {
            //parent type.  Map data
            sob[sobPropName] = RestObject.mapFromQuery(new type(), data[i]);
          }
        }
      }
    }
    return sob;
  }

  //returns a mapping of API Name (lower case) -> Property Name
  private getNameMapping(): Map<string, string>{
    let apiNameMap = new Map<string, string>();
    for (var i in this) {
      //clean properties
      if (this.hasOwnProperty(i)) {
        let sFieldProps = getSFieldProps(this, i);
        if(sFieldProps){
          apiNameMap.set(sFieldProps.apiName.toLowerCase(), i);
        }else{
          apiNameMap.set(i,i);
        }
      }
    }
    return apiNameMap;
  }

}



