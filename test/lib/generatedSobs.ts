import { RestObject, SObject, sField } from '../../src/index'
export class Account extends RestObject {
    @sField({ apiName: 'Contacts', readOnly: true, required: false, reference: () => { return Contact }, childRelationship: true })
    contacts: Contact[]
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false })
    id: string
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false })
    isDeleted: boolean
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Account }, childRelationship: false })
    masterRecord: Account
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    masterRecordId: string
    @sField({ apiName: 'Name', readOnly: false, required: true, reference: undefined, childRelationship: false })
    name: string
    @sField({ apiName: 'Type', readOnly: false, required: false, reference: undefined, childRelationship: false })
    type: string
    @sField({ apiName: 'Parent', readOnly: true, required: false, reference: () => { return Account }, childRelationship: false })
    parent: Account
    @sField({ apiName: 'ParentId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    parentId: string
    @sField({ apiName: 'BillingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingStreet: string
    @sField({ apiName: 'BillingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingCity: string
    @sField({ apiName: 'BillingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingState: string
    @sField({ apiName: 'BillingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingPostalCode: string
    @sField({ apiName: 'BillingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingCountry: string
    @sField({ apiName: 'BillingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingLatitude: number
    @sField({ apiName: 'BillingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingLongitude: number
    @sField({ apiName: 'BillingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    billingGeocodeAccuracy: string
    @sField({ apiName: 'BillingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    billingAddress: string
    @sField({ apiName: 'ShippingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingStreet: string
    @sField({ apiName: 'ShippingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingCity: string
    @sField({ apiName: 'ShippingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingState: string
    @sField({ apiName: 'ShippingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingPostalCode: string
    @sField({ apiName: 'ShippingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingCountry: string
    @sField({ apiName: 'ShippingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingLatitude: number
    @sField({ apiName: 'ShippingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingLongitude: number
    @sField({ apiName: 'ShippingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    shippingGeocodeAccuracy: string
    @sField({ apiName: 'ShippingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    shippingAddress: string
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    phone: string
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false })
    fax: string
    @sField({ apiName: 'AccountNumber', readOnly: false, required: false, reference: undefined, childRelationship: false })
    accountNumber: string
    @sField({ apiName: 'Website', readOnly: false, required: false, reference: undefined, childRelationship: false })
    website: string
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false })
    photoUrl: string
    @sField({ apiName: 'Sic', readOnly: false, required: false, reference: undefined, childRelationship: false })
    sic: string
    @sField({ apiName: 'Industry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    industry: string
    @sField({ apiName: 'AnnualRevenue', readOnly: false, required: false, reference: undefined, childRelationship: false })
    annualRevenue: number
    @sField({ apiName: 'NumberOfEmployees', readOnly: false, required: false, reference: undefined, childRelationship: false })
    numberOfEmployees: string
    @sField({ apiName: 'Ownership', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ownership: string
    @sField({ apiName: 'TickerSymbol', readOnly: false, required: false, reference: undefined, childRelationship: false })
    tickerSymbol: string
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false })
    description: string
    @sField({ apiName: 'Rating', readOnly: false, required: false, reference: undefined, childRelationship: false })
    rating: string
    @sField({ apiName: 'Site', readOnly: false, required: false, reference: undefined, childRelationship: false })
    site: string
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    ownerId: string
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    createdDate: Date
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    createdById: string
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastModifiedDate: Date
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastModifiedById: string
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false })
    systemModstamp: Date
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastActivityDate: Date
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastViewedDate: Date
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastReferencedDate: Date
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false })
    jigsaw: string
    @sField({ apiName: 'JigsawCompanyId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    jigsawCompanyId: string
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false })
    cleanStatus: string
    @sField({ apiName: 'AccountSource', readOnly: false, required: false, reference: undefined, childRelationship: false })
    accountSource: string
    @sField({ apiName: 'DunsNumber', readOnly: false, required: false, reference: undefined, childRelationship: false })
    dunsNumber: string
    @sField({ apiName: 'Tradestyle', readOnly: false, required: false, reference: undefined, childRelationship: false })
    tradestyle: string
    @sField({ apiName: 'NaicsCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    naicsCode: string
    @sField({ apiName: 'NaicsDesc', readOnly: false, required: false, reference: undefined, childRelationship: false })
    naicsDesc: string
    @sField({ apiName: 'YearStarted', readOnly: false, required: false, reference: undefined, childRelationship: false })
    yearStarted: string
    @sField({ apiName: 'SicDesc', readOnly: false, required: false, reference: undefined, childRelationship: false })
    sicDesc: string
    @sField({ apiName: 'DandbCompanyId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    dandbCompanyId: string
    @sField({ apiName: 'OperatingHoursId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    operatingHoursId: string
    @sField({ apiName: 'CustomerPriority__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    customerPriority: string
    @sField({ apiName: 'SLA__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    sLA: string
    @sField({ apiName: 'Active__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    active: string
    @sField({ apiName: 'NumberofLocations__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    numberofLocations: number
    @sField({ apiName: 'UpsellOpportunity__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    upsellOpportunity: string
    @sField({ apiName: 'SLASerialNumber__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    sLASerialNumber: string
    @sField({ apiName: 'SLAExpirationDate__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    sLAExpirationDate: Date
    constructor () {
        super('Account')
        this.contacts = void 0
        this.id = void 0
        this.isDeleted = void 0
        this.masterRecord = void 0
        this.masterRecordId = void 0
        this.name = void 0
        this.type = void 0
        this.parent = void 0
        this.parentId = void 0
        this.billingStreet = void 0
        this.billingCity = void 0
        this.billingState = void 0
        this.billingPostalCode = void 0
        this.billingCountry = void 0
        this.billingLatitude = void 0
        this.billingLongitude = void 0
        this.billingGeocodeAccuracy = void 0
        this.billingAddress = void 0
        this.shippingStreet = void 0
        this.shippingCity = void 0
        this.shippingState = void 0
        this.shippingPostalCode = void 0
        this.shippingCountry = void 0
        this.shippingLatitude = void 0
        this.shippingLongitude = void 0
        this.shippingGeocodeAccuracy = void 0
        this.shippingAddress = void 0
        this.phone = void 0
        this.fax = void 0
        this.accountNumber = void 0
        this.website = void 0
        this.photoUrl = void 0
        this.sic = void 0
        this.industry = void 0
        this.annualRevenue = void 0
        this.numberOfEmployees = void 0
        this.ownership = void 0
        this.tickerSymbol = void 0
        this.description = void 0
        this.rating = void 0
        this.site = void 0
        this.ownerId = void 0
        this.createdDate = void 0
        this.createdById = void 0
        this.lastModifiedDate = void 0
        this.lastModifiedById = void 0
        this.systemModstamp = void 0
        this.lastActivityDate = void 0
        this.lastViewedDate = void 0
        this.lastReferencedDate = void 0
        this.jigsaw = void 0
        this.jigsawCompanyId = void 0
        this.cleanStatus = void 0
        this.accountSource = void 0
        this.dunsNumber = void 0
        this.tradestyle = void 0
        this.naicsCode = void 0
        this.naicsDesc = void 0
        this.yearStarted = void 0
        this.sicDesc = void 0
        this.dandbCompanyId = void 0
        this.operatingHoursId = void 0
        this.customerPriority = void 0
        this.sLA = void 0
        this.active = void 0
        this.numberofLocations = void 0
        this.upsellOpportunity = void 0
        this.sLASerialNumber = void 0
        this.sLAExpirationDate = void 0
    }
    static async retrieve (qry: string): Promise<Account[]> {
        return await RestObject.query<Account>(Account, qry)
    }
}
export class Contact extends RestObject {
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false })
    id: string
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false })
    isDeleted: boolean
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Contact }, childRelationship: false })
    masterRecord: Contact
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    masterRecordId: string
    @sField({ apiName: 'Account', readOnly: true, required: false, reference: () => { return Account }, childRelationship: false })
    account: Account
    @sField({ apiName: 'AccountId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    accountId: string
    @sField({ apiName: 'LastName', readOnly: false, required: true, reference: undefined, childRelationship: false })
    lastName: string
    @sField({ apiName: 'FirstName', readOnly: false, required: false, reference: undefined, childRelationship: false })
    firstName: string
    @sField({ apiName: 'Salutation', readOnly: false, required: false, reference: undefined, childRelationship: false })
    salutation: string
    @sField({ apiName: 'Name', readOnly: true, required: false, reference: undefined, childRelationship: false })
    name: string
    @sField({ apiName: 'OtherStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherStreet: string
    @sField({ apiName: 'OtherCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherCity: string
    @sField({ apiName: 'OtherState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherState: string
    @sField({ apiName: 'OtherPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherPostalCode: string
    @sField({ apiName: 'OtherCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherCountry: string
    @sField({ apiName: 'OtherLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherLatitude: number
    @sField({ apiName: 'OtherLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherLongitude: number
    @sField({ apiName: 'OtherGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherGeocodeAccuracy: string
    @sField({ apiName: 'OtherAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    otherAddress: string
    @sField({ apiName: 'MailingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingStreet: string
    @sField({ apiName: 'MailingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingCity: string
    @sField({ apiName: 'MailingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingState: string
    @sField({ apiName: 'MailingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingPostalCode: string
    @sField({ apiName: 'MailingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingCountry: string
    @sField({ apiName: 'MailingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingLatitude: number
    @sField({ apiName: 'MailingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingLongitude: number
    @sField({ apiName: 'MailingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mailingGeocodeAccuracy: string
    @sField({ apiName: 'MailingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    mailingAddress: string
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    phone: string
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false })
    fax: string
    @sField({ apiName: 'MobilePhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    mobilePhone: string
    @sField({ apiName: 'HomePhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    homePhone: string
    @sField({ apiName: 'OtherPhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    otherPhone: string
    @sField({ apiName: 'AssistantPhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    assistantPhone: string
    @sField({ apiName: 'ReportsTo', readOnly: true, required: false, reference: () => { return Contact }, childRelationship: false })
    reportsTo: Contact
    @sField({ apiName: 'ReportsToId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    reportsToId: string
    @sField({ apiName: 'Email', readOnly: false, required: false, reference: undefined, childRelationship: false })
    email: string
    @sField({ apiName: 'Title', readOnly: false, required: false, reference: undefined, childRelationship: false })
    title: string
    @sField({ apiName: 'Department', readOnly: false, required: false, reference: undefined, childRelationship: false })
    department: string
    @sField({ apiName: 'AssistantName', readOnly: false, required: false, reference: undefined, childRelationship: false })
    assistantName: string
    @sField({ apiName: 'LeadSource', readOnly: false, required: false, reference: undefined, childRelationship: false })
    leadSource: string
    @sField({ apiName: 'Birthdate', readOnly: false, required: false, reference: undefined, childRelationship: false })
    birthdate: Date
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false })
    description: string
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    ownerId: string
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    createdDate: Date
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    createdById: string
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastModifiedDate: Date
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastModifiedById: string
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false })
    systemModstamp: Date
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastActivityDate: Date
    @sField({ apiName: 'LastCURequestDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastCURequestDate: Date
    @sField({ apiName: 'LastCUUpdateDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastCUUpdateDate: Date
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastViewedDate: Date
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    lastReferencedDate: Date
    @sField({ apiName: 'EmailBouncedReason', readOnly: false, required: false, reference: undefined, childRelationship: false })
    emailBouncedReason: string
    @sField({ apiName: 'EmailBouncedDate', readOnly: false, required: false, reference: undefined, childRelationship: false })
    emailBouncedDate: Date
    @sField({ apiName: 'IsEmailBounced', readOnly: true, required: false, reference: undefined, childRelationship: false })
    isEmailBounced: boolean
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false })
    photoUrl: string
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false })
    jigsaw: string
    @sField({ apiName: 'JigsawContactId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    jigsawContactId: string
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false })
    cleanStatus: string
    @sField({ apiName: 'Level__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    level: string
    @sField({ apiName: 'Languages__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    languages: string
    constructor () {
        super('Contact')
        this.id = void 0
        this.isDeleted = void 0
        this.masterRecord = void 0
        this.masterRecordId = void 0
        this.account = void 0
        this.accountId = void 0
        this.lastName = void 0
        this.firstName = void 0
        this.salutation = void 0
        this.name = void 0
        this.otherStreet = void 0
        this.otherCity = void 0
        this.otherState = void 0
        this.otherPostalCode = void 0
        this.otherCountry = void 0
        this.otherLatitude = void 0
        this.otherLongitude = void 0
        this.otherGeocodeAccuracy = void 0
        this.otherAddress = void 0
        this.mailingStreet = void 0
        this.mailingCity = void 0
        this.mailingState = void 0
        this.mailingPostalCode = void 0
        this.mailingCountry = void 0
        this.mailingLatitude = void 0
        this.mailingLongitude = void 0
        this.mailingGeocodeAccuracy = void 0
        this.mailingAddress = void 0
        this.phone = void 0
        this.fax = void 0
        this.mobilePhone = void 0
        this.homePhone = void 0
        this.otherPhone = void 0
        this.assistantPhone = void 0
        this.reportsTo = void 0
        this.reportsToId = void 0
        this.email = void 0
        this.title = void 0
        this.department = void 0
        this.assistantName = void 0
        this.leadSource = void 0
        this.birthdate = void 0
        this.description = void 0
        this.ownerId = void 0
        this.createdDate = void 0
        this.createdById = void 0
        this.lastModifiedDate = void 0
        this.lastModifiedById = void 0
        this.systemModstamp = void 0
        this.lastActivityDate = void 0
        this.lastCURequestDate = void 0
        this.lastCUUpdateDate = void 0
        this.lastViewedDate = void 0
        this.lastReferencedDate = void 0
        this.emailBouncedReason = void 0
        this.emailBouncedDate = void 0
        this.isEmailBounced = void 0
        this.photoUrl = void 0
        this.jigsaw = void 0
        this.jigsawContactId = void 0
        this.cleanStatus = void 0
        this.level = void 0
        this.languages = void 0
    }
    static async retrieve (qry: string): Promise<Contact[]> {
        return await RestObject.query<Contact>(Contact, qry)
    }
}
