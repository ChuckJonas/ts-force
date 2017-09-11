import { ChildRelationship } from './sObjectDescribe';
import 'reflect-metadata';
import { SObject } from './SObject';

const sFieldMetadataKey = Symbol("sField");

export class SFieldProperties{
  public apiName: string;
  public readOnly: boolean;
  public reference: () => { new(): SObject; }
  public required: boolean;
  public childRelationship: boolean;
}

export function sField(props: SFieldProperties) {
  return Reflect.metadata(sFieldMetadataKey, props);
}

export function getSFieldProps(target: any, propertyKey: string): SFieldProperties{
  return Reflect.getMetadata(sFieldMetadataKey, target, propertyKey);
}
