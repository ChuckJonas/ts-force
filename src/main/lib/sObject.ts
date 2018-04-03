import { Rest, QueryResponse } from './rest';
import { Composite, CompositeResult, CompositeResponse, CompositeBatch, BatchResponse, CompositeBatchResult } from './composite';
import { AxiosResponse } from 'axios';
import { getSFieldProps, SalesforceFieldType, sField, SFieldProperties } from './sObjectDecorators';
import * as _ from 'lodash';

export class SObjectAttributes {
    public type: string; // sf apex name
    public url: string; // sf rest API url for record
}

/* Base SObject */
export abstract class SObject {

    @sField({apiName: 'Id', readOnly: true, required: false, reference: null, childRelationship: false, salesforceType: SalesforceFieldType.ID})
    public id: string | undefined;
    public attributes: SObjectAttributes;

    constructor (type: string) {

        this.attributes = new SObjectAttributes();
        this.attributes.type = type;
        this.attributes.url = `/services/data/${Rest.Instance.version}/sobjects/${this.attributes.type}`;
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

    constructor (type: string) {
        super(type);
    }

    protected static async query < T extends RestObject > (type: { new(): T }, qry: string): Promise < T[] > {
        const response = await Rest.Instance.query<T>(qry);
        let sobs: Array<T> = [];
        for (let i = 0; i < response.records.length; i++) {
            let sob = new type();
            // recursivly build up concrete restobjects
            sob.mapFromQuery(response.records[i]);
            sobs.push(sob);
        }
        return sobs;
    }

    handleCompositeUpdateResult = (result: CompositeResponse) => {
         this.id = result.body.id;
    }

    handleCompositeGetResult = (result: CompositeResponse) => {
        this.mapFromQuery(result.body);
    }

    handleCompositeBatchGetResult = (result: CompositeBatchResult) => {
        this.mapFromQuery(result.result);
    }

    public clone (): this {
        return _.cloneDeep(this);
    }

    public async refresh (): Promise < this > {
        if (this.id == null) {
            throw new Error('Must have Id to refresh!');
        }

        let response = await Rest.Instance.handleRequest<this>(
            () => {
                return Rest.Instance.request.get(`${this.attributes.url}/${this.id}`);
            }
        );

        this.mapFromQuery(response);
        return this;
    }
    /**
    * inserts the sobject to Salesfroce
    *
    * @param {boolean} [refresh] Set to true to apply GET after update
    * @returns {Promise<void>}
    * @memberof RestObject
    */
    public async insert (refresh ?: boolean): Promise < this > {
        let insertCompositeRef = 'newObject';

        let composite = new Composite().addRequest({
                method: 'POST',
                url: this.attributes.url,
                referenceId: insertCompositeRef,
                body: this.prepareForDML()
        }, this.handleCompositeUpdateResult);

        if (refresh === true) {
            composite.addRequest({
                method: 'GET',
                url: `${this.attributes.url}/@{${insertCompositeRef}.id}`,
                referenceId: 'getObject'
            }, this.handleCompositeGetResult);
        }

        const compositeResult = await composite.send();
        this.handleCompositeErrors(compositeResult);
        return this;
    }

    /**
    * Updates the sObject on Salesforce
    * @param {boolean} [refresh] Set to true to apply GET after update
    * @returns {Promise<void>}
    * @memberof RestObject
    */
    public async update (refresh ?: boolean): Promise < this > {

        if (this.id == null) {
            throw new Error('Must have Id to update!');
        }

        let batchRequest = new CompositeBatch()
        .addUpdate(this);

        if (refresh === true) {
            batchRequest.addGet(this, this.handleCompositeBatchGetResult);
        }
        const batchResponse = await batchRequest.send();
        this.handleCompositeBatchErrors(batchResponse);

        return this;
    }

    /**
    * Deletes the Object from Salesforce
    *
    * @returns {Promise<DMLResponse>}
    * @memberof RestObject
    */
    public async delete (): Promise < DMLResponse > {
        if (this.id == null) {
            throw new Error('Must have Id to Delete!');
        }
        let response = await Rest.Instance.handleRequest<DMLResponse>(
            () => {
                return Rest.Instance.request.delete(`${this.attributes.url}/${this.id}`);
            }
        );
        return response;
    }

    /**
    * Gets JSON Object from RestObject
    * @returns {*} JSON represenation of SObject (mapped using decorators)
    * @memberof RestObject
    */
    public prepareForDML (): any {
        let data = {};

        // loop each property
        for (let i in this) {
            // clean properties
            if (this.hasOwnProperty(i)) {
                if ((i === 'attributes') && this[i]) {
                    data[i.toString()] = this[i];
                }
                let sFieldProps = getSFieldProps(this, i);
                if (sFieldProps) {
                    if (sFieldProps.readOnly || sFieldProps.reference != null) {
                        // remove readonly && reference types
                        continue;
                    }
                    // copy with mapping
                    data[sFieldProps.apiName] = this[i];
                }
            }
        }
        return data;
    }

     // copies data from a json object to restobject
    protected mapFromQuery (data: SObject): RestObject {

        // create a map of lowercase API names -> sob property names
        let apiNameMap = this.getNameMapping(); // should be cached properly

        // loop through returned data
        for (let i in data) {
            if (data.hasOwnProperty(i)) {

                // translate prop name & get decorator
                let sobPropName = apiNameMap.get(i.toLowerCase());
                let sFieldProps = getSFieldProps(this, sobPropName);
                if (!sFieldProps) { // no mapping found
                    continue;
                }

                if (!sFieldProps.reference) {
                    if (data[i] === null) {
                        this[sobPropName] = void 0;
                    }else {
                        let val = data[i];
                        if (sFieldProps.salesforceType === SalesforceFieldType.DATETIME || sFieldProps.salesforceType === SalesforceFieldType.DATE) {
                            val = new Date(val);
                        }
                        this[sobPropName] = val;
                    }

                } else {
                    // reference type
                    let type: { new(): RestObject; } = sFieldProps.reference();

                    if (sFieldProps.childRelationship === true) {
                        // child type, map each record
                        this[sobPropName] = [];
                        if (data[i]) {
                            data[i].records.forEach(record => {
                                let typeInstance = new type();
                                this[sobPropName].push(typeInstance.mapFromQuery(record));
                            });
                        }

                    } else {
                        let typeInstance = new type();
                        // parent type.  Map data
                        this[sobPropName] = typeInstance.mapFromQuery(data[i]);
                    }
                }
            }
        }
        return this;
    }

    // returns a mapping of API Name (lower case) -> Property Name
    private getNameMapping (): Map < string, string > {
        let apiNameMap = new Map<string, string>();
        for (let i in this) {
            // clean properties
            if (this.hasOwnProperty(i)) {
                let sFieldProps = getSFieldProps(this, i);
                if (sFieldProps) {
                    apiNameMap.set(sFieldProps.apiName.toLowerCase(), i);
                }else {
                    apiNameMap.set(i,i);
                }
            }
        }
        return apiNameMap;
    }

    private handleCompositeErrors (compositeResult: CompositeResult) {
        let errors: string[] = [];
        compositeResult.compositeResponse.forEach(batchResult => {
            if (batchResult.httpStatusCode < 200 || batchResult.httpStatusCode >= 300) {
                errors.push(batchResult.body);
            }
        });

        if (errors.length) {
            throw new Error(JSON.stringify(errors));
        }
    }

    private handleCompositeBatchErrors (batchResponse: BatchResponse) {
        if (batchResponse.hasErrors) {
            let errors: string[] = [];
            batchResponse.results.forEach(batchResult => {
                if (batchResult.statusCode < 200 || batchResult.statusCode >= 300) {
                    errors.push(batchResult.result);
                }
            });
            throw new Error(JSON.stringify(errors));
        }
    }
}

export class SFLocation {
    public latitude: number; // sf apex name
    public longitude: number; // sf rest API url for record
}
