export interface BaseConfig {
  accessToken: string;
  instanceUrl: string;
  version: number;
}

export const DEFAULT_CONFIG: BaseConfig = {
  version: 50,
  accessToken: "",
  instanceUrl: "",
};

export type ConfigParams = Partial<BaseConfig> & {
  access_token?: string;
  instance_url?: string;
};

/**
 * @param  {BaseConfig} config
 */
export const setDefaultConfig = (params: ConfigParams) => {
  createConfig(params, DEFAULT_CONFIG);
};

export const createConfig = (params: ConfigParams, config?: BaseConfig) => {
  const c: BaseConfig = config
    ? config
    : { version: 50, accessToken: "", instanceUrl: "" };
  c.version = params.version || c.version;
  c.instanceUrl =
    params.instanceUrl !== undefined
      ? params.instanceUrl
      : params.instance_url || "";
  c.accessToken =
    params.accessToken !== undefined
      ? params.accessToken
      : params.access_token || "";
  return c;
};
