import Axios from 'axios';

/**
 * Utility Methods to authorize using Salesforce oAuth2 Web-Server flow
 *
 * see: https://help.salesforce.com/articleView?id=remoteaccess_oauth_web_server_flow.htm&type=5
 **/

export interface AuthorizationParams {
  /**
   * The protocol + domain that the authorization request should be made against.  Defaults to https://login.salesforce.com
   */
  instanceUrl?: string;

  /**
   * The OAuth 2.0 grant type that the connected app requests.
   * The value for this flow must be code to indicate that the connected app is requesting an authorization code.
   * */
  response_type?: 'code' | 'token' | 'token id_token';

  /**
   * The connected app’s consumer key,
   * which you can find on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   */
  client_id: string;

  /**
   * The URL where users are redirected after a successful authentication.
   * The redirect URI must match one of the values in the connected app’s Callback URL field.
   * Otherwise, the approval fails. You can find the redirect URI on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   * This value must be URL encoded.
   */
  redirect_uri: string;

  /**
   * Permissions that define the type of protected resources a connected app can access.
   * You assign scopes to a connected app when you build it, and they are included with the OAuth tokens during the authorization flow.
   * Enter the scopes to apply to the request as a space-separated list. For valid parameters, see OAuth Scopes:
   * https://help.salesforce.com/articleView?id=remoteaccess_oauth_tokens_scopes.htm&type=5#oauth_scopes
   */
  scope?: string[];

  /**
   * Specifies how the authorization server prompts the user for reauthentication and reapproval. Salesforce supports these values.
   * - `login`: The authorization server must prompt the user for reauthentication, forcing the user to log in again.
   * - `consent`: The authorization server must prompt the user for reapproval before returning information to the client.
   *- `select_account`: If presented, take one of the following actions.
   * If zero or one hint is available and the user is logged in, show the approval page without prompting for login.
   * If zero or one hint is available and the user isn’t logged in, prompt for login.
   * If more than one hint is available, show the account chooser.
   * You can pass login and consent values, separated by a space, to require the user to log in and reauthenticate. For example: `?prompt=login%20consent`
   */
  prompt?: 'login' | 'consent' | 'select_account' | 'login consent';

  /**
   * Any state that the external web service requests to be sent to the callback URL.
   * This value must be URL encoded.
   */
  state?: string;

  /**
   * Boolean value to determine whether the user is prompted for login and approval.
   * The default value is false. If you set this parameter to true, one of these scenarios happens:
   * - If the user is logged in and has previously approved the client’s access, Salesforce skips the approval step.
   * - If the user isn’t logged in or hasn’t previously approved the client’s access, Salesforce immediately terminates with the immediate_unsuccessful error code.
   */
  immediate?: boolean;

  /**
   * Specifies the SHA256 hash value of the code_verifier value in the token request.
   * Set this parameter to help prevent authorization code interception attacks.
   * The value must be base64url-encoded as defined in https://tools.ietf.org/html/rfc4648#section-5.
   *
   * This parameter is required if a code_verifier is specified in the token request.
   *
   * - If the code_challenge value is provided in the authorization request and a code_verifier value is provided in the token request, Salesforce compares the code_challenge to the code_verifier. If the code_challenge is invalid or doesn’t match, the login fails with the invalid_request error code.
   * - If the code_challenge value is provided in the authorization request, but a code_verifier value isn’t provided in the token request, the login fails with the invalid_grant error code.
   */
  code_challenge?: string;

  /**
   * Changes the display type of the login and authorization pages. Salesforce supports these values.
   * - `page`: Full-page authorization screen (default).
   * - `popup`: Compact dialog optimized for modern web browser popup windows.
   * -`touch`: Mobile optimized dialog designed for modern mobile devices, such as Android and iPhone.
   * -`mobile`: Mobile-optimized dialog designed for less capable devices, such as BlackBerry OS 5.
   */
  display?: 'page' | 'popup' | 'touch' | 'mobile';

  /**
   * Provides a valid username value to pre-populate the login page with the username, such as login_hint=username@company.com.
   * If a user already has an active session in the browser, the login_hint parameter does nothing, and the active user session continues.
   */
  login_hint?: string;
}


/**
 * Generates the URL to initiate the OAuth 2.0 web server flow,
*/
export function getAuthorizationUrl(opts: AuthorizationParams) {

  //set defaults
  opts = { ...{instanceUrl:'https://login.salesforce.com',  response_type: 'code' }, ...opts };

  const {instanceUrl, ...uriParams} = opts;

  const params = Object.keys(uriParams).map(key => {
    let value = uriParams[key];
    if (Array.isArray(value)) {
      value = value.join(' ');
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return `${instanceUrl}/services/oauth2/authorize?${params.join('&')}`;
}

interface BaseTokenRequest {
  /**
   * The protocol + domain that the authorization request should be made against.  Defaults to https://login.salesforce.com
   */
  instanceUrl?: string;

  /**
   * The connected app’s consumer key, which you can find on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   */
  client_id: string;

  /**
   * The connected app’s consumer secret, which you can find on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   * This parameter is required unless the connected app doesn’t have Require Secret for Web Server Flow enabled.
   * If a client_secret isn’t required, and the connected app sends it in the authorization request, Salesforce attempts to validate it anyway.
   */
  client_secret?: string;

}

export interface WebServerTokenParam extends BaseTokenRequest {
  /**
   * A temporary authorization code received from the authorization server.
   * The connected app uses this code in exchange for an access token.
   * This type of OAuth 2.0 flow is a secure way to pass the access token back to the application.
   */
  code: string;

  grant_type?: 'authorization_code';

  /**
   * The URL where users are redirected after a successful authentication. The redirect URI must match one of the values in the connected app’s Callback URL field.
   * Otherwise, the approval fails. You can find the redirect URI on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   * This value must be URL encoded.
   */
  redirect_uri: string;
}

/**
 * Params of oAuth Username/Password flow
 * https://help.salesforce.com/articleView?id=remoteaccess_oauth_username_password_flow.htm&type=5 */
export interface UsernamePasswordTokenFlow extends BaseTokenRequest {

  grant_type: 'password';

  /** The username of the user that the connected app is imitating. */
  username: string;

  /** The password of the user that the connected app is imitating. */
  password: string;

  /**
   * If not included in the request’s header, you can specify the expected return format.
   * The format parameter takes precedence over the request’s header. The following formats are supported.
   *
   *   - urlencoded
   *   - json (default)
   *   - xml
   */
  format?: string;
}

/**
 * Params of oAuth Username/Password flow
 * https://help.salesforce.com/articleView?id=remoteaccess_oauth_username_password_flow.htm&type=5 */
 export interface RefreshTokenFlow extends BaseTokenRequest {

  grant_type: 'refresh_token';

  /** The username of the user that the connected app is imitating. */
  refresh_token: string;

  /**
   * If not included in the request’s header, you can specify the expected return format.
   * The format parameter takes precedence over the request’s header. The following formats are supported.
   *
   *   - urlencoded
   *   - json (default)
   *   - xml
   */
  format?: string;

  /**
   * Instead of passing a client_secret, you can provide a client_assertion and client_assertion_type.
   * If a client_secret parameter isn’t provided, Salesforce checks for the client_assertion and client_assertion_type.
   * See Use client_assertion Instead of client_secret.
   */
  client_assertion?: string;

  /**
   * Provide this value when using the client_assertion parameter.
   * The value of client_assertion_type must be urn:ietf:params:oauth:client-assertion-type:jwt-bearer.
   */
  client_assertion_type?: string;
}

export interface JWTTokenRequest {
  instanceUrl: string;

  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer';

  /** The assertion is the entire JWT value. */
  assertion: string;
}

export interface ClientCredentialsRequest extends BaseTokenRequest {
  instanceUrl: string;

  grant_type: 'client_credentials';

  client_secret: string;
}

export interface TokenResponse {
  /**
   * OAuth token that a connected app uses to request access to a protected resource on behalf of the client application.
   * Additional permissions in the form of scopes can accompany the access token. */
  access_token: string;

  /**
   * A URL indicating the instance of the user’s org. For example: https://yourInstance.salesforce.com/.
   */
  instance_url: string;

  /**
   * Base64-encoded HMAC-SHA256 signature signed with the client_secret.
   * The signature can include the concatenated ID and issued_at value, which you can use to verify that the identity URL hasn’t changed since the server sent it.
   */
  signature: string;


  /**
   * Identity URL that can be used to identify the user and to query for more information about the user. See Identity URLs.
   */
  id: string;

  /**
   * A Bearer token type, which is used for all responses that include an access token.
   */
  token_type: string;

  /**
   * Time stamp of when the signature was created in milliseconds.
  */
  issued_at: string;

  /**
   * Token that a connected app uses to obtain new access tokens (sessions).
   * This value is a secret. Take appropriate measures to protect it.
   */
  refresh_token?: string;

  /**
   * A space-separated list of scopes values.
   */
  scope?: string;

  /**
   * A signed data structure that contains authenticated user attributes, including a unique identifier for the user and a time stamp indicating when the token was issued. It also identifies the requesting client app. See OpenID Connect specifications.
   *  This parameter is returned if the scope parameter includes openid.
   */
  id_token?: string;

  /**
   * The state requested by the client.
   * This value is included only if the state parameter is included in the original query string.
   */
  state?: string;

  /**
   * If the user is a member of a Salesforce community, the community URL is provided.
   */
  sfdc_community_url?: string;

  /**
   * If the user is a member of a Salesforce community, the user’s community ID is provided.
   */
  sfdc_community_id?: string;

}

/**
 * Retrieves the access token
*/
export async function requestAccessToken(params: WebServerTokenParam | UsernamePasswordTokenFlow | RefreshTokenFlow | JWTTokenRequest | ClientCredentialsRequest): Promise<TokenResponse> {
  //defaults
  params = { ...{ grant_type: 'authorization_code' }, ...params };
  const {instanceUrl, ...bodyParams} = params;
  const reqParam = toFormData(bodyParams as any);

  const resp = await Axios.request({
    url: `${instanceUrl}/services/oauth2/token`, method: 'POST', data: reqParam, headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
  })
  return resp.data;
}

export


function toFormData(obj: { [key: string]: string }) {
  return Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    })
    .join('&');
}

