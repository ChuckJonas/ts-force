
import { RestObject } from './rest/restObject';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export type ReferencePropNames<T> = { [K in keyof T]: T[K] extends RestObject ? K : never }[keyof T];

export type NonReferencePropNames<T> = { [K in keyof T]: T[K] extends RestObject ? never : K }[keyof T];

export type RelationPropNames<T> = { [K in keyof T]: T[K] extends RestObject[] ? K : never }[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export type withoutTypeProp<T> = Omit<T, '_TYPE_' | 'attributes' | '_modified'>;
export type FieldProps<T> = Partial<withoutTypeProp<NonFunctionProperties<T>>>;
