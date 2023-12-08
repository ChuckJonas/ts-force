import { DEFAULT_CONFIG } from '../auth/baseConfig';
import { Rest } from './rest';
import { SalesforceFieldType, sField } from './sObjectDecorators';

export class SObjectAttributes {
  public type: string; // sf apex name
  public url: string; // sf rest API url for record
}

/* Base SObject */
export abstract class SObject {

  @sField({ apiName: 'Id', createable: false, updateable: false, required: false, externalId: false, reference: null, childRelationship: false, salesforceType: SalesforceFieldType.ID })
  public id?: string | null;
  public attributes: SObjectAttributes;
  public __UUID?: symbol;

  constructor(type: string, client?: Rest) {
    const version = client?.version ?? `v${DEFAULT_CONFIG.version.toFixed(1)}`

    this.attributes = new SObjectAttributes();
    this.attributes.type = type;
    this.attributes.url = `/services/data/${version}/sobjects/${this.attributes.type}`;
  }
}
