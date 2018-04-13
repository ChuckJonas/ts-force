import { Rest } from './rest';
import { SalesforceFieldType, sField } from './sObjectDecorators';

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
        if (Rest.Instance) {
            this.attributes.url = `/services/data/${Rest.Instance.version}/sobjects/${this.attributes.type}`;
        }
    }
}
