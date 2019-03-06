export interface SObjectConfig {
    apiName: string;
    className: string
    fieldMappings?: FieldMapping[];
    autoConvertNames?: boolean;
}

export interface FieldMapping {
    apiName: string;
    propName: string;
}
