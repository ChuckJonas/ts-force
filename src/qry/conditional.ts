import * as dateformat from 'dateformat';

export type Operator = '=' | '!=' | '<=' | '>=' | '>' | '<' | 'LIKE' | 'IN' | 'NOT IN' | 'INCLUDES' | 'EXCLUDES';
export type LogicalOperator = 'AND' | 'OR';
export type Value = string | number | boolean | Date | string[];
export type BaseCondition = { field: string, op: Operator, not?: boolean, formatter?: (d: Value) => string | string[] };
export type PrimitiveConditionParams = { val: Value } & BaseCondition;
export type SubQueryConditionParams = { subqry: string } & BaseCondition;
export type ConditionParams = PrimitiveConditionParams | SubQueryConditionParams;
export interface ConditionsList extends Array<Conditions> { }
export type Conditions = ConditionParams | LogicalOperator | ConditionsList;

export interface ConditionalClause extends Array<Conditions> { }

export function composeConditionalClause (where: ConditionalClause): string {
    let ret: string = '';
    where.forEach(c => {
        if (isCondition(c)) {
            let cond = composeConditional(c);
            if (ret.length && !(ret.endsWith('AND ') || ret.endsWith('OR '))) {
                ret += ' AND ';
            }
            ret += cond;
        } else if (typeof c === 'string') {
            ret += ` ${c} `;
        } else if (Array.isArray(c)) {
            ret += `(${composeConditionalClause(c)})`;
        }
    });
    return ret;
}

function composeConditional (params: ConditionParams) {
    let { field, op: operator, not } = params;
    let val: string | string[];

    if (isSubQueryCondition(params)) {
        val = `(${params.subqry})`;
    } else { // primitive value
        let primVal = params.val;
        if (params.formatter) {
            val = params.formatter(primVal);
        } else { // render defaults
            if (typeof primVal === 'number' || typeof primVal === 'boolean') {
                val = primVal.toString();
            } else if (Array.isArray(primVal)) {
                val = `(${primVal.map(v => `'${v}'`).join(', ')})`;
            } else if (primVal instanceof Date) {
                val = dateformat(primVal, "yyyy-mm-dd'T'hh:MM:ssz");
            } else {
                val = `'${primVal}'`;
            }
        }
    }
    return `${not ? `NOT ` : ''}${field} ${operator} ${val}`;
}

function isCondition (arg: any): arg is ConditionParams {
    return arg.op !== undefined && arg.field !== undefined && (arg.val !== undefined || arg.subqry !== undefined);
}

function isSubQueryCondition (arg: any): arg is SubQueryConditionParams {
    return arg.subqry !== undefined;
}
