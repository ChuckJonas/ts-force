import { SFieldProperties } from './sObjectDecorators';

/**
 * @deprecated: Use buildQuery() instead
 * Helper for generating field strings for SELECT clauses
 * @param  {(string|SFieldProperties)[]} fields 1 or more fields to add to select
 * @param  {(string|SFieldProperties)|(string|SFieldProperties} relationships? 0 or more relationships to append to each field.
 * @returns string of formatted fields to use in SELECT clause.  eg: `Parent1__.Id, Parent__r.Name`
 */
export const generateSelect = (fields: (string|SFieldProperties)[], relationships?: (string|SFieldProperties)|(string|SFieldProperties)[]): string => {
    fields = fields.filter(f => typeof f === 'string' ? true : !f.reference); // get rid of any relationship fields as they are not valid
    let fieldNames = fields.map(f => typeof f === 'string' ? f : f.apiName);
    if (relationships) {
      let relationshipName: string;
      if (relationships instanceof Array) {
        relationshipName = relationships.map(f => typeof f === 'string' ? f : f.apiName).join('.');
      }else {
        relationshipName = typeof relationships === 'string' ? relationships : relationships.apiName;
      }
      fieldNames = fieldNames.map((f) => `${relationshipName}.${f}`);
    }
    return fieldNames.join(', ');
  };

  /**
   * @deprecated: Use buildQuery() instead
   * Helper for generating the value portion of an IN (value) SOQL clause
   * @param  {T[]} objs Objects with values to operation on
   * @param  {(obj:T)=>string} valueSelector? optional function that will select the value.  If blank the object itself will be use
   * @returns string formatted for a select values. eg: `'abc','123'`
   */
  export const generateInValues = <T>(objs: T[], valueSelector?: (obj: T) => string) => {
    let values: any[];
    if (valueSelector) {
        values = objs.map(valueSelector);
    }else {
        values = objs;
    }
    // unique,map,join
    return values.filter((item, i, ar) => ar.indexOf(item) === i).map(v => `'${v}'`).join(', ');
  };
