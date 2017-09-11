import "reflect-metadata";
import { SObject } from './SObject';

const requiredMetadataKey = Symbol("required");

export function required() {
  return Reflect.metadata(requiredMetadataKey, true);
}

export function isRequired(target: any, propertyKey: string) {
  return Reflect.getMetadata(requiredMetadataKey, target, propertyKey);
}


const readonlyMetadataKey = Symbol("readonly");

export function readonly() {
  return Reflect.metadata(readonlyMetadataKey, true);
}

export function isReadOnly(target: any, propertyKey: string) {
  return Reflect.getMetadata(readonlyMetadataKey, target, propertyKey);
}

const referenceMetadataKey = Symbol("reference");

export function reference(type: { new(): SObject; }) {
  return Reflect.metadata(referenceMetadataKey, type);
}

export function getReferenceTypeConstructor(target: any, propertyKey: string): { new(): SObject; } {
  return Reflect.getMetadata(referenceMetadataKey, target, propertyKey);
}