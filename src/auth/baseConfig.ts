
export interface BaseConfig {
    accessToken?: string;
    instanceUrl?: string;
    version?: number;
}

export const DEFAULT_CONFIG: BaseConfig = { version: 42 };

/**
 * @param  {BaseConfig} config
 */
export const setDefaultConfig = (config: BaseConfig) => {
    DEFAULT_CONFIG.version = config.version;
    DEFAULT_CONFIG.instanceUrl = config.instanceUrl;
    DEFAULT_CONFIG.accessToken = config.accessToken;
};
