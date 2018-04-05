import { SFieldProperties } from 'src/main/lib/sObjectDecorators';

export const generateSelect = (fields: (string|SFieldProperties)[], relationships?: (string|SFieldProperties)|(string|SFieldProperties)[]): string => {
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
