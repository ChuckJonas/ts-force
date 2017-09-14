import { sField } from './sObjectDecorators'
import { RestObject, SObject } from './sObject'
/**
* Polymorphic Relationship object.  Called "Name" object in salesforce
*/
export class PolyRestObject extends RestObject {

    @sField({ apiName: 'id', readOnly: false, required: true, reference: undefined, childRelationship: false })
    id: string
    @sField({ apiName: 'name', readOnly: false, required: true, reference: undefined, childRelationship: false })
    name: string
    @sField({ apiName: 'lastName', readOnly: false, required: true, reference: undefined, childRelationship: false })
    lastName: string
    @sField({ apiName: 'firstName', readOnly: false, required: true, reference: undefined, childRelationship: false })
    firstName: string
    @sField({ apiName: 'type', readOnly: false, required: true, reference: undefined, childRelationship: false })
    type: string
    @sField({ apiName: 'alias', readOnly: false, required: true, reference: undefined, childRelationship: false })
    alias: string
    @sField({ apiName: 'userRoleId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    userRoleId: string
    @sField({ apiName: 'recordTypeId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    recordTypeId: string
    @sField({ apiName: 'isActive', readOnly: false, required: true, reference: undefined, childRelationship: false })
    isActive: string
    @sField({ apiName: 'profileId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    profileId: string
    @sField({ apiName: 'title', readOnly: false, required: true, reference: undefined, childRelationship: false })
    title: string
    @sField({ apiName: 'email', readOnly: false, required: true, reference: undefined, childRelationship: false })
    email: string
    @sField({ apiName: 'phone', readOnly: false, required: true, reference: undefined, childRelationship: false })
    phone: string
    @sField({ apiName: 'nameOrAlias', readOnly: false, required: true, reference: undefined, childRelationship: false })
    nameOrAlias: string
    @sField({ apiName: 'username', readOnly: false, required: true, reference: undefined, childRelationship: false })
    username: string
    @sField({ apiName: 'lastViewedDate', readOnly: false, required: true, reference: undefined, childRelationship: false })
    lastViewedDate: Date
    @sField({ apiName: 'lastReferencedDate', readOnly: false, required: true, reference: undefined, childRelationship: false })
    lastReferencedDate: Date

    constructor () {
        super('')
        this.id = void 0
        this.name = void 0
        this.lastName = void 0
        this.firstName = void 0
        this.type = void 0
        this.alias = void 0
        this.userRoleId = void 0
        this.recordTypeId = void 0
        this.isActive = void 0
        this.profileId = void 0
        this.title = void 0
        this.email = void 0
        this.phone = void 0
        this.nameOrAlias = void 0
        this.username = void 0
        this.lastViewedDate = void 0
        this.lastReferencedDate = void 0
    }

    protected mapFromQuery (data: any): RestObject {
        super.mapFromQuery(data)
        let myRegexp = /\/services\/data\/v.*\/sobjects\/(.*)\//g
        let match = myRegexp.exec(data.attributes.url)
        this.attributes.type = match[1]
        return this
    }

}
