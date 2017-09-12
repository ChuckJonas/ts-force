//file should be recreated everytime we update the generate from a blank scratch org

import { RestObject, SObject, sField } from "../../src/index";
export class Account extends RestObject {
    @sField({ apiName: 'Contacts', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: true })
    Contacts: Contact[];
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false })
    Id: string;
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false })
    IsDeleted: string;
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false })
    MasterRecord: Account;
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    MasterRecordId: string;
    @sField({ apiName: 'Name', readOnly: false, required: true, reference: undefined, childRelationship: false })
    Name: string;
    @sField({ apiName: 'Type', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Type: string;
    @sField({ apiName: 'Parent', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false })
    Parent: Account;
    @sField({ apiName: 'ParentId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ParentId: string;
    @sField({ apiName: 'BillingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingStreet: string;
    @sField({ apiName: 'BillingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingCity: string;
    @sField({ apiName: 'BillingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingState: string;
    @sField({ apiName: 'BillingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingPostalCode: string;
    @sField({ apiName: 'BillingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingCountry: string;
    @sField({ apiName: 'BillingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingLatitude: number;
    @sField({ apiName: 'BillingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingLongitude: number;
    @sField({ apiName: 'BillingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    BillingGeocodeAccuracy: string;
    @sField({ apiName: 'BillingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    BillingAddress: string;
    @sField({ apiName: 'ShippingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingStreet: string;
    @sField({ apiName: 'ShippingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingCity: string;
    @sField({ apiName: 'ShippingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingState: string;
    @sField({ apiName: 'ShippingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingPostalCode: string;
    @sField({ apiName: 'ShippingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingCountry: string;
    @sField({ apiName: 'ShippingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingLatitude: number;
    @sField({ apiName: 'ShippingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingLongitude: number;
    @sField({ apiName: 'ShippingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ShippingGeocodeAccuracy: string;
    @sField({ apiName: 'ShippingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    ShippingAddress: string;
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Phone: string;
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Fax: string;
    @sField({ apiName: 'AccountNumber', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AccountNumber: string;
    @sField({ apiName: 'Website', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Website: string;
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false })
    PhotoUrl: string;
    @sField({ apiName: 'Sic', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Sic: string;
    @sField({ apiName: 'Industry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Industry: string;
    @sField({ apiName: 'AnnualRevenue', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AnnualRevenue: number;
    @sField({ apiName: 'NumberOfEmployees', readOnly: false, required: false, reference: undefined, childRelationship: false })
    NumberOfEmployees: string;
    @sField({ apiName: 'Ownership', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Ownership: string;
    @sField({ apiName: 'TickerSymbol', readOnly: false, required: false, reference: undefined, childRelationship: false })
    TickerSymbol: string;
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Description: string;
    @sField({ apiName: 'Rating', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Rating: string;
    @sField({ apiName: 'Site', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Site: string;
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    OwnerId: string;
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    CreatedDate: string;
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    CreatedById: string;
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastModifiedDate: string;
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false })
    SystemModstamp: string;
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastActivityDate: string;
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastViewedDate: string;
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastReferencedDate: string;
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Jigsaw: string;
    @sField({ apiName: 'JigsawCompanyId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    JigsawCompanyId: string;
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false })
    CleanStatus: string;
    @sField({ apiName: 'AccountSource', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AccountSource: string;
    @sField({ apiName: 'DunsNumber', readOnly: false, required: false, reference: undefined, childRelationship: false })
    DunsNumber: string;
    @sField({ apiName: 'Tradestyle', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Tradestyle: string;
    @sField({ apiName: 'NaicsCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    NaicsCode: string;
    @sField({ apiName: 'NaicsDesc', readOnly: false, required: false, reference: undefined, childRelationship: false })
    NaicsDesc: string;
    @sField({ apiName: 'YearStarted', readOnly: false, required: false, reference: undefined, childRelationship: false })
    YearStarted: string;
    @sField({ apiName: 'SicDesc', readOnly: false, required: false, reference: undefined, childRelationship: false })
    SicDesc: string;
    @sField({ apiName: 'DandbCompanyId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    DandbCompanyId: string;
    @sField({ apiName: 'OperatingHoursId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OperatingHoursId: string;
    @sField({ apiName: 'CustomerPriority__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    CustomerPriority__c: string;
    @sField({ apiName: 'SLA__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    SLA__c: string;
    @sField({ apiName: 'Active__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Active__c: string;
    @sField({ apiName: 'NumberofLocations__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    NumberofLocations__c: number;
    @sField({ apiName: 'UpsellOpportunity__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    UpsellOpportunity__c: string;
    @sField({ apiName: 'SLASerialNumber__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    SLASerialNumber__c: string;
    @sField({ apiName: 'SLAExpirationDate__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    SLAExpirationDate__c: string;
    constructor() {
        super('Account');
    }
    static async retrieve(qry: string): Promise<Account[]> {
        return await RestObject.query<Account>(Account, qry);
    }
}
export class Contact extends RestObject {
    @sField({ apiName: 'Id', readOnly: true, required: false, reference: undefined, childRelationship: false })
    Id: string;
    @sField({ apiName: 'IsDeleted', readOnly: true, required: false, reference: undefined, childRelationship: false })
    IsDeleted: string;
    @sField({ apiName: 'MasterRecord', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: false })
    MasterRecord: Contact;
    @sField({ apiName: 'MasterRecordId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    MasterRecordId: string;
    @sField({ apiName: 'Account', readOnly: true, required: false, reference: () => { return Account; }, childRelationship: false })
    Account: Account;
    @sField({ apiName: 'AccountId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AccountId: string;
    @sField({ apiName: 'LastName', readOnly: false, required: true, reference: undefined, childRelationship: false })
    LastName: string;
    @sField({ apiName: 'FirstName', readOnly: false, required: false, reference: undefined, childRelationship: false })
    FirstName: string;
    @sField({ apiName: 'Salutation', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Salutation: string;
    @sField({ apiName: 'Name', readOnly: true, required: false, reference: undefined, childRelationship: false })
    Name: string;
    @sField({ apiName: 'OtherStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherStreet: string;
    @sField({ apiName: 'OtherCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherCity: string;
    @sField({ apiName: 'OtherState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherState: string;
    @sField({ apiName: 'OtherPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherPostalCode: string;
    @sField({ apiName: 'OtherCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherCountry: string;
    @sField({ apiName: 'OtherLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherLatitude: number;
    @sField({ apiName: 'OtherLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherLongitude: number;
    @sField({ apiName: 'OtherGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherGeocodeAccuracy: string;
    @sField({ apiName: 'OtherAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    OtherAddress: string;
    @sField({ apiName: 'MailingStreet', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingStreet: string;
    @sField({ apiName: 'MailingCity', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingCity: string;
    @sField({ apiName: 'MailingState', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingState: string;
    @sField({ apiName: 'MailingPostalCode', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingPostalCode: string;
    @sField({ apiName: 'MailingCountry', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingCountry: string;
    @sField({ apiName: 'MailingLatitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingLatitude: number;
    @sField({ apiName: 'MailingLongitude', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingLongitude: number;
    @sField({ apiName: 'MailingGeocodeAccuracy', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MailingGeocodeAccuracy: string;
    @sField({ apiName: 'MailingAddress', readOnly: true, required: false, reference: undefined, childRelationship: false })
    MailingAddress: string;
    @sField({ apiName: 'Phone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Phone: string;
    @sField({ apiName: 'Fax', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Fax: string;
    @sField({ apiName: 'MobilePhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    MobilePhone: string;
    @sField({ apiName: 'HomePhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    HomePhone: string;
    @sField({ apiName: 'OtherPhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    OtherPhone: string;
    @sField({ apiName: 'AssistantPhone', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AssistantPhone: string;
    @sField({ apiName: 'ReportsTo', readOnly: true, required: false, reference: () => { return Contact; }, childRelationship: false })
    ReportsTo: Contact;
    @sField({ apiName: 'ReportsToId', readOnly: false, required: false, reference: undefined, childRelationship: false })
    ReportsToId: string;
    @sField({ apiName: 'Email', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Email: string;
    @sField({ apiName: 'Title', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Title: string;
    @sField({ apiName: 'Department', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Department: string;
    @sField({ apiName: 'AssistantName', readOnly: false, required: false, reference: undefined, childRelationship: false })
    AssistantName: string;
    @sField({ apiName: 'LeadSource', readOnly: false, required: false, reference: undefined, childRelationship: false })
    LeadSource: string;
    @sField({ apiName: 'Birthdate', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Birthdate: string;
    @sField({ apiName: 'Description', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Description: string;
    @sField({ apiName: 'OwnerId', readOnly: false, required: true, reference: undefined, childRelationship: false })
    OwnerId: string;
    @sField({ apiName: 'CreatedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    CreatedDate: string;
    @sField({ apiName: 'CreatedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    CreatedById: string;
    @sField({ apiName: 'LastModifiedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastModifiedDate: string;
    @sField({ apiName: 'LastModifiedById', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', readOnly: true, required: false, reference: undefined, childRelationship: false })
    SystemModstamp: string;
    @sField({ apiName: 'LastActivityDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastActivityDate: string;
    @sField({ apiName: 'LastCURequestDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastCURequestDate: string;
    @sField({ apiName: 'LastCUUpdateDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastCUUpdateDate: string;
    @sField({ apiName: 'LastViewedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastViewedDate: string;
    @sField({ apiName: 'LastReferencedDate', readOnly: true, required: false, reference: undefined, childRelationship: false })
    LastReferencedDate: string;
    @sField({ apiName: 'EmailBouncedReason', readOnly: false, required: false, reference: undefined, childRelationship: false })
    EmailBouncedReason: string;
    @sField({ apiName: 'EmailBouncedDate', readOnly: false, required: false, reference: undefined, childRelationship: false })
    EmailBouncedDate: string;
    @sField({ apiName: 'IsEmailBounced', readOnly: true, required: false, reference: undefined, childRelationship: false })
    IsEmailBounced: string;
    @sField({ apiName: 'PhotoUrl', readOnly: true, required: false, reference: undefined, childRelationship: false })
    PhotoUrl: string;
    @sField({ apiName: 'Jigsaw', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Jigsaw: string;
    @sField({ apiName: 'JigsawContactId', readOnly: true, required: false, reference: undefined, childRelationship: false })
    JigsawContactId: string;
    @sField({ apiName: 'CleanStatus', readOnly: false, required: false, reference: undefined, childRelationship: false })
    CleanStatus: string;
    @sField({ apiName: 'Level__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Level__c: string;
    @sField({ apiName: 'Languages__c', readOnly: false, required: false, reference: undefined, childRelationship: false })
    Languages__c: string;
    constructor() {
        super('Contact');
    }
    static async retrieve(qry: string): Promise<Contact[]> {
        return await RestObject.query<Contact>(Contact, qry);
    }
}
