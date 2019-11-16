import { Rest, RestObject, SObject, sField, SalesforceFieldType, SFLocation, SFieldProperties, FieldResolver, SOQLQueryParams, buildQuery, FieldProps, PicklistConst, CalendarDate } from '../..';

export type AccountFields = Partial<FieldProps<Account>>;

/**
 * Generated class for Account
 */
export class Account extends RestObject {
    @sField({ apiName: 'Contacts', createable: false, updateable: false, required: false, reference: () => { return Contact }, childRelationship: true, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Contacts', externalId: false })
    public contacts: Contact[];
    @sField({ apiName: 'Users', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: true, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Users', externalId: false })
    public users: User[];
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Account ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'IsDeleted', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Deleted', externalId: false })
    public readonly isDeleted: boolean;
    @sField({ apiName: 'MasterRecord', createable: false, updateable: false, required: false, reference: () => { return Account }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Master Record ID', externalId: false })
    public masterRecord: Account;
    @sField({ apiName: 'MasterRecordId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Master Record ID', externalId: false })
    public readonly masterRecordId: string;
    @sField({ apiName: 'Name', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Account Name', externalId: false })
    public name: string;
    @sField({ apiName: 'Type', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Account Type', externalId: false })
    public type: string;
    @sField({ apiName: 'Parent', createable: false, updateable: false, required: false, reference: () => { return Account }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Parent Account ID', externalId: false })
    public parent: Account;
    @sField({ apiName: 'ParentId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Parent Account ID', externalId: false })
    public parentId: string;
    @sField({ apiName: 'BillingStreet', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Billing Street', externalId: false })
    public billingStreet: string;
    @sField({ apiName: 'BillingCity', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Billing City', externalId: false })
    public billingCity: string;
    @sField({ apiName: 'BillingState', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Billing State/Province', externalId: false })
    public billingState: string;
    @sField({ apiName: 'BillingPostalCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Billing Zip/Postal Code', externalId: false })
    public billingPostalCode: string;
    @sField({ apiName: 'BillingCountry', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Billing Country', externalId: false })
    public billingCountry: string;
    @sField({ apiName: 'BillingLatitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Billing Latitude', externalId: false })
    public billingLatitude: number;
    @sField({ apiName: 'BillingLongitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Billing Longitude', externalId: false })
    public billingLongitude: number;
    @sField({ apiName: 'BillingGeocodeAccuracy', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Billing Geocode Accuracy', externalId: false })
    public billingGeocodeAccuracy: PicklistConst<typeof Account.PICKLIST.billingGeocodeAccuracy>;
    @sField({ apiName: 'BillingAddress', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ADDRESS, salesforceLabel: 'Billing Address', externalId: false })
    public readonly billingAddress: string;
    @sField({ apiName: 'ShippingStreet', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Shipping Street', externalId: false })
    public shippingStreet: string;
    @sField({ apiName: 'ShippingCity', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Shipping City', externalId: false })
    public shippingCity: string;
    @sField({ apiName: 'ShippingState', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Shipping State/Province', externalId: false })
    public shippingState: string;
    @sField({ apiName: 'ShippingPostalCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Shipping Zip/Postal Code', externalId: false })
    public shippingPostalCode: string;
    @sField({ apiName: 'ShippingCountry', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Shipping Country', externalId: false })
    public shippingCountry: string;
    @sField({ apiName: 'ShippingLatitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Shipping Latitude', externalId: false })
    public shippingLatitude: number;
    @sField({ apiName: 'ShippingLongitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Shipping Longitude', externalId: false })
    public shippingLongitude: number;
    @sField({ apiName: 'ShippingGeocodeAccuracy', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Shipping Geocode Accuracy', externalId: false })
    public shippingGeocodeAccuracy: PicklistConst<typeof Account.PICKLIST.shippingGeocodeAccuracy>;
    @sField({ apiName: 'ShippingAddress', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ADDRESS, salesforceLabel: 'Shipping Address', externalId: false })
    public readonly shippingAddress: string;
    @sField({ apiName: 'Phone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Account Phone', externalId: false })
    public phone: string;
    @sField({ apiName: 'Fax', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Account Fax', externalId: false })
    public fax: string;
    @sField({ apiName: 'AccountNumber', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Account Number', externalId: false })
    public accountNumber: string;
    @sField({ apiName: 'Website', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Website', externalId: false })
    public website: string;
    @sField({ apiName: 'PhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Photo URL', externalId: false })
    public readonly photoUrl: string;
    @sField({ apiName: 'Sic', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'SIC Code', externalId: false })
    public sic: string;
    @sField({ apiName: 'Industry', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Industry', externalId: false })
    public industry: string;
    @sField({ apiName: 'AnnualRevenue', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.CURRENCY, salesforceLabel: 'Annual Revenue', externalId: false })
    public annualRevenue: number;
    @sField({ apiName: 'NumberOfEmployees', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.INT, salesforceLabel: 'Employees', externalId: false })
    public numberOfEmployees: number;
    @sField({ apiName: 'Ownership', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Ownership', externalId: false })
    public ownership: string;
    @sField({ apiName: 'TickerSymbol', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Ticker Symbol', externalId: false })
    public tickerSymbol: string;
    @sField({ apiName: 'Description', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Account Description', externalId: false })
    public description: string;
    @sField({ apiName: 'Rating', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Account Rating', externalId: false })
    public rating: string;
    @sField({ apiName: 'Site', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Account Site', externalId: false })
    public site: string;
    @sField({ apiName: 'Owner', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Owner ID', externalId: false })
    public owner: User;
    @sField({ apiName: 'OwnerId', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Owner ID', externalId: false })
    public ownerId: string;
    @sField({ apiName: 'CreatedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Created Date', externalId: false })
    public readonly createdDate: Date;
    @sField({ apiName: 'CreatedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public createdBy: User;
    @sField({ apiName: 'CreatedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public readonly createdById: string;
    @sField({ apiName: 'LastModifiedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Modified Date', externalId: false })
    public readonly lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public lastModifiedBy: User;
    @sField({ apiName: 'LastModifiedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public readonly lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'System Modstamp', externalId: false })
    public readonly systemModstamp: Date;
    @sField({ apiName: 'LastActivityDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATE, salesforceLabel: 'Last Activity', externalId: false })
    public readonly lastActivityDate: CalendarDate;
    @sField({ apiName: 'LastViewedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Viewed Date', externalId: false })
    public readonly lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Referenced Date', externalId: false })
    public readonly lastReferencedDate: Date;
    @sField({ apiName: 'Jigsaw', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Data.com Key', externalId: false })
    public jigsaw: string;
    @sField({ apiName: 'JigsawCompanyId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Jigsaw Company ID', externalId: false })
    public readonly jigsawCompanyId: string;
    @sField({ apiName: 'CleanStatus', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Clean Status', externalId: false })
    public cleanStatus: PicklistConst<typeof Account.PICKLIST.cleanStatus>;
    @sField({ apiName: 'AccountSource', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Account Source', externalId: false })
    public accountSource: string;
    @sField({ apiName: 'DunsNumber', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'D-U-N-S Number', externalId: false })
    public dunsNumber: string;
    @sField({ apiName: 'Tradestyle', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Tradestyle', externalId: false })
    public tradestyle: string;
    @sField({ apiName: 'NaicsCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'NAICS Code', externalId: false })
    public naicsCode: string;
    @sField({ apiName: 'NaicsDesc', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'NAICS Description', externalId: false })
    public naicsDesc: string;
    @sField({ apiName: 'YearStarted', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Year Started', externalId: false })
    public yearStarted: string;
    @sField({ apiName: 'SicDesc', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'SIC Description', externalId: false })
    public sicDesc: string;
    @sField({ apiName: 'DandbCompanyId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'D&B Company ID', externalId: false })
    public dandbCompanyId: string;
    @sField({ apiName: 'CustomerPriority__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Customer Priority', externalId: false })
    public customerPriority: PicklistConst<typeof Account.PICKLIST.customerPriority>;
    @sField({ apiName: 'SLA__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'SLA', externalId: false })
    public sLA: string;
    @sField({ apiName: 'Active__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Active', externalId: false })
    public active: string;
    @sField({ apiName: 'NumberofLocations__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Number of Locations', externalId: false })
    public numberofLocations: number;
    @sField({ apiName: 'UpsellOpportunity__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Upsell Opportunity', externalId: false })
    public upsellOpportunity: string;
    @sField({ apiName: 'SLASerialNumber__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'SLA Serial Number', externalId: false })
    public sLASerialNumber: string;
    @sField({ apiName: 'SLAExpirationDate__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATE, salesforceLabel: 'SLA Expiration Date', externalId: false })
    public sLAExpirationDate: CalendarDate;
    @sField({ apiName: 'Test_External_Id__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Test External Id', externalId: true })
    public testExternalId: string;
    @sField({ apiName: 'MultiPick__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.MULTIPICKLIST, salesforceLabel: 'MultiPick', externalId: false })
    public multiPick: PicklistConst<typeof Account.PICKLIST.multiPick>[];

    constructor(fields?: AccountFields, restInstance?: Rest) {
        super('Account', restInstance);
        this.contacts = void 0;
        this.users = void 0;
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
        this.owner = void 0;
        this.ownerId = void 0;
        this.createdDate = void 0;
        this.createdBy = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedBy = void 0;
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
        this.customerPriority = void 0;
        this.sLA = void 0;
        this.active = void 0;
        this.numberofLocations = void 0;
        this.upsellOpportunity = void 0;
        this.sLASerialNumber = void 0;
        this.sLAExpirationDate = void 0;
        this.testExternalId = void 0;
        this.multiPick = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'Account' = 'Account';
    public readonly _TYPE_: 'Account' = 'Account';
    private static _fields: { [P in keyof FieldProps<Account>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : Account.getPropertiesMeta<FieldProps<Account>, Account>(Account)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<Account>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<Account[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(Account, qryParam) : qryParam;
        return await RestObject.query<Account>(Account, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): Account {
        return new Account().mapFromQuery(sob);
    }

    public static readonly PICKLIST = {
        type: {
            PROSPECT: "Prospect",
            CUSTOMER__DIRECT: "Customer - Direct",
            CUSTOMER__CHANNEL: "Customer - Channel",
            CHANNEL_PARTNER__RESELLER: "Channel Partner / Reseller",
            INSTALLATION_PARTNER: "Installation Partner",
            TECHNOLOGY_PARTNER: "Technology Partner",
            OTHER: "Other"
        },
        billingGeocodeAccuracy: {
            ADDRESS: "Address",
            NEARADDRESS: "NearAddress",
            BLOCK: "Block",
            STREET: "Street",
            EXTENDEDZIP: "ExtendedZip",
            ZIP: "Zip",
            NEIGHBORHOOD: "Neighborhood",
            CITY: "City",
            COUNTY: "County",
            STATE: "State",
            UNKNOWN: "Unknown"
        },
        shippingGeocodeAccuracy: {
            ADDRESS: "Address",
            NEARADDRESS: "NearAddress",
            BLOCK: "Block",
            STREET: "Street",
            EXTENDEDZIP: "ExtendedZip",
            ZIP: "Zip",
            NEIGHBORHOOD: "Neighborhood",
            CITY: "City",
            COUNTY: "County",
            STATE: "State",
            UNKNOWN: "Unknown"
        },
        industry: {
            AGRICULTURE: "Agriculture",
            APPAREL: "Apparel",
            BANKING: "Banking",
            BIOTECHNOLOGY: "Biotechnology",
            CHEMICALS: "Chemicals",
            COMMUNICATIONS: "Communications",
            CONSTRUCTION: "Construction",
            CONSULTING: "Consulting",
            EDUCATION: "Education",
            ELECTRONICS: "Electronics",
            ENERGY: "Energy",
            ENGINEERING: "Engineering",
            ENTERTAINMENT: "Entertainment",
            ENVIRONMENTAL: "Environmental",
            FINANCE: "Finance",
            FOOD__BEVERAGE: "Food & Beverage",
            GOVERNMENT: "Government",
            HEALTHCARE: "Healthcare",
            HOSPITALITY: "Hospitality",
            INSURANCE: "Insurance",
            MACHINERY: "Machinery",
            MANUFACTURING: "Manufacturing",
            MEDIA: "Media",
            NOT_FOR_PROFIT: "Not For Profit",
            RECREATION: "Recreation",
            RETAIL: "Retail",
            SHIPPING: "Shipping",
            TECHNOLOGY: "Technology",
            TELECOMMUNICATIONS: "Telecommunications",
            TRANSPORTATION: "Transportation",
            UTILITIES: "Utilities",
            OTHER: "Other"
        },
        ownership: {
            PUBLIC: "Public",
            PRIVATE: "Private",
            SUBSIDIARY: "Subsidiary",
            OTHER: "Other"
        },
        rating: {
            HOT: "Hot",
            WARM: "Warm",
            COLD: "Cold"
        },
        cleanStatus: {
            MATCHED: "Matched",
            DIFFERENT: "Different",
            ACKNOWLEDGED: "Acknowledged",
            NOTFOUND: "NotFound",
            INACTIVE: "Inactive",
            PENDING: "Pending",
            SELECTMATCH: "SelectMatch",
            SKIPPED: "Skipped"
        },
        accountSource: {
            WEB: "Web",
            PHONE_INQUIRY: "Phone Inquiry",
            PARTNER_REFERRAL: "Partner Referral",
            PURCHASED_LIST: "Purchased List",
            OTHER: "Other"
        },
        customerPriority: {
            HIGH: "High",
            LOW: "Low",
            MEDIUM: "Medium"
        },
        sLA: {
            GOLD: "Gold",
            SILVER: "Silver",
            PLATINUM: "Platinum",
            BRONZE: "Bronze"
        },
        active: {
            NO: "No",
            YES: "Yes"
        },
        upsellOpportunity: {
            MAYBE: "Maybe",
            NO: "No",
            YES: "Yes"
        },
        multiPick: {
            ONE: "one",
            THREE: "three",
            TWO: "two"
        }
    } as const;
}

export type ContactFields = Partial<FieldProps<Contact>>;

/**
 * Generated class for Contact
 */
export class Contact extends RestObject {
    @sField({ apiName: 'Users', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: true, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Users', externalId: false })
    public users: User[];
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Contact ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'IsDeleted', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Deleted', externalId: false })
    public readonly isDeleted: boolean;
    @sField({ apiName: 'MasterRecord', createable: false, updateable: false, required: false, reference: () => { return Contact }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Master Record ID', externalId: false })
    public masterRecord: Contact;
    @sField({ apiName: 'MasterRecordId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Master Record ID', externalId: false })
    public readonly masterRecordId: string;
    @sField({ apiName: 'Account', createable: false, updateable: false, required: false, reference: () => { return Account }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Account ID', externalId: false })
    public account: Account;
    @sField({ apiName: 'AccountId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Account ID', externalId: false })
    public accountId: string;
    @sField({ apiName: 'LastName', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Last Name', externalId: false })
    public lastName: string;
    @sField({ apiName: 'FirstName', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'First Name', externalId: false })
    public firstName: string;
    @sField({ apiName: 'Salutation', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Salutation', externalId: false })
    public salutation: PicklistConst<typeof Contact.PICKLIST.salutation>;
    @sField({ apiName: 'Name', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Full Name', externalId: false })
    public readonly name: string;
    @sField({ apiName: 'OtherStreet', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Other Street', externalId: false })
    public otherStreet: string;
    @sField({ apiName: 'OtherCity', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Other City', externalId: false })
    public otherCity: string;
    @sField({ apiName: 'OtherState', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Other State/Province', externalId: false })
    public otherState: string;
    @sField({ apiName: 'OtherPostalCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Other Zip/Postal Code', externalId: false })
    public otherPostalCode: string;
    @sField({ apiName: 'OtherCountry', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Other Country', externalId: false })
    public otherCountry: string;
    @sField({ apiName: 'OtherLatitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Other Latitude', externalId: false })
    public otherLatitude: number;
    @sField({ apiName: 'OtherLongitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Other Longitude', externalId: false })
    public otherLongitude: number;
    @sField({ apiName: 'OtherGeocodeAccuracy', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Other Geocode Accuracy', externalId: false })
    public otherGeocodeAccuracy: PicklistConst<typeof Contact.PICKLIST.otherGeocodeAccuracy>;
    @sField({ apiName: 'OtherAddress', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ADDRESS, salesforceLabel: 'Other Address', externalId: false })
    public readonly otherAddress: string;
    @sField({ apiName: 'MailingStreet', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Mailing Street', externalId: false })
    public mailingStreet: string;
    @sField({ apiName: 'MailingCity', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Mailing City', externalId: false })
    public mailingCity: string;
    @sField({ apiName: 'MailingState', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Mailing State/Province', externalId: false })
    public mailingState: string;
    @sField({ apiName: 'MailingPostalCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Mailing Zip/Postal Code', externalId: false })
    public mailingPostalCode: string;
    @sField({ apiName: 'MailingCountry', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Mailing Country', externalId: false })
    public mailingCountry: string;
    @sField({ apiName: 'MailingLatitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Mailing Latitude', externalId: false })
    public mailingLatitude: number;
    @sField({ apiName: 'MailingLongitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Mailing Longitude', externalId: false })
    public mailingLongitude: number;
    @sField({ apiName: 'MailingGeocodeAccuracy', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Mailing Geocode Accuracy', externalId: false })
    public mailingGeocodeAccuracy: PicklistConst<typeof Contact.PICKLIST.mailingGeocodeAccuracy>;
    @sField({ apiName: 'MailingAddress', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ADDRESS, salesforceLabel: 'Mailing Address', externalId: false })
    public readonly mailingAddress: string;
    @sField({ apiName: 'Phone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Business Phone', externalId: false })
    public phone: string;
    @sField({ apiName: 'Fax', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Business Fax', externalId: false })
    public fax: string;
    @sField({ apiName: 'MobilePhone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Mobile Phone', externalId: false })
    public mobilePhone: string;
    @sField({ apiName: 'HomePhone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Home Phone', externalId: false })
    public homePhone: string;
    @sField({ apiName: 'OtherPhone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Other Phone', externalId: false })
    public otherPhone: string;
    @sField({ apiName: 'AssistantPhone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Asst. Phone', externalId: false })
    public assistantPhone: string;
    @sField({ apiName: 'ReportsTo', createable: false, updateable: false, required: false, reference: () => { return Contact }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Reports To ID', externalId: false })
    public reportsTo: Contact;
    @sField({ apiName: 'ReportsToId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Reports To ID', externalId: false })
    public reportsToId: string;
    @sField({ apiName: 'Email', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.EMAIL, salesforceLabel: 'Email', externalId: false })
    public email: string;
    @sField({ apiName: 'Title', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Title', externalId: false })
    public title: string;
    @sField({ apiName: 'Department', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Department', externalId: false })
    public department: string;
    @sField({ apiName: 'AssistantName', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Assistant\'s Name', externalId: false })
    public assistantName: string;
    @sField({ apiName: 'LeadSource', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Lead Source', externalId: false })
    public leadSource: PicklistConst<typeof Contact.PICKLIST.leadSource>;
    @sField({ apiName: 'Birthdate', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATE, salesforceLabel: 'Birthdate', externalId: false })
    public birthdate: CalendarDate;
    @sField({ apiName: 'Description', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Contact Description', externalId: false })
    public description: string;
    @sField({ apiName: 'Owner', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Owner ID', externalId: false })
    public owner: User;
    @sField({ apiName: 'OwnerId', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Owner ID', externalId: false })
    public ownerId: string;
    @sField({ apiName: 'CreatedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Created Date', externalId: false })
    public readonly createdDate: Date;
    @sField({ apiName: 'CreatedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public createdBy: User;
    @sField({ apiName: 'CreatedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public readonly createdById: string;
    @sField({ apiName: 'LastModifiedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Modified Date', externalId: false })
    public readonly lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public lastModifiedBy: User;
    @sField({ apiName: 'LastModifiedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public readonly lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'System Modstamp', externalId: false })
    public readonly systemModstamp: Date;
    @sField({ apiName: 'LastActivityDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATE, salesforceLabel: 'Last Activity', externalId: false })
    public readonly lastActivityDate: CalendarDate;
    @sField({ apiName: 'LastCURequestDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Stay-in-Touch Request Date', externalId: false })
    public readonly lastCURequestDate: Date;
    @sField({ apiName: 'LastCUUpdateDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Stay-in-Touch Save Date', externalId: false })
    public readonly lastCUUpdateDate: Date;
    @sField({ apiName: 'LastViewedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Viewed Date', externalId: false })
    public readonly lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Referenced Date', externalId: false })
    public readonly lastReferencedDate: Date;
    @sField({ apiName: 'EmailBouncedReason', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Email Bounced Reason', externalId: false })
    public emailBouncedReason: string;
    @sField({ apiName: 'EmailBouncedDate', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Email Bounced Date', externalId: false })
    public emailBouncedDate: Date;
    @sField({ apiName: 'IsEmailBounced', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Is Email Bounced', externalId: false })
    public readonly isEmailBounced: boolean;
    @sField({ apiName: 'PhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Photo URL', externalId: false })
    public readonly photoUrl: string;
    @sField({ apiName: 'Jigsaw', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Data.com Key', externalId: false })
    public jigsaw: string;
    @sField({ apiName: 'JigsawContactId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Jigsaw Contact ID', externalId: false })
    public readonly jigsawContactId: string;
    @sField({ apiName: 'CleanStatus', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Clean Status', externalId: false })
    public cleanStatus: PicklistConst<typeof Contact.PICKLIST.cleanStatus>;
    @sField({ apiName: 'IndividualId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Individual ID', externalId: false })
    public individualId: string;
    @sField({ apiName: 'Level__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Level', externalId: false })
    public level: PicklistConst<typeof Contact.PICKLIST.level>;
    @sField({ apiName: 'Languages__c', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Languages', externalId: false })
    public languages: string;

    constructor(fields?: ContactFields, restInstance?: Rest) {
        super('Contact', restInstance);
        this.users = void 0;
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
        this.owner = void 0;
        this.ownerId = void 0;
        this.createdDate = void 0;
        this.createdBy = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedBy = void 0;
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
        this.individualId = void 0;
        this.level = void 0;
        this.languages = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'Contact' = 'Contact';
    public readonly _TYPE_: 'Contact' = 'Contact';
    private static _fields: { [P in keyof FieldProps<Contact>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : Contact.getPropertiesMeta<FieldProps<Contact>, Contact>(Contact)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<Contact>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<Contact[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(Contact, qryParam) : qryParam;
        return await RestObject.query<Contact>(Contact, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): Contact {
        return new Contact().mapFromQuery(sob);
    }

    public static readonly PICKLIST = {
        salutation: {
            MR: "Mr.",
            MS: "Ms.",
            MRS: "Mrs.",
            DR: "Dr.",
            PROF: "Prof."
        },
        otherGeocodeAccuracy: {
            ADDRESS: "Address",
            NEARADDRESS: "NearAddress",
            BLOCK: "Block",
            STREET: "Street",
            EXTENDEDZIP: "ExtendedZip",
            ZIP: "Zip",
            NEIGHBORHOOD: "Neighborhood",
            CITY: "City",
            COUNTY: "County",
            STATE: "State",
            UNKNOWN: "Unknown"
        },
        mailingGeocodeAccuracy: {
            ADDRESS: "Address",
            NEARADDRESS: "NearAddress",
            BLOCK: "Block",
            STREET: "Street",
            EXTENDEDZIP: "ExtendedZip",
            ZIP: "Zip",
            NEIGHBORHOOD: "Neighborhood",
            CITY: "City",
            COUNTY: "County",
            STATE: "State",
            UNKNOWN: "Unknown"
        },
        leadSource: {
            WEB: "Web",
            PHONE_INQUIRY: "Phone Inquiry",
            PARTNER_REFERRAL: "Partner Referral",
            PURCHASED_LIST: "Purchased List",
            OTHER: "Other"
        },
        cleanStatus: {
            MATCHED: "Matched",
            DIFFERENT: "Different",
            ACKNOWLEDGED: "Acknowledged",
            NOTFOUND: "NotFound",
            INACTIVE: "Inactive",
            PENDING: "Pending",
            SELECTMATCH: "SelectMatch",
            SKIPPED: "Skipped"
        },
        level: {
            SECONDARY: "Secondary",
            TERTIARY: "Tertiary",
            PRIMARY: "Primary"
        }
    } as const;
}

export type UserFields = Partial<FieldProps<User>>;

/**
 * Generated class for User
 */
export class User extends RestObject {
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'User ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'Username', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Username', externalId: false })
    public username: string;
    @sField({ apiName: 'LastName', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Last Name', externalId: false })
    public lastName: string;
    @sField({ apiName: 'FirstName', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'First Name', externalId: false })
    public firstName: string;
    @sField({ apiName: 'Name', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Full Name', externalId: false })
    public readonly name: string;
    @sField({ apiName: 'CompanyName', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Company Name', externalId: false })
    public companyName: string;
    @sField({ apiName: 'Division', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Division', externalId: false })
    public division: string;
    @sField({ apiName: 'Department', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Department', externalId: false })
    public department: string;
    @sField({ apiName: 'Title', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Title', externalId: false })
    public title: string;
    @sField({ apiName: 'Street', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Street', externalId: false })
    public street: string;
    @sField({ apiName: 'City', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'City', externalId: false })
    public city: string;
    @sField({ apiName: 'State', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'State/Province', externalId: false })
    public state: string;
    @sField({ apiName: 'PostalCode', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Zip/Postal Code', externalId: false })
    public postalCode: string;
    @sField({ apiName: 'Country', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Country', externalId: false })
    public country: string;
    @sField({ apiName: 'Latitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Latitude', externalId: false })
    public latitude: number;
    @sField({ apiName: 'Longitude', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Longitude', externalId: false })
    public longitude: number;
    @sField({ apiName: 'GeocodeAccuracy', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Geocode Accuracy', externalId: false })
    public geocodeAccuracy: PicklistConst<typeof User.PICKLIST.geocodeAccuracy>;
    @sField({ apiName: 'Address', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ADDRESS, salesforceLabel: 'Address', externalId: false })
    public readonly address: string;
    @sField({ apiName: 'Email', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.EMAIL, salesforceLabel: 'Email', externalId: false })
    public email: string;
    @sField({ apiName: 'EmailPreferencesAutoBcc', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'AutoBcc', externalId: false })
    public emailPreferencesAutoBcc: boolean;
    @sField({ apiName: 'EmailPreferencesAutoBccStayInTouch', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'AutoBccStayInTouch', externalId: false })
    public emailPreferencesAutoBccStayInTouch: boolean;
    @sField({ apiName: 'EmailPreferencesStayInTouchReminder', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'StayInTouchReminder', externalId: false })
    public emailPreferencesStayInTouchReminder: boolean;
    @sField({ apiName: 'SenderEmail', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.EMAIL, salesforceLabel: 'Email Sender Address', externalId: false })
    public senderEmail: string;
    @sField({ apiName: 'SenderName', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Email Sender Name', externalId: false })
    public senderName: string;
    @sField({ apiName: 'Signature', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Email Signature', externalId: false })
    public signature: string;
    @sField({ apiName: 'StayInTouchSubject', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Stay-in-Touch Email Subject', externalId: false })
    public stayInTouchSubject: string;
    @sField({ apiName: 'StayInTouchSignature', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Stay-in-Touch Email Signature', externalId: false })
    public stayInTouchSignature: string;
    @sField({ apiName: 'StayInTouchNote', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Stay-in-Touch Email Note', externalId: false })
    public stayInTouchNote: string;
    @sField({ apiName: 'Phone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Phone', externalId: false })
    public phone: string;
    @sField({ apiName: 'Fax', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Fax', externalId: false })
    public fax: string;
    @sField({ apiName: 'MobilePhone', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Mobile', externalId: false })
    public mobilePhone: string;
    @sField({ apiName: 'Alias', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Alias', externalId: false })
    public alias: string;
    @sField({ apiName: 'CommunityNickname', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Nickname', externalId: false })
    public communityNickname: string;
    @sField({ apiName: 'BadgeText', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'User Photo badge text overlay', externalId: false })
    public readonly badgeText: string;
    @sField({ apiName: 'IsActive', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Active', externalId: false })
    public isActive: boolean;
    @sField({ apiName: 'TimeZoneSidKey', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Time Zone', externalId: false })
    public timeZoneSidKey: PicklistConst<typeof User.PICKLIST.timeZoneSidKey>;
    @sField({ apiName: 'UserRoleId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Role ID', externalId: false })
    public userRoleId: string;
    @sField({ apiName: 'LocaleSidKey', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Locale', externalId: false })
    public localeSidKey: PicklistConst<typeof User.PICKLIST.localeSidKey>;
    @sField({ apiName: 'ReceivesInfoEmails', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Info Emails', externalId: false })
    public receivesInfoEmails: boolean;
    @sField({ apiName: 'ReceivesAdminInfoEmails', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Admin Info Emails', externalId: false })
    public receivesAdminInfoEmails: boolean;
    @sField({ apiName: 'EmailEncodingKey', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Email Encoding', externalId: false })
    public emailEncodingKey: PicklistConst<typeof User.PICKLIST.emailEncodingKey>;
    @sField({ apiName: 'ProfileId', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Profile ID', externalId: false })
    public profileId: string;
    @sField({ apiName: 'UserType', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'User Type', externalId: false })
    public readonly userType: PicklistConst<typeof User.PICKLIST.userType>;
    @sField({ apiName: 'LanguageLocaleKey', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Language', externalId: false })
    public languageLocaleKey: PicklistConst<typeof User.PICKLIST.languageLocaleKey>;
    @sField({ apiName: 'EmployeeNumber', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Employee Number', externalId: false })
    public employeeNumber: string;
    @sField({ apiName: 'DelegatedApproverId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Delegated Approver ID', externalId: false })
    public delegatedApproverId: string;
    @sField({ apiName: 'Manager', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Manager ID', externalId: false })
    public manager: User;
    @sField({ apiName: 'ManagerId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Manager ID', externalId: false })
    public managerId: string;
    @sField({ apiName: 'LastLoginDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Login', externalId: false })
    public readonly lastLoginDate: Date;
    @sField({ apiName: 'LastPasswordChangeDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Password Change or Reset', externalId: false })
    public readonly lastPasswordChangeDate: Date;
    @sField({ apiName: 'CreatedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Created Date', externalId: false })
    public readonly createdDate: Date;
    @sField({ apiName: 'CreatedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public createdBy: User;
    @sField({ apiName: 'CreatedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public readonly createdById: string;
    @sField({ apiName: 'LastModifiedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Modified Date', externalId: false })
    public readonly lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public lastModifiedBy: User;
    @sField({ apiName: 'LastModifiedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public readonly lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'System Modstamp', externalId: false })
    public readonly systemModstamp: Date;
    @sField({ apiName: 'OfflineTrialExpirationDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Offline Edition Trial Expiration Date', externalId: false })
    public readonly offlineTrialExpirationDate: Date;
    @sField({ apiName: 'OfflinePdaTrialExpirationDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Sales Anywhere Trial Expiration Date', externalId: false })
    public readonly offlinePdaTrialExpirationDate: Date;
    @sField({ apiName: 'UserPermissionsMarketingUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Marketing User', externalId: false })
    public userPermissionsMarketingUser: boolean;
    @sField({ apiName: 'UserPermissionsOfflineUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Offline User', externalId: false })
    public userPermissionsOfflineUser: boolean;
    @sField({ apiName: 'UserPermissionsCallCenterAutoLogin', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Auto-login To Call Center', externalId: false })
    public userPermissionsCallCenterAutoLogin: boolean;
    @sField({ apiName: 'UserPermissionsMobileUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Apex Mobile User', externalId: false })
    public userPermissionsMobileUser: boolean;
    @sField({ apiName: 'UserPermissionsSFContentUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Salesforce CRM Content User', externalId: false })
    public userPermissionsSFContentUser: boolean;
    @sField({ apiName: 'UserPermissionsKnowledgeUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Knowledge User', externalId: false })
    public userPermissionsKnowledgeUser: boolean;
    @sField({ apiName: 'UserPermissionsInteractionUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Flow User', externalId: false })
    public userPermissionsInteractionUser: boolean;
    @sField({ apiName: 'UserPermissionsSupportUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Service Cloud User', externalId: false })
    public userPermissionsSupportUser: boolean;
    @sField({ apiName: 'UserPermissionsJigsawProspectingUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Data.com User', externalId: false })
    public userPermissionsJigsawProspectingUser: boolean;
    @sField({ apiName: 'UserPermissionsSiteforceContributorUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Site.com Contributor User', externalId: false })
    public userPermissionsSiteforceContributorUser: boolean;
    @sField({ apiName: 'UserPermissionsSiteforcePublisherUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Site.com Publisher User', externalId: false })
    public userPermissionsSiteforcePublisherUser: boolean;
    @sField({ apiName: 'UserPermissionsWorkDotComUserFeature', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Work.com User', externalId: false })
    public userPermissionsWorkDotComUserFeature: boolean;
    @sField({ apiName: 'ForecastEnabled', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Allow Forecasting', externalId: false })
    public forecastEnabled: boolean;
    @sField({ apiName: 'UserPreferencesActivityRemindersPopup', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ActivityRemindersPopup', externalId: false })
    public userPreferencesActivityRemindersPopup: boolean;
    @sField({ apiName: 'UserPreferencesEventRemindersCheckboxDefault', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'EventRemindersCheckboxDefault', externalId: false })
    public userPreferencesEventRemindersCheckboxDefault: boolean;
    @sField({ apiName: 'UserPreferencesTaskRemindersCheckboxDefault', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'TaskRemindersCheckboxDefault', externalId: false })
    public userPreferencesTaskRemindersCheckboxDefault: boolean;
    @sField({ apiName: 'UserPreferencesReminderSoundOff', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ReminderSoundOff', externalId: false })
    public userPreferencesReminderSoundOff: boolean;
    @sField({ apiName: 'UserPreferencesDisableAllFeedsEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableAllFeedsEmail', externalId: false })
    public userPreferencesDisableAllFeedsEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableFollowersEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableFollowersEmail', externalId: false })
    public userPreferencesDisableFollowersEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableProfilePostEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableProfilePostEmail', externalId: false })
    public userPreferencesDisableProfilePostEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableChangeCommentEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableChangeCommentEmail', externalId: false })
    public userPreferencesDisableChangeCommentEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableLaterCommentEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableLaterCommentEmail', externalId: false })
    public userPreferencesDisableLaterCommentEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisProfPostCommentEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisProfPostCommentEmail', externalId: false })
    public userPreferencesDisProfPostCommentEmail: boolean;
    @sField({ apiName: 'UserPreferencesContentNoEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ContentNoEmail', externalId: false })
    public userPreferencesContentNoEmail: boolean;
    @sField({ apiName: 'UserPreferencesContentEmailAsAndWhen', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ContentEmailAsAndWhen', externalId: false })
    public userPreferencesContentEmailAsAndWhen: boolean;
    @sField({ apiName: 'UserPreferencesApexPagesDeveloperMode', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ApexPagesDeveloperMode', externalId: false })
    public userPreferencesApexPagesDeveloperMode: boolean;
    @sField({ apiName: 'UserPreferencesHideCSNGetChatterMobileTask', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideCSNGetChatterMobileTask', externalId: false })
    public userPreferencesHideCSNGetChatterMobileTask: boolean;
    @sField({ apiName: 'UserPreferencesDisableMentionsPostEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableMentionsPostEmail', externalId: false })
    public userPreferencesDisableMentionsPostEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisMentionsCommentEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisMentionsCommentEmail', externalId: false })
    public userPreferencesDisMentionsCommentEmail: boolean;
    @sField({ apiName: 'UserPreferencesHideCSNDesktopTask', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideCSNDesktopTask', externalId: false })
    public userPreferencesHideCSNDesktopTask: boolean;
    @sField({ apiName: 'UserPreferencesHideChatterOnboardingSplash', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideChatterOnboardingSplash', externalId: false })
    public userPreferencesHideChatterOnboardingSplash: boolean;
    @sField({ apiName: 'UserPreferencesHideSecondChatterOnboardingSplash', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideSecondChatterOnboardingSplash', externalId: false })
    public userPreferencesHideSecondChatterOnboardingSplash: boolean;
    @sField({ apiName: 'UserPreferencesDisCommentAfterLikeEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisCommentAfterLikeEmail', externalId: false })
    public userPreferencesDisCommentAfterLikeEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableLikeEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableLikeEmail', externalId: false })
    public userPreferencesDisableLikeEmail: boolean;
    @sField({ apiName: 'UserPreferencesSortFeedByComment', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'SortFeedByComment', externalId: false })
    public userPreferencesSortFeedByComment: boolean;
    @sField({ apiName: 'UserPreferencesDisableMessageEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableMessageEmail', externalId: false })
    public userPreferencesDisableMessageEmail: boolean;
    @sField({ apiName: 'UserPreferencesJigsawListUser', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'JigsawListUser', externalId: false })
    public userPreferencesJigsawListUser: boolean;
    @sField({ apiName: 'UserPreferencesDisableBookmarkEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableBookmarkEmail', externalId: false })
    public userPreferencesDisableBookmarkEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableSharePostEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableSharePostEmail', externalId: false })
    public userPreferencesDisableSharePostEmail: boolean;
    @sField({ apiName: 'UserPreferencesEnableAutoSubForFeeds', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'EnableAutoSubForFeeds', externalId: false })
    public userPreferencesEnableAutoSubForFeeds: boolean;
    @sField({ apiName: 'UserPreferencesDisableFileShareNotificationsForApi', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableFileShareNotificationsForApi', externalId: false })
    public userPreferencesDisableFileShareNotificationsForApi: boolean;
    @sField({ apiName: 'UserPreferencesShowTitleToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowTitleToExternalUsers', externalId: false })
    public userPreferencesShowTitleToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowManagerToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowManagerToExternalUsers', externalId: false })
    public userPreferencesShowManagerToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowEmailToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowEmailToExternalUsers', externalId: false })
    public userPreferencesShowEmailToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowWorkPhoneToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowWorkPhoneToExternalUsers', externalId: false })
    public userPreferencesShowWorkPhoneToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowMobilePhoneToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowMobilePhoneToExternalUsers', externalId: false })
    public userPreferencesShowMobilePhoneToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowFaxToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowFaxToExternalUsers', externalId: false })
    public userPreferencesShowFaxToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowStreetAddressToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowStreetAddressToExternalUsers', externalId: false })
    public userPreferencesShowStreetAddressToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowCityToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowCityToExternalUsers', externalId: false })
    public userPreferencesShowCityToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowStateToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowStateToExternalUsers', externalId: false })
    public userPreferencesShowStateToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowPostalCodeToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowPostalCodeToExternalUsers', externalId: false })
    public userPreferencesShowPostalCodeToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowCountryToExternalUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowCountryToExternalUsers', externalId: false })
    public userPreferencesShowCountryToExternalUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowProfilePicToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowProfilePicToGuestUsers', externalId: false })
    public userPreferencesShowProfilePicToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowTitleToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowTitleToGuestUsers', externalId: false })
    public userPreferencesShowTitleToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowCityToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowCityToGuestUsers', externalId: false })
    public userPreferencesShowCityToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowStateToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowStateToGuestUsers', externalId: false })
    public userPreferencesShowStateToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowPostalCodeToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowPostalCodeToGuestUsers', externalId: false })
    public userPreferencesShowPostalCodeToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowCountryToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowCountryToGuestUsers', externalId: false })
    public userPreferencesShowCountryToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesDisableFeedbackEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableFeedbackEmail', externalId: false })
    public userPreferencesDisableFeedbackEmail: boolean;
    @sField({ apiName: 'UserPreferencesDisableWorkEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableWorkEmail', externalId: false })
    public userPreferencesDisableWorkEmail: boolean;
    @sField({ apiName: 'UserPreferencesPipelineViewHideHelpPopover', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'PipelineViewHideHelpPopover', externalId: false })
    public userPreferencesPipelineViewHideHelpPopover: boolean;
    @sField({ apiName: 'UserPreferencesHideS1BrowserUI', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideS1BrowserUI', externalId: false })
    public userPreferencesHideS1BrowserUI: boolean;
    @sField({ apiName: 'UserPreferencesDisableEndorsementEmail', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'DisableEndorsementEmail', externalId: false })
    public userPreferencesDisableEndorsementEmail: boolean;
    @sField({ apiName: 'UserPreferencesPathAssistantCollapsed', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'PathAssistantCollapsed', externalId: false })
    public userPreferencesPathAssistantCollapsed: boolean;
    @sField({ apiName: 'UserPreferencesCacheDiagnostics', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'CacheDiagnostics', externalId: false })
    public userPreferencesCacheDiagnostics: boolean;
    @sField({ apiName: 'UserPreferencesShowEmailToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowEmailToGuestUsers', externalId: false })
    public userPreferencesShowEmailToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowManagerToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowManagerToGuestUsers', externalId: false })
    public userPreferencesShowManagerToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowWorkPhoneToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowWorkPhoneToGuestUsers', externalId: false })
    public userPreferencesShowWorkPhoneToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowMobilePhoneToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowMobilePhoneToGuestUsers', externalId: false })
    public userPreferencesShowMobilePhoneToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowFaxToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowFaxToGuestUsers', externalId: false })
    public userPreferencesShowFaxToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesShowStreetAddressToGuestUsers', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ShowStreetAddressToGuestUsers', externalId: false })
    public userPreferencesShowStreetAddressToGuestUsers: boolean;
    @sField({ apiName: 'UserPreferencesLightningExperiencePreferred', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'LightningExperiencePreferred', externalId: false })
    public userPreferencesLightningExperiencePreferred: boolean;
    @sField({ apiName: 'UserPreferencesPreviewLightning', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'PreviewLightning', externalId: false })
    public userPreferencesPreviewLightning: boolean;
    @sField({ apiName: 'UserPreferencesHideEndUserOnboardingAssistantModal', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideEndUserOnboardingAssistantModal', externalId: false })
    public userPreferencesHideEndUserOnboardingAssistantModal: boolean;
    @sField({ apiName: 'UserPreferencesHideLightningMigrationModal', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideLightningMigrationModal', externalId: false })
    public userPreferencesHideLightningMigrationModal: boolean;
    @sField({ apiName: 'UserPreferencesHideSfxWelcomeMat', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideSfxWelcomeMat', externalId: false })
    public userPreferencesHideSfxWelcomeMat: boolean;
    @sField({ apiName: 'UserPreferencesHideBiggerPhotoCallout', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HideBiggerPhotoCallout', externalId: false })
    public userPreferencesHideBiggerPhotoCallout: boolean;
    @sField({ apiName: 'UserPreferencesGlobalNavBarWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'GlobalNavBarWTShown', externalId: false })
    public userPreferencesGlobalNavBarWTShown: boolean;
    @sField({ apiName: 'UserPreferencesGlobalNavGridMenuWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'GlobalNavGridMenuWTShown', externalId: false })
    public userPreferencesGlobalNavGridMenuWTShown: boolean;
    @sField({ apiName: 'UserPreferencesCreateLEXAppsWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'CreateLEXAppsWTShown', externalId: false })
    public userPreferencesCreateLEXAppsWTShown: boolean;
    @sField({ apiName: 'UserPreferencesFavoritesWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'FavoritesWTShown', externalId: false })
    public userPreferencesFavoritesWTShown: boolean;
    @sField({ apiName: 'UserPreferencesRecordHomeSectionCollapseWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'RecordHomeSectionCollapseWTShown', externalId: false })
    public userPreferencesRecordHomeSectionCollapseWTShown: boolean;
    @sField({ apiName: 'UserPreferencesRecordHomeReservedWTShown', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'RecordHomeReservedWTShown', externalId: false })
    public userPreferencesRecordHomeReservedWTShown: boolean;
    @sField({ apiName: 'UserPreferencesFavoritesShowTopFavorites', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'FavoritesShowTopFavorites', externalId: false })
    public userPreferencesFavoritesShowTopFavorites: boolean;
    @sField({ apiName: 'UserPreferencesExcludeMailAppAttachments', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'ExcludeMailAppAttachments', externalId: false })
    public userPreferencesExcludeMailAppAttachments: boolean;
    @sField({ apiName: 'UserPreferencesSuppressTaskSFXReminders', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'SuppressTaskSFXReminders', externalId: false })
    public userPreferencesSuppressTaskSFXReminders: boolean;
    @sField({ apiName: 'UserPreferencesSuppressEventSFXReminders', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'SuppressEventSFXReminders', externalId: false })
    public userPreferencesSuppressEventSFXReminders: boolean;
    @sField({ apiName: 'UserPreferencesPreviewCustomTheme', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'PreviewCustomTheme', externalId: false })
    public userPreferencesPreviewCustomTheme: boolean;
    @sField({ apiName: 'UserPreferencesHasCelebrationBadge', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'HasCelebrationBadge', externalId: false })
    public userPreferencesHasCelebrationBadge: boolean;
    @sField({ apiName: 'UserPreferencesUserDebugModePref', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'UserDebugModePref', externalId: false })
    public userPreferencesUserDebugModePref: boolean;
    @sField({ apiName: 'UserPreferencesNewLightningReportRunPageEnabled', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'NewLightningReportRunPageEnabled', externalId: false })
    public userPreferencesNewLightningReportRunPageEnabled: boolean;
    @sField({ apiName: 'Contact', createable: false, updateable: false, required: false, reference: () => { return Contact }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Contact ID', externalId: false })
    public contact: Contact;
    @sField({ apiName: 'ContactId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Contact ID', externalId: false })
    public contactId: string;
    @sField({ apiName: 'Account', createable: false, updateable: false, required: false, reference: () => { return Account }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Account ID', externalId: false })
    public account: Account;
    @sField({ apiName: 'AccountId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Account ID', externalId: false })
    public readonly accountId: string;
    @sField({ apiName: 'CallCenterId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Call Center ID', externalId: false })
    public callCenterId: string;
    @sField({ apiName: 'Extension', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PHONE, salesforceLabel: 'Extension', externalId: false })
    public extension: string;
    @sField({ apiName: 'FederationIdentifier', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'SAML Federation ID', externalId: false })
    public federationIdentifier: string;
    @sField({ apiName: 'AboutMe', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'About Me', externalId: false })
    public aboutMe: string;
    @sField({ apiName: 'FullPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Url for full-sized Photo', externalId: false })
    public readonly fullPhotoUrl: string;
    @sField({ apiName: 'SmallPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Photo', externalId: false })
    public readonly smallPhotoUrl: string;
    @sField({ apiName: 'IsExtIndicatorVisible', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Show external indicator', externalId: false })
    public readonly isExtIndicatorVisible: boolean;
    @sField({ apiName: 'OutOfOfficeMessage', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Out of office message', externalId: false })
    public readonly outOfOfficeMessage: string;
    @sField({ apiName: 'MediumPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Url for medium profile photo', externalId: false })
    public readonly mediumPhotoUrl: string;
    @sField({ apiName: 'DigestFrequency', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Chatter Email Highlights Frequency', externalId: false })
    public digestFrequency: PicklistConst<typeof User.PICKLIST.digestFrequency>;
    @sField({ apiName: 'DefaultGroupNotificationFrequency', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Default Notification Frequency when Joining Groups', externalId: false })
    public defaultGroupNotificationFrequency: PicklistConst<typeof User.PICKLIST.defaultGroupNotificationFrequency>;
    @sField({ apiName: 'JigsawImportLimitOverride', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.INT, salesforceLabel: 'Data.com Monthly Addition Limit', externalId: false })
    public jigsawImportLimitOverride: number;
    @sField({ apiName: 'LastViewedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Viewed Date', externalId: false })
    public readonly lastViewedDate: Date;
    @sField({ apiName: 'LastReferencedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Referenced Date', externalId: false })
    public readonly lastReferencedDate: Date;
    @sField({ apiName: 'BannerPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Url for banner photo', externalId: false })
    public readonly bannerPhotoUrl: string;
    @sField({ apiName: 'SmallBannerPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Url for IOS banner photo', externalId: false })
    public readonly smallBannerPhotoUrl: string;
    @sField({ apiName: 'MediumBannerPhotoUrl', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.URL, salesforceLabel: 'Url for Android banner photo', externalId: false })
    public readonly mediumBannerPhotoUrl: string;
    @sField({ apiName: 'IsProfilePhotoActive', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Has Profile Photo', externalId: false })
    public readonly isProfilePhotoActive: boolean;
    @sField({ apiName: 'IndividualId', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Individual ID', externalId: false })
    public individualId: string;

    constructor(fields?: UserFields, restInstance?: Rest) {
        super('User', restInstance);
        this.id = void 0;
        this.username = void 0;
        this.lastName = void 0;
        this.firstName = void 0;
        this.name = void 0;
        this.companyName = void 0;
        this.division = void 0;
        this.department = void 0;
        this.title = void 0;
        this.street = void 0;
        this.city = void 0;
        this.state = void 0;
        this.postalCode = void 0;
        this.country = void 0;
        this.latitude = void 0;
        this.longitude = void 0;
        this.geocodeAccuracy = void 0;
        this.address = void 0;
        this.email = void 0;
        this.emailPreferencesAutoBcc = void 0;
        this.emailPreferencesAutoBccStayInTouch = void 0;
        this.emailPreferencesStayInTouchReminder = void 0;
        this.senderEmail = void 0;
        this.senderName = void 0;
        this.signature = void 0;
        this.stayInTouchSubject = void 0;
        this.stayInTouchSignature = void 0;
        this.stayInTouchNote = void 0;
        this.phone = void 0;
        this.fax = void 0;
        this.mobilePhone = void 0;
        this.alias = void 0;
        this.communityNickname = void 0;
        this.badgeText = void 0;
        this.isActive = void 0;
        this.timeZoneSidKey = void 0;
        this.userRoleId = void 0;
        this.localeSidKey = void 0;
        this.receivesInfoEmails = void 0;
        this.receivesAdminInfoEmails = void 0;
        this.emailEncodingKey = void 0;
        this.profileId = void 0;
        this.userType = void 0;
        this.languageLocaleKey = void 0;
        this.employeeNumber = void 0;
        this.delegatedApproverId = void 0;
        this.manager = void 0;
        this.managerId = void 0;
        this.lastLoginDate = void 0;
        this.lastPasswordChangeDate = void 0;
        this.createdDate = void 0;
        this.createdBy = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedBy = void 0;
        this.lastModifiedById = void 0;
        this.systemModstamp = void 0;
        this.offlineTrialExpirationDate = void 0;
        this.offlinePdaTrialExpirationDate = void 0;
        this.userPermissionsMarketingUser = void 0;
        this.userPermissionsOfflineUser = void 0;
        this.userPermissionsCallCenterAutoLogin = void 0;
        this.userPermissionsMobileUser = void 0;
        this.userPermissionsSFContentUser = void 0;
        this.userPermissionsKnowledgeUser = void 0;
        this.userPermissionsInteractionUser = void 0;
        this.userPermissionsSupportUser = void 0;
        this.userPermissionsJigsawProspectingUser = void 0;
        this.userPermissionsSiteforceContributorUser = void 0;
        this.userPermissionsSiteforcePublisherUser = void 0;
        this.userPermissionsWorkDotComUserFeature = void 0;
        this.forecastEnabled = void 0;
        this.userPreferencesActivityRemindersPopup = void 0;
        this.userPreferencesEventRemindersCheckboxDefault = void 0;
        this.userPreferencesTaskRemindersCheckboxDefault = void 0;
        this.userPreferencesReminderSoundOff = void 0;
        this.userPreferencesDisableAllFeedsEmail = void 0;
        this.userPreferencesDisableFollowersEmail = void 0;
        this.userPreferencesDisableProfilePostEmail = void 0;
        this.userPreferencesDisableChangeCommentEmail = void 0;
        this.userPreferencesDisableLaterCommentEmail = void 0;
        this.userPreferencesDisProfPostCommentEmail = void 0;
        this.userPreferencesContentNoEmail = void 0;
        this.userPreferencesContentEmailAsAndWhen = void 0;
        this.userPreferencesApexPagesDeveloperMode = void 0;
        this.userPreferencesHideCSNGetChatterMobileTask = void 0;
        this.userPreferencesDisableMentionsPostEmail = void 0;
        this.userPreferencesDisMentionsCommentEmail = void 0;
        this.userPreferencesHideCSNDesktopTask = void 0;
        this.userPreferencesHideChatterOnboardingSplash = void 0;
        this.userPreferencesHideSecondChatterOnboardingSplash = void 0;
        this.userPreferencesDisCommentAfterLikeEmail = void 0;
        this.userPreferencesDisableLikeEmail = void 0;
        this.userPreferencesSortFeedByComment = void 0;
        this.userPreferencesDisableMessageEmail = void 0;
        this.userPreferencesJigsawListUser = void 0;
        this.userPreferencesDisableBookmarkEmail = void 0;
        this.userPreferencesDisableSharePostEmail = void 0;
        this.userPreferencesEnableAutoSubForFeeds = void 0;
        this.userPreferencesDisableFileShareNotificationsForApi = void 0;
        this.userPreferencesShowTitleToExternalUsers = void 0;
        this.userPreferencesShowManagerToExternalUsers = void 0;
        this.userPreferencesShowEmailToExternalUsers = void 0;
        this.userPreferencesShowWorkPhoneToExternalUsers = void 0;
        this.userPreferencesShowMobilePhoneToExternalUsers = void 0;
        this.userPreferencesShowFaxToExternalUsers = void 0;
        this.userPreferencesShowStreetAddressToExternalUsers = void 0;
        this.userPreferencesShowCityToExternalUsers = void 0;
        this.userPreferencesShowStateToExternalUsers = void 0;
        this.userPreferencesShowPostalCodeToExternalUsers = void 0;
        this.userPreferencesShowCountryToExternalUsers = void 0;
        this.userPreferencesShowProfilePicToGuestUsers = void 0;
        this.userPreferencesShowTitleToGuestUsers = void 0;
        this.userPreferencesShowCityToGuestUsers = void 0;
        this.userPreferencesShowStateToGuestUsers = void 0;
        this.userPreferencesShowPostalCodeToGuestUsers = void 0;
        this.userPreferencesShowCountryToGuestUsers = void 0;
        this.userPreferencesDisableFeedbackEmail = void 0;
        this.userPreferencesDisableWorkEmail = void 0;
        this.userPreferencesPipelineViewHideHelpPopover = void 0;
        this.userPreferencesHideS1BrowserUI = void 0;
        this.userPreferencesDisableEndorsementEmail = void 0;
        this.userPreferencesPathAssistantCollapsed = void 0;
        this.userPreferencesCacheDiagnostics = void 0;
        this.userPreferencesShowEmailToGuestUsers = void 0;
        this.userPreferencesShowManagerToGuestUsers = void 0;
        this.userPreferencesShowWorkPhoneToGuestUsers = void 0;
        this.userPreferencesShowMobilePhoneToGuestUsers = void 0;
        this.userPreferencesShowFaxToGuestUsers = void 0;
        this.userPreferencesShowStreetAddressToGuestUsers = void 0;
        this.userPreferencesLightningExperiencePreferred = void 0;
        this.userPreferencesPreviewLightning = void 0;
        this.userPreferencesHideEndUserOnboardingAssistantModal = void 0;
        this.userPreferencesHideLightningMigrationModal = void 0;
        this.userPreferencesHideSfxWelcomeMat = void 0;
        this.userPreferencesHideBiggerPhotoCallout = void 0;
        this.userPreferencesGlobalNavBarWTShown = void 0;
        this.userPreferencesGlobalNavGridMenuWTShown = void 0;
        this.userPreferencesCreateLEXAppsWTShown = void 0;
        this.userPreferencesFavoritesWTShown = void 0;
        this.userPreferencesRecordHomeSectionCollapseWTShown = void 0;
        this.userPreferencesRecordHomeReservedWTShown = void 0;
        this.userPreferencesFavoritesShowTopFavorites = void 0;
        this.userPreferencesExcludeMailAppAttachments = void 0;
        this.userPreferencesSuppressTaskSFXReminders = void 0;
        this.userPreferencesSuppressEventSFXReminders = void 0;
        this.userPreferencesPreviewCustomTheme = void 0;
        this.userPreferencesHasCelebrationBadge = void 0;
        this.userPreferencesUserDebugModePref = void 0;
        this.userPreferencesNewLightningReportRunPageEnabled = void 0;
        this.contact = void 0;
        this.contactId = void 0;
        this.account = void 0;
        this.accountId = void 0;
        this.callCenterId = void 0;
        this.extension = void 0;
        this.federationIdentifier = void 0;
        this.aboutMe = void 0;
        this.fullPhotoUrl = void 0;
        this.smallPhotoUrl = void 0;
        this.isExtIndicatorVisible = void 0;
        this.outOfOfficeMessage = void 0;
        this.mediumPhotoUrl = void 0;
        this.digestFrequency = void 0;
        this.defaultGroupNotificationFrequency = void 0;
        this.jigsawImportLimitOverride = void 0;
        this.lastViewedDate = void 0;
        this.lastReferencedDate = void 0;
        this.bannerPhotoUrl = void 0;
        this.smallBannerPhotoUrl = void 0;
        this.mediumBannerPhotoUrl = void 0;
        this.isProfilePhotoActive = void 0;
        this.individualId = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'User' = 'User';
    public readonly _TYPE_: 'User' = 'User';
    private static _fields: { [P in keyof FieldProps<User>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : User.getPropertiesMeta<FieldProps<User>, User>(User)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<User>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<User[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(User, qryParam) : qryParam;
        return await RestObject.query<User>(User, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): User {
        return new User().mapFromQuery(sob);
    }

    public static readonly PICKLIST = {
        geocodeAccuracy: {
            ADDRESS: "Address",
            NEARADDRESS: "NearAddress",
            BLOCK: "Block",
            STREET: "Street",
            EXTENDEDZIP: "ExtendedZip",
            ZIP: "Zip",
            NEIGHBORHOOD: "Neighborhood",
            CITY: "City",
            COUNTY: "County",
            STATE: "State",
            UNKNOWN: "Unknown"
        },
        timeZoneSidKey: {
            PACIFICKIRITIMATI: "Pacific/Kiritimati",
            PACIFICCHATHAM: "Pacific/Chatham",
            PACIFICAUCKLAND: "Pacific/Auckland",
            PACIFICENDERBURY: "Pacific/Enderbury",
            PACIFICFIJI: "Pacific/Fiji",
            PACIFICTONGATAPU: "Pacific/Tongatapu",
            ASIAKAMCHATKA: "Asia/Kamchatka",
            PACIFICNORFOLK: "Pacific/Norfolk",
            AUSTRALIALORD_HOWE: "Australia/Lord_Howe",
            AUSTRALIASYDNEY: "Australia/Sydney",
            PACIFICGUADALCANAL: "Pacific/Guadalcanal",
            AUSTRALIAADELAIDE: "Australia/Adelaide",
            AUSTRALIABRISBANE: "Australia/Brisbane",
            AUSTRALIADARWIN: "Australia/Darwin",
            ASIASEOUL: "Asia/Seoul",
            ASIATOKYO: "Asia/Tokyo",
            ASIAHONG_KONG: "Asia/Hong_Kong",
            ASIAKUALA_LUMPUR: "Asia/Kuala_Lumpur",
            ASIAMANILA: "Asia/Manila",
            ASIASHANGHAI: "Asia/Shanghai",
            ASIASINGAPORE: "Asia/Singapore",
            ASIATAIPEI: "Asia/Taipei",
            AUSTRALIAPERTH: "Australia/Perth",
            ASIABANGKOK: "Asia/Bangkok",
            ASIAHO_CHI_MINH: "Asia/Ho_Chi_Minh",
            ASIAJAKARTA: "Asia/Jakarta",
            ASIARANGOON: "Asia/Rangoon",
            ASIADHAKA: "Asia/Dhaka",
            ASIAKATHMANDU: "Asia/Kathmandu",
            ASIACOLOMBO: "Asia/Colombo",
            ASIAKOLKATA: "Asia/Kolkata",
            ASIAKARACHI: "Asia/Karachi",
            ASIATASHKENT: "Asia/Tashkent",
            ASIAYEKATERINBURG: "Asia/Yekaterinburg",
            ASIAKABUL: "Asia/Kabul",
            ASIABAKU: "Asia/Baku",
            ASIADUBAI: "Asia/Dubai",
            ASIATBILISI: "Asia/Tbilisi",
            ASIAYEREVAN: "Asia/Yerevan",
            ASIATEHRAN: "Asia/Tehran",
            AFRICANAIROBI: "Africa/Nairobi",
            ASIABAGHDAD: "Asia/Baghdad",
            ASIAKUWAIT: "Asia/Kuwait",
            ASIARIYADH: "Asia/Riyadh",
            EUROPEISTANBUL: "Europe/Istanbul",
            EUROPEMINSK: "Europe/Minsk",
            EUROPEMOSCOW: "Europe/Moscow",
            AFRICACAIRO: "Africa/Cairo",
            AFRICAJOHANNESBURG: "Africa/Johannesburg",
            ASIABEIRUT: "Asia/Beirut",
            ASIAJERUSALEM: "Asia/Jerusalem",
            EUROPEATHENS: "Europe/Athens",
            EUROPEBUCHAREST: "Europe/Bucharest",
            EUROPEHELSINKI: "Europe/Helsinki",
            AFRICAALGIERS: "Africa/Algiers",
            AFRICACASABLANCA: "Africa/Casablanca",
            EUROPEAMSTERDAM: "Europe/Amsterdam",
            EUROPEBERLIN: "Europe/Berlin",
            EUROPEBRUSSELS: "Europe/Brussels",
            EUROPEPARIS: "Europe/Paris",
            EUROPEPRAGUE: "Europe/Prague",
            EUROPEROME: "Europe/Rome",
            EUROPEDUBLIN: "Europe/Dublin",
            EUROPELISBON: "Europe/Lisbon",
            EUROPELONDON: "Europe/London",
            GMT: "GMT",
            AMERICASCORESBYSUND: "America/Scoresbysund",
            ATLANTICAZORES: "Atlantic/Azores",
            ATLANTICCAPE_VERDE: "Atlantic/Cape_Verde",
            ATLANTICSOUTH_GEORGIA: "Atlantic/South_Georgia",
            AMERICAARGENTINABUENOS_AIRES: "America/Argentina/Buenos_Aires",
            AMERICASANTIAGO: "America/Santiago",
            AMERICASAO_PAULO: "America/Sao_Paulo",
            AMERICAST_JOHNS: "America/St_Johns",
            AMERICACARACAS: "America/Caracas",
            AMERICAHALIFAX: "America/Halifax",
            AMERICAPUERTO_RICO: "America/Puerto_Rico",
            ATLANTICBERMUDA: "Atlantic/Bermuda",
            AMERICABOGOTA: "America/Bogota",
            AMERICAINDIANAINDIANAPOLIS: "America/Indiana/Indianapolis",
            AMERICALIMA: "America/Lima",
            AMERICANEW_YORK: "America/New_York",
            AMERICAPANAMA: "America/Panama",
            AMERICACHICAGO: "America/Chicago",
            AMERICAEL_SALVADOR: "America/El_Salvador",
            AMERICAMEXICO_CITY: "America/Mexico_City",
            AMERICADENVER: "America/Denver",
            AMERICAMAZATLAN: "America/Mazatlan",
            AMERICAPHOENIX: "America/Phoenix",
            AMERICALOS_ANGELES: "America/Los_Angeles",
            AMERICATIJUANA: "America/Tijuana",
            PACIFICPITCAIRN: "Pacific/Pitcairn",
            AMERICAANCHORAGE: "America/Anchorage",
            PACIFICGAMBIER: "Pacific/Gambier",
            PACIFICMARQUESAS: "Pacific/Marquesas",
            AMERICAADAK: "America/Adak",
            PACIFICHONOLULU: "Pacific/Honolulu",
            PACIFICNIUE: "Pacific/Niue",
            PACIFICPAGO_PAGO: "Pacific/Pago_Pago"
        },
        localeSidKey: {
            SQ_AL: "sq_AL",
            AR_DZ: "ar_DZ",
            AR_BH: "ar_BH",
            AR_EG: "ar_EG",
            AR_IQ: "ar_IQ",
            AR_JO: "ar_JO",
            AR_KW: "ar_KW",
            AR_LB: "ar_LB",
            AR_LY: "ar_LY",
            AR_MA: "ar_MA",
            AR_OM: "ar_OM",
            AR_QA: "ar_QA",
            AR_SA: "ar_SA",
            AR_SD: "ar_SD",
            AR_SY: "ar_SY",
            AR_TN: "ar_TN",
            AR_AE: "ar_AE",
            AR_YE: "ar_YE",
            HY_AM: "hy_AM",
            AZ_AZ: "az_AZ",
            BN_BD: "bn_BD",
            EU_ES: "eu_ES",
            BE_BY: "be_BY",
            BS_BA: "bs_BA",
            BG_BG: "bg_BG",
            MY_MM: "my_MM",
            CA_ES: "ca_ES",
            ZH_CN_PINYIN: "zh_CN_PINYIN",
            ZH_CN_STROKE: "zh_CN_STROKE",
            ZH_CN: "zh_CN",
            ZH_HK_STROKE: "zh_HK_STROKE",
            ZH_HK: "zh_HK",
            ZH_MO: "zh_MO",
            ZH_SG: "zh_SG",
            ZH_TW_STROKE: "zh_TW_STROKE",
            ZH_TW: "zh_TW",
            HR_HR: "hr_HR",
            CS_CZ: "cs_CZ",
            DA_DK: "da_DK",
            NL_AW: "nl_AW",
            NL_BE: "nl_BE",
            NL_NL: "nl_NL",
            NL_SR: "nl_SR",
            DZ_BT: "dz_BT",
            EN_AG: "en_AG",
            EN_AU: "en_AU",
            EN_BS: "en_BS",
            EN_BB: "en_BB",
            EN_BZ: "en_BZ",
            EN_BM: "en_BM",
            EN_BW: "en_BW",
            EN_CM: "en_CM",
            EN_CA: "en_CA",
            EN_KY: "en_KY",
            EN_ER: "en_ER",
            EN_FK: "en_FK",
            EN_FJ: "en_FJ",
            EN_GM: "en_GM",
            EN_GH: "en_GH",
            EN_GI: "en_GI",
            EN_GY: "en_GY",
            EN_HK: "en_HK",
            EN_IN: "en_IN",
            EN_ID: "en_ID",
            EN_IE: "en_IE",
            EN_JM: "en_JM",
            EN_KE: "en_KE",
            EN_LR: "en_LR",
            EN_MG: "en_MG",
            EN_MW: "en_MW",
            EN_MY: "en_MY",
            EN_MU: "en_MU",
            EN_NA: "en_NA",
            EN_NZ: "en_NZ",
            EN_NG: "en_NG",
            EN_PK: "en_PK",
            EN_PG: "en_PG",
            EN_PH: "en_PH",
            EN_RW: "en_RW",
            EN_WS: "en_WS",
            EN_SC: "en_SC",
            EN_SL: "en_SL",
            EN_SG: "en_SG",
            EN_SX: "en_SX",
            EN_SB: "en_SB",
            EN_ZA: "en_ZA",
            EN_SH: "en_SH",
            EN_SZ: "en_SZ",
            EN_TZ: "en_TZ",
            EN_TO: "en_TO",
            EN_TT: "en_TT",
            EN_UG: "en_UG",
            EN_GB: "en_GB",
            EN_US: "en_US",
            EN_VU: "en_VU",
            ET_EE: "et_EE",
            FI_FI: "fi_FI",
            FR_BE: "fr_BE",
            FR_CA: "fr_CA",
            FR_KM: "fr_KM",
            FR_FR: "fr_FR",
            FR_GN: "fr_GN",
            FR_HT: "fr_HT",
            FR_LU: "fr_LU",
            FR_MR: "fr_MR",
            FR_MC: "fr_MC",
            FR_CH: "fr_CH",
            FR_WF: "fr_WF",
            KA_GE: "ka_GE",
            DE_AT: "de_AT",
            DE_BE: "de_BE",
            DE_DE: "de_DE",
            DE_LU: "de_LU",
            DE_CH: "de_CH",
            EL_GR: "el_GR",
            IW_IL: "iw_IL",
            HI_IN: "hi_IN",
            HU_HU: "hu_HU",
            IS_IS: "is_IS",
            IN_ID: "in_ID",
            GA_IE: "ga_IE",
            IT_IT: "it_IT",
            IT_CH: "it_CH",
            JA_JP: "ja_JP",
            KK_KZ: "kk_KZ",
            KM_KH: "km_KH",
            KO_KP: "ko_KP",
            KO_KR: "ko_KR",
            KY_KG: "ky_KG",
            LO_LA: "lo_LA",
            LV_LV: "lv_LV",
            LT_LT: "lt_LT",
            LU_CD: "lu_CD",
            LB_LU: "lb_LU",
            MK_MK: "mk_MK",
            MS_BN: "ms_BN",
            MS_MY: "ms_MY",
            MT_MT: "mt_MT",
            SH_ME: "sh_ME",
            NE_NP: "ne_NP",
            NO_NO: "no_NO",
            PS_AF: "ps_AF",
            FA_IR: "fa_IR",
            PL_PL: "pl_PL",
            PT_AO: "pt_AO",
            PT_BR: "pt_BR",
            PT_CV: "pt_CV",
            PT_MZ: "pt_MZ",
            PT_PT: "pt_PT",
            PT_ST: "pt_ST",
            RO_MD: "ro_MD",
            RO_RO: "ro_RO",
            RM_CH: "rm_CH",
            RN_BI: "rn_BI",
            RU_RU: "ru_RU",
            SR_BA: "sr_BA",
            SR_CS: "sr_CS",
            SH_BA: "sh_BA",
            SH_CS: "sh_CS",
            SR_RS: "sr_RS",
            SK_SK: "sk_SK",
            SL_SI: "sl_SI",
            SO_DJ: "so_DJ",
            SO_SO: "so_SO",
            ES_AR: "es_AR",
            ES_BO: "es_BO",
            ES_CL: "es_CL",
            ES_CO: "es_CO",
            ES_CR: "es_CR",
            ES_CU: "es_CU",
            ES_DO: "es_DO",
            ES_EC: "es_EC",
            ES_SV: "es_SV",
            ES_GT: "es_GT",
            ES_HN: "es_HN",
            ES_MX: "es_MX",
            ES_NI: "es_NI",
            ES_PA: "es_PA",
            ES_PY: "es_PY",
            ES_PE: "es_PE",
            ES_PR: "es_PR",
            ES_ES: "es_ES",
            ES_US: "es_US",
            ES_UY: "es_UY",
            ES_VE: "es_VE",
            SV_SE: "sv_SE",
            TL_PH: "tl_PH",
            TG_TJ: "tg_TJ",
            TA_IN: "ta_IN",
            TA_LK: "ta_LK",
            TH_TH: "th_TH",
            TI_ET: "ti_ET",
            TR_TR: "tr_TR",
            UK_UA: "uk_UA",
            UR_PK: "ur_PK",
            UZ_LATN_UZ: "uz_LATN_UZ",
            VI_VN: "vi_VN",
            CY_GB: "cy_GB",
            YO_BJ: "yo_BJ"
        },
        emailEncodingKey: {
            UTF8: "UTF-8",
            ISO88591: "ISO-8859-1",
            SHIFT_JIS: "Shift_JIS",
            ISO2022JP: "ISO-2022-JP",
            EUCJP: "EUC-JP",
            KS_C_56011987: "ks_c_5601-1987",
            BIG5: "Big5",
            GB2312: "GB2312",
            BIG5HKSCS: "Big5-HKSCS",
            XSJIS_0213: "x-SJIS_0213"
        },
        userType: {
            STANDARD: "Standard",
            POWERPARTNER: "PowerPartner",
            POWERCUSTOMERSUCCESS: "PowerCustomerSuccess",
            CUSTOMERSUCCESS: "CustomerSuccess",
            GUEST: "Guest",
            CSPLITEPORTAL: "CspLitePortal",
            CSNONLY: "CsnOnly",
            SELFSERVICE: "SelfService"
        },
        languageLocaleKey: {
            EN_US: "en_US",
            DE: "de",
            ES: "es",
            FR: "fr",
            IT: "it",
            JA: "ja",
            SV: "sv",
            KO: "ko",
            ZH_TW: "zh_TW",
            ZH_CN: "zh_CN",
            PT_BR: "pt_BR",
            NL_NL: "nl_NL",
            DA: "da",
            TH: "th",
            FI: "fi",
            RU: "ru",
            ES_MX: "es_MX",
            NO: "no"
        },
        digestFrequency: {
            D: "D",
            W: "W",
            N: "N"
        },
        defaultGroupNotificationFrequency: {
            P: "P",
            D: "D",
            W: "W",
            N: "N"
        }
    } as const;
}

export type PushTopicFields = Partial<FieldProps<PushTopic>>;

/**
 * Generated class for PushTopic
 */
export class PushTopic extends RestObject {
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Push Topic ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'Name', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Topic Name', externalId: false })
    public name: string;
    @sField({ apiName: 'Query', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'SOQL Query', externalId: false })
    public query: string;
    @sField({ apiName: 'ApiVersion', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'API Version', externalId: false })
    public apiVersion: number;
    @sField({ apiName: 'IsActive', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Is Active', externalId: false })
    public isActive: boolean;
    @sField({ apiName: 'NotifyForFields', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Notify For Fields', externalId: false })
    public notifyForFields: PicklistConst<typeof PushTopic.PICKLIST.notifyForFields>;
    @sField({ apiName: 'NotifyForOperations', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Notify For Operations', externalId: false })
    public readonly notifyForOperations: PicklistConst<typeof PushTopic.PICKLIST.notifyForOperations>;
    @sField({ apiName: 'Description', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Description', externalId: false })
    public description: string;
    @sField({ apiName: 'NotifyForOperationCreate', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Create', externalId: false })
    public notifyForOperationCreate: boolean;
    @sField({ apiName: 'NotifyForOperationUpdate', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Update', externalId: false })
    public notifyForOperationUpdate: boolean;
    @sField({ apiName: 'NotifyForOperationDelete', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Delete', externalId: false })
    public notifyForOperationDelete: boolean;
    @sField({ apiName: 'NotifyForOperationUndelete', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Undelete', externalId: false })
    public notifyForOperationUndelete: boolean;
    @sField({ apiName: 'IsDeleted', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Deleted', externalId: false })
    public readonly isDeleted: boolean;
    @sField({ apiName: 'CreatedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Created Date', externalId: false })
    public readonly createdDate: Date;
    @sField({ apiName: 'CreatedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public createdBy: User;
    @sField({ apiName: 'CreatedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public readonly createdById: string;
    @sField({ apiName: 'LastModifiedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Modified Date', externalId: false })
    public readonly lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedBy', createable: false, updateable: false, required: false, reference: () => { return User }, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public lastModifiedBy: User;
    @sField({ apiName: 'LastModifiedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public readonly lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'System Modstamp', externalId: false })
    public readonly systemModstamp: Date;

    constructor(fields?: PushTopicFields, restInstance?: Rest) {
        super('PushTopic', restInstance);
        this.id = void 0;
        this.name = void 0;
        this.query = void 0;
        this.apiVersion = void 0;
        this.isActive = void 0;
        this.notifyForFields = void 0;
        this.notifyForOperations = void 0;
        this.description = void 0;
        this.notifyForOperationCreate = void 0;
        this.notifyForOperationUpdate = void 0;
        this.notifyForOperationDelete = void 0;
        this.notifyForOperationUndelete = void 0;
        this.isDeleted = void 0;
        this.createdDate = void 0;
        this.createdBy = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedBy = void 0;
        this.lastModifiedById = void 0;
        this.systemModstamp = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'PushTopic' = 'PushTopic';
    public readonly _TYPE_: 'PushTopic' = 'PushTopic';
    private static _fields: { [P in keyof FieldProps<PushTopic>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : PushTopic.getPropertiesMeta<FieldProps<PushTopic>, PushTopic>(PushTopic)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<PushTopic>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<PushTopic[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(PushTopic, qryParam) : qryParam;
        return await RestObject.query<PushTopic>(PushTopic, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): PushTopic {
        return new PushTopic().mapFromQuery(sob);
    }

    public static readonly PICKLIST = {
        notifyForFields: {
            SELECT: "Select",
            WHERE: "Where",
            REFERENCED: "Referenced",
            ALL: "All"
        },
        notifyForOperations: {
            CREATE: "Create",
            UPDATE: "Update",
            ALL: "All",
            EXTENDED: "Extended"
        }
    } as const;
}

