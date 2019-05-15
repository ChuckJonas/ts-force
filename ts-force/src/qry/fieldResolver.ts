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
    public readonly traversed: SFieldProperties[];
    protected readonly _obj: SObjectStatic<T>;

    constructor (obj: SObjectStatic<T>, traversed?: SFieldProperties[]) {
        this._obj = obj;
        this.traversed = traversed || [];
    }

    /**
     * Resolves API names of the passed in fields, in relation to the starting SObject type.
     *
     * @param ...args: One or more Field Key of T (SObject) or FunctionType<T>
     * @returns string|string[] of resolved API name(s) matching how many params where passed in
     */
    public select(f: QueryField<T> | FunctionField<T> ): string;
    public select(arr: Array<QueryField<T> | FunctionField<T>>): string[];
    public select(...args: Array<QueryField<T> | FunctionField<T>>): string[];
    public select(...args: Array<QueryField<T> | FunctionField<T>> | [Array<QueryField<T> | FunctionField<T>>]): string | string[] {
        let relations = this.traversed.map(r => r.apiName);
        let fieldArr: string[] = [];
        let toResolve = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            toResolve = args[0];
        }
        for (let field of toResolve) {
            if (Array.isArray(field)) {
                field.forEach(arrField => {
                    if (typeof arrField === 'string') {
                        fieldArr.push(this._obj.FIELDS[arrField as string].apiName);
                    }else if (typeof arrField === 'object') {
                        fieldArr.push(renderComplexTypeText(this._obj.FIELDS[arrField.field as string].apiName, arrField.fn, arrField.alias));
                    }
                });
            }else if (typeof field === 'string') {
                fieldArr.push(this._obj.FIELDS[field as string].apiName);
            }else if (typeof field === 'object') {
                fieldArr.push(renderComplexTypeText(this._obj.FIELDS[field.field as string].apiName, field.fn, field.alias));
            }
        }
        let fields = fieldArr.map(field => {
            return [...relations, ...[field]].join('.');
        });
        if (fields.length === 1 && !Array.isArray(args[0])) {
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
        return new FieldResolver(rel1, [...this.traversed, ...[rel1Meta]]);
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

export function renderComplexTypeText (field: string, func: string, alias?: string) {
    return `${func}(${field})${alias ? ' ' + alias : ''}`;
}
