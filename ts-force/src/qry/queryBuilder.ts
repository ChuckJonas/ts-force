import { FieldResolver } from './fieldResolver';
import { ConditionalClause, composeConditionalClause } from './conditional';
import { SFieldProperties, FieldProps, SObject } from '..';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface OrderBy {
    field?: string;
    order?: 'ASC' | 'DESC';
    nulls?: 'FIRST' | 'LAST';
}
export type OrderByClause = OrderBy | OrderBy[];
export interface GroupByClause {
    field: string | string[];
    type?: 'CUBE' | 'ROLLUP';
    having?: ConditionalClause;
}
export type UpdateClause = 'TRACKING' | 'VIEWSTAT';
export type ForClause = 'VIEW' | 'UPDATE' | 'REFERENCE';

// export interface WithDataCategoryClause {
//     conditions: WithDataCategoryCondition[];
// }
// export type GroupSelector = 'ABOVE' | 'AT' | 'BELOW' | 'ABOVE_OR_BELOW';
// export interface WithDataCategoryCondition {
//     groupName: string;
//     selector: GroupSelector;
//     parameters: string[];
// }

// remove 'from' because it will always be set by query builder
export type SOQLQueryParams = Omit<SOQLQuery,'from'>;

export interface SOQLQuery {
    select: string[];
    from: string;
    where?: ConditionalClause;
    groupBy?: GroupByClause;
    orderBy?: OrderByClause;
    for?: ForClause[];
    update?: UpdateClause;
    limit?: number;
    offset?: number;
}

export interface SObjectStatic<T> {
    new(): T;
    API_NAME: string;
    FIELDS: { [K in keyof FieldProps<T>]: SFieldProperties; };
    fromSFObject (sob: SObject): T;
}

/**
 * Generates a typesafe* query using the metadata of the object provided
 *
 * @param from The SObject (generated class static) to generate the query for
 * @param buildQuery A function which accepts a field resolver for the `from` SObject returns the query to build (SOQLQueryParams)
 */
export function buildQuery<T> (from: SObjectStatic<T>, buildQuery: (fields: FieldResolver<T>) => SOQLQueryParams) {
    let fields = new FieldResolver(from);
    let qry = buildQuery(fields);
    return composeSOQLQuery({...qry, ...{from: from.API_NAME}});
}

export function composeSOQLQuery (qry: SOQLQuery): string {
    let { from, select, where, limit, offset, groupBy, orderBy, for: forClause, update } = qry;

    let ret = `SELECT ${select.join(', ')} FROM ${from}`;
    if (where) {
        ret += ` WHERE ${composeConditionalClause(where)}`;
    }
    if (groupBy) {
        let grouping: string;
        if (Array.isArray(groupBy.field)) {
            grouping = groupBy.field.join(', ');
        } else {
            grouping = groupBy.field;
        }
        if (groupBy.type) {
            grouping = `${groupBy.type}(${grouping})`;
        }
        ret += ` GROUP BY ${grouping}`;
        if (groupBy.having) {
            ret += ` HAVING ${composeConditionalClause(groupBy.having)}`;
        }
    }

    if (orderBy) {
        let orderByClause: OrderBy[];
        if (Array.isArray(orderBy)) {
            orderByClause = orderBy;
        } else {
            orderByClause = [orderBy];
        }
        let orderings = orderByClause.map(o => `${o.field}${o.order ? ' ' + o.order : ''}${o.nulls ? ` NULLS ${o.nulls}` : ''}`);
        ret += ` ORDER BY ${orderings.join(', ')}`;
    }

    if (limit) {
        ret += ` LIMIT ${limit}`;
    }
    if (offset) {
        ret += ` OFFSET ${offset}`;
    }

    // https://salesforce.stackexchange.com/questions/172171/how-to-combine-for-view-and-for-reference
    if (forClause) {
        ret += ` FOR ${forClause}`;
    }

    if (update) {
        ret += ` UPDATE ${update}`;
    }

    // TODO: Add datacategory
    // TODO: update
    // TODO: Type select?
    return ret;
}
