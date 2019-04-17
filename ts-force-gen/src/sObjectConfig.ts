export interface SObjectConfig {
    apiName: string;
    className: string;
    fieldMappings?: FieldMapping[];
    autoConvertNames?: boolean;
    generatePicklists?: boolean;
    enforcePicklistValues?: false | 'ALWAYS' | 'RESTRICTED';
}

export interface FieldMapping {
    apiName: string;
    propName: string;
}
