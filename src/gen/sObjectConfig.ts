export interface SObjectConfig {
    apiName: string;
    fieldMappings?: FieldMapping[];
    autoConvertNames?: boolean;
}

export interface FieldMapping {
    apiName: string;
    propName: string;
}
