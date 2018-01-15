import 'reflect-metadata';

import { RestObject } from './sObject';

export enum SalesforceFieldType {
    DATE          = 'date',
    DATETIME      = 'datetime',
    BOOLEAN       = 'boolean',
    DOUBLE        = 'double',
    INTEGER       = 'integer',
    CURRENCY      = 'currency',
    REFERENCE     = 'reference',
    STRING        = 'string',
    PICKLIST      = 'picklist',
    TEXTAREA      = 'textarea',
    ADDRESS       = 'address',
    PHONE         = 'phone',
    URL           = 'url',
    MULTIPICKLIST = 'multipicklist',
    PERCENT       = 'percent',
    EMAIL         = 'email',
    INT           = 'int',
    LOCATION      = 'location',
    ID            = 'id'
}
const sFieldMetadataKey = Symbol('sField');

export class SFieldProperties {
    public apiName: string;
    public readOnly: boolean;
    public reference: () => { new(): RestObject; };
    public required: boolean;
    public childRelationship: boolean;
    public salesforceType: SalesforceFieldType;
    public salesforceLabel?: string;
}

export function sField (props: SFieldProperties) {
    return Reflect.metadata(sFieldMetadataKey, props);
}

export function getSFieldProps (target: any, propertyKey: string): SFieldProperties {
    return Reflect.getMetadata(sFieldMetadataKey, target, propertyKey);
}
