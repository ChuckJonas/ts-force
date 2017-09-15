import { sField } from './sObjectDecorators';
import { RestObject, SObject } from './sObject';
/**
* Polymorphic Relationship object.  Called "Name" object in salesforce
*/
export class PolyRestObject extends RestObject {

    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'id' })
    id: string;
    @sField({ apiName: 'Name', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    name: string;
    @sField({ apiName: 'LastName', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    lastName: string;
    @sField({ apiName: 'FirstName', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    firstName: string;
    @sField({ apiName: 'Type', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    type: string;
    @sField({ apiName: 'Alias', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    alias: string;
    @sField({ apiName: 'UserRoleId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    userRoleId: string;
    @sField({ apiName: 'RecordTypeId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    recordTypeId: string;
    @sField({ apiName: 'IsActive', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'boolean' })
    isActive: boolean;
    @sField({ apiName: 'ProfileId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    profileId: string;
    @sField({ apiName: 'Title', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    title: string;
    @sField({ apiName: 'Email', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'email' })
    email: string;
    @sField({ apiName: 'Phone', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    phone: string;
    @sField({ apiName: 'NameOrAlias', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    nameOrAlias: string;
    @sField({ apiName: 'Username', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    username: string;
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastReferencedDate: Date;

    constructor () {
        super('');
        this.id = void 0;
        this.name = void 0;
        this.lastName = void 0;
        this.firstName = void 0;
        this.type = void 0;
        this.alias = void 0;
        this.userRoleId = void 0;
        this.recordTypeId = void 0;
        this.isActive = void 0;
        this.profileId = void 0;
        this.title = void 0;
        this.email = void 0;
        this.phone = void 0;
        this.nameOrAlias = void 0;
        this.username = void 0;
        this.lastViewedDate = void 0;
        this.lastReferencedDate = void 0;
    }

    protected mapFromQuery (data: any): RestObject {
        super.mapFromQuery(data);
        let myRegexp = /\/services\/data\/v.*\/sobjects\/(.*)\//g;
        let match = myRegexp.exec(data.attributes.url);
        this.attributes.type = match[1];
        return this;
    }

}
