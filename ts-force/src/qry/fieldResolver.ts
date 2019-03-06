import { RelationPropNames, ParentReferencePropNames, QueryField } from '../types';

import { SFieldProperties } from '..';
import { composeSOQLQuery, SObjectStatic, SOQLQueryParams } from './queryBuilder';

export type AggregateFunctions = 'MIN' | 'MAX' | 'COUNT' | 'AVG' | 'COUNT_DISTINCT' | 'SUM';
export type CalendarFunctions = 'CALENDAR_MONTH' | 'CALENDAR_QUARTER' | 'CALENDAR_YEAR' | 'DAY_IN_MONTH' | 'DAY_IN_WEEK' | 'DAY_IN_YEAR' | 'DAY_ONLY'; // todo: add rest
export type SOQLFunction = AggregateFunctions | CalendarFunctions;
export interface FunctionField<T> {
    fn: SOQLFunction;
    alias?: string;
    field: QueryField<T>;
}

/**
 * Allow resolving of object API
 */
export class FieldResolver<T>{
    private readonly _traversed: SFieldProperties[];
    private readonly _obj: SObjectStatic<T>;

    constructor (obj: SObjectStatic<T>, traversed?: SFieldProperties[]) {
        this._obj = obj;
        this._traversed = traversed || [];
    }

    /**
     * Resolves API names of the passed in fields, in relation to the starting SObject type.
     *
     * @param ...args: One or more Field Key of T (SObject) or FunctionType<T>
     * @returns string|string[] of resolved API name(s) matching how many params where passed in
     */
    public select<F extends FunctionField<T>, P extends QueryField<T>> (f: P | F ): string;
    public select<F extends FunctionField<T>, P extends QueryField<T>> (...args: Array<P | F> ): string[];
    public select<F extends FunctionField<T>, P extends QueryField<T>> (...args: Array<P | F>): string | string[] {
        let relations = this._traversed.map(r => r.apiName);
        let fieldArr = args.map(field => {
            if (typeof field === 'string') {
                return this._obj.FIELDS[field as string].apiName;
            }else if (typeof field === 'object') {
                return renderComplexTypeText(this._obj.FIELDS[field.field as string].apiName, field.fn, field.alias);
            }
            return this._obj.FIELDS[field as string].apiName;
        });
        let fields = fieldArr.map(field => {
            return [...relations, ...[field]].join('.');
        });
        if (fields.length === 1) {
            return fields[0];
        }
        return fields;
    }

    /**
     * Traverses a parent relationship, providing a field resolver that can build field paths relative to the starting relationship
     *
     * @param relation: a parent SObject relation key of the current SObject
     * @returns a new FieldResolver for the selected parent relation, with information to track the traversed relationships
     */
    public parent<K extends ParentReferencePropNames<T>> (relation: K) {
        let rel1Meta = this._obj.FIELDS[relation as string];
        let rel1 = rel1Meta.reference() as any as SObjectStatic<T[K]>;
        return new FieldResolver(rel1, [...this._traversed, ...[rel1Meta]]);
    }

    /**
     * Provided the a key of a child relationship on the SObject,
     * creates a new FieldResolver for that relationships type and passes in `func` so a SELECT subquery can be generated
     *
     * @param relationship The child relationships key to generate the subquery for
     * @param func a function, which accepts a FieldResolver and returns the a Subquery
     */
    public subQuery<K extends RelationPropNames<T>, T2 extends T[K] extends (infer U)[] ? U : never> (relationship: K, func: (fields: FieldResolver<T2>) => SOQLQueryParams): string {
        let relationMeta = this._obj.FIELDS[relationship as string];
        let fields = new FieldResolver(relationMeta.reference() as any as SObjectStatic<T2>);
        let subQuery = func(fields);
        return `(${composeSOQLQuery({ ...subQuery, ...{ from: relationMeta.apiName } })})`;
    }
}

export function renderComplexTypeText (field, func, alias?) {
    return `${func}(${field})${alias ? ' ' + alias : ''}`;
}
