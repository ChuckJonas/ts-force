import { ChildRelationship } from './sObjectDescribe';
import 'reflect-metadata';
import { RestObject } from './sObject';

const sFieldMetadataKey = Symbol('sField');

export class SFieldProperties {
    public apiName: string;
    public readOnly: boolean;
    public reference?: () => { new(): RestObject; };
    public required: boolean;
    public childRelationship: boolean;
    public salesforceType: string;
    public salesforceLabel?: string;
}

export function sField (props: SFieldProperties) {
    return Reflect.metadata(sFieldMetadataKey, props);
}

export function getSFieldProps (target: any, propertyKey: string): SFieldProperties {
    return Reflect.getMetadata(sFieldMetadataKey, target, propertyKey);
}
