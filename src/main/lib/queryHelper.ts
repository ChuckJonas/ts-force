import { SFieldProperties } from './sObjectDecorators';

export const generateSelect = (fields: (string|SFieldProperties)[], relationships?: (string|SFieldProperties)|(string|SFieldProperties)[]): string => {
    fields = fields.filter(f => typeof f === 'string' ? true : !f.reference); // get rid of any relationship fields as they are not valid
    let fieldNames = fields.map(f => typeof f === 'string' ? f : f.apiName);
    if (relationships) {
      let relationshipName;
      if (relationships instanceof Array) {
        relationshipName = relationships.map(f => typeof f === 'string' ? f : f.apiName).join('.');
      }else {
        relationshipName = typeof relationships === 'string' ? relationships : relationships.apiName;
      }
      fieldNames = fieldNames.map((f) => `${relationshipName}.${f}`);
    }
    return fieldNames.join(', ');
  };

  export const generateInValues = <T>(objs: T[], valueSelector?: (obj: T) => string) => {
    let values;
    if (valueSelector) {
        values = objs.map(valueSelector);
    }else {
        values = objs;
    }
    // unique,map,join
    return values.filter((item, i, ar) => ar.indexOf(item) === i).map(v => `'${v}'`).join(', ');
  };
