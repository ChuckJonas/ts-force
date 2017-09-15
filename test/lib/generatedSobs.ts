import { RestObject, SObject, sField } from '../../src/index';
/**
 * Property Interface for Account
 */
export interface AccountFields {
    contacts?: Contact[];
    id?: string;
    isDeleted?: boolean;
    masterRecord?: Account;
    masterRecordId?: string;
    name?: string;
    type?: string;
    parent?: Account;
    parentId?: string;
    billingStreet?: string;
    billingCity?: string;
    billingState?: string;
    billingPostalCode?: string;
    billingCountry?: string;
    billingLatitude?: number;
    billingLongitude?: number;
    billingGeocodeAccuracy?: string;
    billingAddress?: string;
    shippingStreet?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    shippingLatitude?: number;
    shippingLongitude?: number;
    shippingGeocodeAccuracy?: string;
    shippingAddress?: string;
    phone?: string;
    fax?: string;
    accountNumber?: string;
    website?: string;
    photoUrl?: string;
    sic?: string;
    industry?: string;
    annualRevenue?: number;
    numberOfEmployees?: string;
    ownership?: string;
    tickerSymbol?: string;
    description?: string;
    rating?: string;
    site?: string;
    ownerId?: string;
    createdDate?: Date;
    createdById?: string;
    lastModifiedDate?: Date;
    lastModifiedById?: string;
    systemModstamp?: Date;
    lastActivityDate?: Date;
    lastViewedDate?: Date;
    lastReferencedDate?: Date;
    jigsaw?: string;
    jigsawCompanyId?: string;
    cleanStatus?: string;
    accountSource?: string;
    dunsNumber?: string;
    tradestyle?: string;
    naicsCode?: string;
    naicsDesc?: string;
    yearStarted?: string;
    sicDesc?: string;
    dandbCompanyId?: string;
    operatingHoursId?: string;
    customerPriority?: string;
    sLA?: string;
    active?: string;
    numberofLocations?: number;
    upsellOpportunity?: string;
    sLASerialNumber?: string;
    sLAExpirationDate?: Date;
}
/**
 * Generated class for Account
 */
export class Account extends RestObject implements AccountFields {
    @sField({ apiName: 'Contacts', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: true, salesforceType: 'undefined' })
    contacts: Contact[];
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'id' })
    id: string;
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'boolean' })
    isDeleted: boolean;
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false, salesforceType: 'undefined' })
    masterRecord: Account;
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    masterRecordId: string;
    @sField({ apiName: 'Name', readOnly: false, required: true, reference: undefined, childRelationship: false, salesforceType: 'string' })
    name: string;
    @sField({ apiName: 'Type', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    type: string;
    @sField({ apiName: 'Parent', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false, salesforceType: 'undefined' })
    parent: Account;
    @sField({ apiName: 'ParentId', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    parentId: string;
    @sField({ apiName: 'BillingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    billingStreet: string;
    @sField({ apiName: 'BillingCity', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    billingCity: string;
    @sField({ apiName: 'BillingState', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    billingState: string;
    @sField({ apiName: 'BillingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    billingPostalCode: string;
    @sField({ apiName: 'BillingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    billingCountry: string;
    @sField({ apiName: 'BillingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    billingLatitude: number;
    @sField({ apiName: 'BillingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    billingLongitude: number;
    @sField({ apiName: 'BillingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    billingGeocodeAccuracy: string;
    @sField({ apiName: 'BillingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'address' })
    billingAddress: string;
    @sField({ apiName: 'ShippingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    shippingStreet: string;
    @sField({ apiName: 'ShippingCity', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    shippingCity: string;
    @sField({ apiName: 'ShippingState', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    shippingState: string;
    @sField({ apiName: 'ShippingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    shippingPostalCode: string;
    @sField({ apiName: 'ShippingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    shippingCountry: string;
    @sField({ apiName: 'ShippingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    shippingLatitude: number;
    @sField({ apiName: 'ShippingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    shippingLongitude: number;
    @sField({ apiName: 'ShippingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    shippingGeocodeAccuracy: string;
    @sField({ apiName: 'ShippingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'address' })
    shippingAddress: string;
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    phone: string;
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    fax: string;
    @sField({ apiName: 'AccountNumber', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    accountNumber: string;
    @sField({ apiName: 'Website', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'url' })
    website: string;
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'url' })
    photoUrl: string;
    @sField({ apiName: 'Sic', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    sic: string;
    @sField({ apiName: 'Industry', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    industry: string;
    @sField({ apiName: 'AnnualRevenue', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'currency' })
    annualRevenue: number;
    @sField({ apiName: 'NumberOfEmployees', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'int' })
    numberOfEmployees: string;
    @sField({ apiName: 'Ownership', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    ownership: string;
    @sField({ apiName: 'TickerSymbol', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    tickerSymbol: string;
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    description: string;
    @sField({ apiName: 'Rating', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    rating: string;
    @sField({ apiName: 'Site', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    site: string;
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    ownerId: string;
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    createdDate: Date;
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    createdById: string;
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    systemModstamp: Date;
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'date' })
    lastActivityDate: Date;
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastReferencedDate: Date;
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    jigsaw: string;
    @sField({ apiName: 'JigsawCompanyId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    jigsawCompanyId: string;
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    cleanStatus: string;
    @sField({ apiName: 'AccountSource', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    accountSource: string;
    @sField({ apiName: 'DunsNumber', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    dunsNumber: string;
    @sField({ apiName: 'Tradestyle', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    tradestyle: string;
    @sField({ apiName: 'NaicsCode', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    naicsCode: string;
    @sField({ apiName: 'NaicsDesc', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    naicsDesc: string;
    @sField({ apiName: 'YearStarted', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    yearStarted: string;
    @sField({ apiName: 'SicDesc', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    sicDesc: string;
    @sField({ apiName: 'DandbCompanyId', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    dandbCompanyId: string;
    @sField({ apiName: 'OperatingHoursId', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    operatingHoursId: string;
    @sField({ apiName: 'CustomerPriority__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    customerPriority: string;
    @sField({ apiName: 'SLA__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    sLA: string;
    @sField({ apiName: 'Active__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    active: string;
    @sField({ apiName: 'NumberofLocations__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    numberofLocations: number;
    @sField({ apiName: 'UpsellOpportunity__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    upsellOpportunity: string;
    @sField({ apiName: 'SLASerialNumber__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    sLASerialNumber: string;
    @sField({ apiName: 'SLAExpirationDate__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'date' })
    sLAExpirationDate: Date;
    constructor (fields?: AccountFields) {
        super('Account');
        this.contacts = void 0;
        this.id = void 0;
        this.isDeleted = void 0;
        this.masterRecord = void 0;
        this.masterRecordId = void 0;
        this.name = void 0;
        this.type = void 0;
        this.parent = void 0;
        this.parentId = void 0;
        this.billingStreet = void 0;
        this.billingCity = void 0;
        this.billingState = void 0;
        this.billingPostalCode = void 0;
        this.billingCountry = void 0;
        this.billingLatitude = void 0;
        this.billingLongitude = void 0;
        this.billingGeocodeAccuracy = void 0;
        this.billingAddress = void 0;
        this.shippingStreet = void 0;
        this.shippingCity = void 0;
        this.shippingState = void 0;
        this.shippingPostalCode = void 0;
        this.shippingCountry = void 0;
        this.shippingLatitude = void 0;
        this.shippingLongitude = void 0;
        this.shippingGeocodeAccuracy = void 0;
        this.shippingAddress = void 0;
        this.phone = void 0;
        this.fax = void 0;
        this.accountNumber = void 0;
        this.website = void 0;
        this.photoUrl = void 0;
        this.sic = void 0;
        this.industry = void 0;
        this.annualRevenue = void 0;
        this.numberOfEmployees = void 0;
        this.ownership = void 0;
        this.tickerSymbol = void 0;
        this.description = void 0;
        this.rating = void 0;
        this.site = void 0;
        this.ownerId = void 0;
        this.createdDate = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedById = void 0;
        this.systemModstamp = void 0;
        this.lastActivityDate = void 0;
        this.lastViewedDate = void 0;
        this.lastReferencedDate = void 0;
        this.jigsaw = void 0;
        this.jigsawCompanyId = void 0;
        this.cleanStatus = void 0;
        this.accountSource = void 0;
        this.dunsNumber = void 0;
        this.tradestyle = void 0;
        this.naicsCode = void 0;
        this.naicsDesc = void 0;
        this.yearStarted = void 0;
        this.sicDesc = void 0;
        this.dandbCompanyId = void 0;
        this.operatingHoursId = void 0;
        this.customerPriority = void 0;
        this.sLA = void 0;
        this.active = void 0;
        this.numberofLocations = void 0;
        this.upsellOpportunity = void 0;
        this.sLASerialNumber = void 0;
        this.sLAExpirationDate = void 0;
        Object.assign(this, fields);
    }
    static async retrieve (qry: string): Promise<Account[]> {
        return await RestObject.query<Account>(Account, qry);
    }
}
/**
 * Property Interface for Contact
 */
export interface ContactFields {
    id?: string;
    isDeleted?: boolean;
    masterRecord?: Contact;
    masterRecordId?: string;
    account?: Account;
    accountId?: string;
    lastName?: string;
    firstName?: string;
    salutation?: string;
    name?: string;
    otherStreet?: string;
    otherCity?: string;
    otherState?: string;
    otherPostalCode?: string;
    otherCountry?: string;
    otherLatitude?: number;
    otherLongitude?: number;
    otherGeocodeAccuracy?: string;
    otherAddress?: string;
    mailingStreet?: string;
    mailingCity?: string;
    mailingState?: string;
    mailingPostalCode?: string;
    mailingCountry?: string;
    mailingLatitude?: number;
    mailingLongitude?: number;
    mailingGeocodeAccuracy?: string;
    mailingAddress?: string;
    phone?: string;
    fax?: string;
    mobilePhone?: string;
    homePhone?: string;
    otherPhone?: string;
    assistantPhone?: string;
    reportsTo?: Contact;
    reportsToId?: string;
    email?: string;
    title?: string;
    department?: string;
    assistantName?: string;
    leadSource?: string;
    birthdate?: Date;
    description?: string;
    ownerId?: string;
    createdDate?: Date;
    createdById?: string;
    lastModifiedDate?: Date;
    lastModifiedById?: string;
    systemModstamp?: Date;
    lastActivityDate?: Date;
    lastCURequestDate?: Date;
    lastCUUpdateDate?: Date;
    lastViewedDate?: Date;
    lastReferencedDate?: Date;
    emailBouncedReason?: string;
    emailBouncedDate?: Date;
    isEmailBounced?: boolean;
    photoUrl?: string;
    jigsaw?: string;
    jigsawContactId?: string;
    cleanStatus?: string;
    level?: string;
    languages?: string;
}
/**
 * Generated class for Contact
 */
export class Contact extends RestObject  implements ContactFields {
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'id' })
    id: string;
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'boolean' })
    isDeleted: boolean;
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: false, salesforceType: 'undefined' })
    masterRecord: Contact;
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    masterRecordId: string;
    @sField({ apiName: 'Account', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false, salesforceType: 'undefined' })
    account: Account;
    @sField({ apiName: 'AccountId', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    accountId: string;
    @sField({ apiName: 'LastName', readOnly: false, required: true, reference: undefined, childRelationship: false, salesforceType: 'string' })
    lastName: string;
    @sField({ apiName: 'FirstName', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    firstName: string;
    @sField({ apiName: 'Salutation', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    salutation: string;
    @sField({ apiName: 'Name', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    name: string;
    @sField({ apiName: 'OtherStreet', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    otherStreet: string;
    @sField({ apiName: 'OtherCity', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    otherCity: string;
    @sField({ apiName: 'OtherState', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    otherState: string;
    @sField({ apiName: 'OtherPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    otherPostalCode: string;
    @sField({ apiName: 'OtherCountry', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    otherCountry: string;
    @sField({ apiName: 'OtherLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    otherLatitude: number;
    @sField({ apiName: 'OtherLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    otherLongitude: number;
    @sField({ apiName: 'OtherGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    otherGeocodeAccuracy: string;
    @sField({ apiName: 'OtherAddress', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'address' })
    otherAddress: string;
    @sField({ apiName: 'MailingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    mailingStreet: string;
    @sField({ apiName: 'MailingCity', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    mailingCity: string;
    @sField({ apiName: 'MailingState', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    mailingState: string;
    @sField({ apiName: 'MailingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    mailingPostalCode: string;
    @sField({ apiName: 'MailingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    mailingCountry: string;
    @sField({ apiName: 'MailingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    mailingLatitude: number;
    @sField({ apiName: 'MailingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'double' })
    mailingLongitude: number;
    @sField({ apiName: 'MailingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    mailingGeocodeAccuracy: string;
    @sField({ apiName: 'MailingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'address' })
    mailingAddress: string;
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    phone: string;
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    fax: string;
    @sField({ apiName: 'MobilePhone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    mobilePhone: string;
    @sField({ apiName: 'HomePhone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    homePhone: string;
    @sField({ apiName: 'OtherPhone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    otherPhone: string;
    @sField({ apiName: 'AssistantPhone', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'phone' })
    assistantPhone: string;
    @sField({ apiName: 'ReportsTo', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: false, salesforceType: 'undefined' })
    reportsTo: Contact;
    @sField({ apiName: 'ReportsToId', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    reportsToId: string;
    @sField({ apiName: 'Email', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'email' })
    email: string;
    @sField({ apiName: 'Title', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    title: string;
    @sField({ apiName: 'Department', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    department: string;
    @sField({ apiName: 'AssistantName', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    assistantName: string;
    @sField({ apiName: 'LeadSource', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    leadSource: string;
    @sField({ apiName: 'Birthdate', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'date' })
    birthdate: Date;
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'textarea' })
    description: string;
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    ownerId: string;
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    createdDate: Date;
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    createdById: string;
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'reference' })
    lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    systemModstamp: Date;
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'date' })
    lastActivityDate: Date;
    @sField({ apiName: 'LastCURequestDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastCURequestDate: Date;
    @sField({ apiName: 'LastCUUpdateDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastCUUpdateDate: Date;
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    lastReferencedDate: Date;
    @sField({ apiName: 'EmailBouncedReason', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    emailBouncedReason: string;
    @sField({ apiName: 'EmailBouncedDate', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'datetime' })
    emailBouncedDate: Date;
    @sField({ apiName: 'IsEmailBounced', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'boolean' })
    isEmailBounced: boolean;
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'url' })
    photoUrl: string;
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    jigsaw: string;
    @sField({ apiName: 'JigsawContactId', readOnly: true, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    jigsawContactId: string;
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    cleanStatus: string;
    @sField({ apiName: 'Level__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'picklist' })
    level: string;
    @sField({ apiName: 'Languages__c', readOnly: false, required: false, reference: undefined, childRelationship: false, salesforceType: 'string' })
    languages: string;
    constructor (fields?: ContactFields) {
        super('Contact');
        this.id = void 0;
        this.isDeleted = void 0;
        this.masterRecord = void 0;
        this.masterRecordId = void 0;
        this.account = void 0;
        this.accountId = void 0;
        this.lastName = void 0;
        this.firstName = void 0;
        this.salutation = void 0;
        this.name = void 0;
        this.otherStreet = void 0;
        this.otherCity = void 0;
        this.otherState = void 0;
        this.otherPostalCode = void 0;
        this.otherCountry = void 0;
        this.otherLatitude = void 0;
        this.otherLongitude = void 0;
        this.otherGeocodeAccuracy = void 0;
        this.otherAddress = void 0;
        this.mailingStreet = void 0;
        this.mailingCity = void 0;
        this.mailingState = void 0;
        this.mailingPostalCode = void 0;
        this.mailingCountry = void 0;
        this.mailingLatitude = void 0;
        this.mailingLongitude = void 0;
        this.mailingGeocodeAccuracy = void 0;
        this.mailingAddress = void 0;
        this.phone = void 0;
        this.fax = void 0;
        this.mobilePhone = void 0;
        this.homePhone = void 0;
        this.otherPhone = void 0;
        this.assistantPhone = void 0;
        this.reportsTo = void 0;
        this.reportsToId = void 0;
        this.email = void 0;
        this.title = void 0;
        this.department = void 0;
        this.assistantName = void 0;
        this.leadSource = void 0;
        this.birthdate = void 0;
        this.description = void 0;
        this.ownerId = void 0;
        this.createdDate = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedById = void 0;
        this.systemModstamp = void 0;
        this.lastActivityDate = void 0;
        this.lastCURequestDate = void 0;
        this.lastCUUpdateDate = void 0;
        this.lastViewedDate = void 0;
        this.lastReferencedDate = void 0;
        this.emailBouncedReason = void 0;
        this.emailBouncedDate = void 0;
        this.isEmailBounced = void 0;
        this.photoUrl = void 0;
        this.jigsaw = void 0;
        this.jigsawContactId = void 0;
        this.cleanStatus = void 0;
        this.level = void 0;
        this.languages = void 0;
        Object.assign(this, fields);
    }
    static async retrieve (qry: string): Promise<Contact[]> {
        return await RestObject.query<Contact>(Contact, qry);
    }
}
