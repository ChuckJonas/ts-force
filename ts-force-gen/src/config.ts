import { BaseConfig } from '../../ts-force/build';

// Config Types
export interface AuthConfig extends BaseConfig {
    /**
     * If using `sfdx-cli` auth, this is the only property needed to authenticate.
     * Otherwise, supply additional oAuth parameters
     */
    username?: string;
    password?: string;
    oAuthHost?: string;
    clientId?: string;
    clientSecret?: string;
}

export interface Config {
    /**
     * Authentication Method.  Choose one of three:
     * - You can either username/password oAuth configuration
     * - sfdx configuration (`username` only)
     * - `accessToken` & `instanceUrl`
     * See readme for examples.
     */
    auth?: AuthConfig;
    /**
     * The SObjects to generate classes for.  Can either be a string or an `SObjectConfig` object
     */
    sObjects?: (string|SObjectConfig)[];
    /**
     * Flag to generate enums for picklist fields.  Defaulted to false
     */
    generatePicklists?: boolean;
    /**
     * Make picklist fields strongly typed to generated enums. `generatePicklists` must also be `true`
     *  `ALL`: for all picklist fields, regardless of salesforce enforcement
     *  `RESTRICTED`: only on fields where the values are restricted on Salesforce
     */
    enforcePicklistValues?: PicklistRestrictionOptions;
    /**
     * The path to generate files to.
     *   If the destination is a folder, it will generate one file per object.
     *   If the destination is a `.ts` file, a single file will be generated.
     *   If not set, class output will be logged to `stdout`
     */
    outPath?: string;
}

/**
 *  Object used to configure advanced settings on SObject generation
 */
export interface SObjectConfig {
    /**
     *  The Target SObject API name
     */
    apiName: string;
    /**
     *  The generated class name.  If not set, it will be automatically
     *  converted to standard javascript Class convention
     */
    className?: string;
    /**
     *  List of field mappings to override the auto-conversion
     */
    fieldMappings?: FieldMapping[];
    /**
     *  Defaulted to true.  If set to false, names will NOT be auto-coverted to standard javascript conventions
     */
    autoConvertNames?: boolean;
    /**
     * *Overrides Global Setting*
     * Make picklist fields strongly typed to generated enums. `generatePicklists` must also be `true`
     *  `ALL`: for all picklist fields, regardless of salesforce enforcement
     *  `RESTRICTED`: only on fields where the values are restricted on Salesforce
     */
    generatePicklists?: boolean;
    /**
     * *Overrides Global Setting*
     * The path to generate files to.
     *   If the destination is a folder, it will generate one file per object.
     *   If the destination is a `.ts` file, a single file will be generated.
     *   If not set, class output will be logged to `stdout`
     */
    enforcePicklistValues?: PicklistRestrictionOptions;
}

export type PicklistRestrictionOptions = false | 'ALL' | 'RESTRICTED';

export interface FieldMapping {
    /**
     *  The Target SObject API name
     */
    apiName: string;
    /**
     *  The generated class property name
     */
    propName: string;
}
