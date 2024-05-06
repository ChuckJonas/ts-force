import { AxiosInstance } from "axios";

export interface BaseConfig {
  accessToken: string;
  instanceUrl: string;
  version: number;
  axiosInstance?: AxiosInstance;
}

export const DEFAULT_CONFIG: BaseConfig = {
  version: 58,
  accessToken: "",
  instanceUrl: "",
};

export type ConfigParams = Partial<BaseConfig> & {
  access_token?: string;
  instance_url?: string;
};

/**
 * @param  {ConfigParams} params
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

  if(params.axiosInstance) c.axiosInstance = params.axiosInstance;

  return c;
};
