import { Rest, QueryResponse } from './rest';
import {Composite, CompositeBatch, BatchResponse, CompositeResult} from './composite';
import { AxiosResponse } from 'axios';
import { sField, getSFieldProps, SFieldProperties } from './sObjectDecorators';


export class SObjectAttributes {
  public type: string; // sf apex name
  public url: string // sf rest API url for record
}

/* Base SObject */
export abstract class SObject {

  @sField({apiName:'Id', readOnly:true, required:false, reference: null, childRelationship: false})
  public id: string | undefined;
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

/**
 * Abstract Base class which provides DML to Generated SObjects
 *
 * @export
 * @abstract
 * @class RestObject
 * @extends {SObject}
 */
export abstract class RestObject extends SObject {

  constructor(type: string) {
    super(type);
  }

  /**
   * Converts API name to javascript property name
   *
   * @static
   * @param {string} apiName Salesforce API name
   * @returns {string} converted in cammel case
   * @memberof RestObject
   */
  public static sanatizeProperty(apiName :string): string{
    let s = apiName.replace('__c', '').replace('_', '');
    return apiName.charAt(0).toLowerCase() + s.slice(1);
  }

  public async refresh(): Promise<void> {
    if (this.id == null) {
      throw new Error('Must have Id to refresh!');
    }

    const response = await Rest.Instance.request.get(`/sobjects/${this.attributes.type}/${this.id}`);
    RestObject.mapFromQuery(this, response.data);
  }
  /**
  * inserts the sobject to Salesfroce
  *
  * @param {boolean} [refresh] Set to true to apply GET after update
  * @returns {Promise<void>}
  * @memberof RestObject
  */
  public async insert(refresh?:boolean): Promise<void> {
    let insertCompositeRef = 'newObject';

    let composite = new Composite().addRequest(
      'POST',
      `sobjects/${this.attributes.type}`,
      insertCompositeRef,
      this.prepareForDML()
    );

    if(refresh === true){
      composite.addRequest(
        'GET',
        `sobjects/${this.attributes.type}/@{${insertCompositeRef}.id}`,
        'getObject'
      );
    }

    const compositeResult = await composite.send();
    this.handleCompositeErrors(compositeResult);

    if(refresh === true){
      let getResult = compositeResult.compositeResponse[1].body;
      RestObject.mapFromQuery(this, getResult);
    }else{
      this.id = compositeResult.compositeResponse[0].body.id
      return;
    }
  }

  /**
  * Updates the sObject on Salesforce
  * @param {boolean} [refresh] Set to true to apply GET after update
  * @returns {Promise<void>}
  * @memberof RestObject
  */
  public async update(refresh?:boolean): Promise<void> {

    if (this.id == null) {
      throw new Error('Must have Id to update!');
    }

    let batchRequest = await new CompositeBatch()
    .addUpdate(this);

    if(refresh === true){
      batchRequest.addGet(this)
    }
    const batchResponse = await batchRequest.send();
    this.handleCompositeBatchErrors(batchResponse);

    if(refresh === true){
      let getResult = batchResponse.results[1].result;
      RestObject.mapFromQuery(this, getResult);
    }else{
      return;
    }
  }

  /**
   * Deletes the Object from Salesforce
   *
   * @returns {Promise<DMLResponse>}
   * @memberof RestObject
   */
  public async delete(): Promise<DMLResponse> {
    if (this.id == null) {
      throw new Error('Must have Id to Delete!');
    }
    const response = await this.generateCall(`/sobjects/${this.attributes.type}/${this.id}?_HttpMethod=DELETE`, this);
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

  /**
   * Gets JSON Object from RestObject
   * @returns {*} JSON represenation of SObject (mapped using decorators)
   * @memberof RestObject
   */
  public prepareForDML(): any {
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

  private handleCompositeErrors(compositeResult: CompositeResult){
    let errors: string[] = []
    compositeResult.compositeResponse.forEach(batchResult => {
      if(batchResult.httpStatusCode < 200 || batchResult.httpStatusCode >= 300){
        errors.push(batchResult.body);
      }
    });

    if(errors.length){
      throw new Error(JSON.stringify(errors));
    }
  }

  private handleCompositeBatchErrors(batchResponse: BatchResponse){
    if(batchResponse.hasErrors){
      let errors: string[] = []
      batchResponse.results.forEach(batchResult => {
        if(batchResult.statusCode < 200 || batchResult.statusCode >= 300){
          errors.push(batchResult.result);
        }
      });
      throw new Error(JSON.stringify(errors));
    }
  }

  private generateCall(path: string, data: SObject): Promise<AxiosResponse> {
    return Rest.Instance.request.post(path, data);
  }

}



