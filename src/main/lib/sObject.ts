import { DEFAULT_CONFIG } from '../../auth/baseConfig';
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
        if (DEFAULT_CONFIG.version) {
            this.attributes.url = `/services/data/${DEFAULT_CONFIG.version}/sobjects/${this.attributes.type}`;
        }
    }
}
