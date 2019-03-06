 // Get Rest Configs through oauth
import axios, { AxiosError, AxiosInstance } from 'axios';
import * as qs from 'qs';
import { BaseConfig } from './baseConfig';

export interface OAuthRequestBody {
  client_id: string;
  client_secret: string;
  grant_type: string;
}
export interface PasswordRequestBody extends OAuthRequestBody {
  username: string;
  password: string;
}
export interface RefreshTokenRequestBody extends OAuthRequestBody {
  refresh_token: string;
}
export abstract class AuthConfig {
  public clientId: string;
  public clientSecret: string;
  public host: string;
  public grantType: string;
  constructor (clientId: string, clientSecret: string, host: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.host = host;
  }
  abstract reqBody (): OAuthRequestBody;
  public baseBody (): OAuthRequestBody {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: this.grantType
    };
  }
}
export class UsernamePasswordConfig extends AuthConfig {
  public username: string;
  public password: string;
  constructor (clientId: string, clientSecret: string, host: string, username: string, password: string) {
    super(clientId, clientSecret, host);
    this.username = username;
    this.password = password;
    this.grantType = 'password';
  }
  public reqBody (): PasswordRequestBody {
    // Object spred notation for the win!
    return {...this.baseBody(), username: this.username, password: this.password};
  }
}
export class RefreshTokenConfig extends AuthConfig {
  refreshToken: string;
  constructor (clientId: string, clientSecret: string, host: string, refreshToken: string) {
    super(clientId, clientSecret, host);
    this.refreshToken = refreshToken;
    this.grantType = 'refresh_token';
  }
  public reqBody (): RefreshTokenRequestBody {
    // Object spred notation for the win!
    return {...this.baseBody(), refresh_token: this.refreshToken};
  }
}

// enable all auth types
export type AuthTypes = UsernamePasswordConfig | RefreshTokenConfig;

export class OAuth implements BaseConfig {
  public accessToken: string;
  public instanceUrl: string;

  private config: AuthTypes;
  private request: AxiosInstance;

  constructor (config: AuthTypes) {
    this.config = config;
    this.request = axios.create({
      baseURL: `${this.config.host}/services/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  public async initialize (): Promise<OAuth> {
    try {
        const res = await this.request.post('', qs.stringify(this.config.reqBody()));
        this.accessToken = res.data.access_token;
        this.instanceUrl = res.data.instance_url;
        return this;
    }catch (e) {
        throw e;
    }
  }
}
