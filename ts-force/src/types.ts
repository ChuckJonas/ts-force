
import { RestObject } from './rest/restObject';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type QueryField<T> = NonReferencePropNames<ExcludeNonQueryFields<T>> & NonFunctionPropertyNames<ExcludeNonQueryFields<T>>;

export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export type ParentReferencePropNames<T> = { [K in keyof T]: T[K] extends RestObject ? K : never }[keyof T];

export type NonReferencePropNames<T> = { [K in keyof T]: T[K] extends RestObject | Array<RestObject> ? never : K }[keyof T];

export type RelationPropNames<T> = { [K in keyof T]: T[K] extends RestObject[] ? K : never }[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// exclude non-reference fields that should not be seletable
export type ExcludeNonQueryFields<T> = Omit<T, '_TYPE_' | 'attributes' | '_modified'>;

// for constructing SObjects
export type ExcludeNonFields<T> = Omit<T, 'attributes' | '_modified'>;
export type FieldProps<T> = ExcludeNonFields<NonFunctionProperties<T>>;

// for picklist generation
export type PicklistConst<T extends any> = T[keyof T];
