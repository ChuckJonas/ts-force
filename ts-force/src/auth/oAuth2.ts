import Axios from 'axios';

/**
 * Utility Methods to authorize using Salesforce oAuth2 Web-Server flow
 *
 * see: https://help.salesforce.com/articleView?id=remoteaccess_oauth_web_server_flow.htm&type=5
 **/

export interface AuthorizationParams {

  /**
   * The OAuth 2.0 grant type that the connected app requests.
   * The value for this flow must be code to indicate that the connected app is requesting an authorization code.
   * */
  response_type?: 'code';

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
  prompt?: 'login' | 'consent' | 'select_account' | ['login consent'];

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
export function getAuthorizationUrl(instanceUrl: string, opts: AuthorizationParams) {

  //defaults
  opts = { ...{ response_type: 'code' }, ...opts };

  const params = Object.keys(opts).map(key => {
    let value = opts[key];
    if (Array.isArray(value)) {
      value = value.join(' ');
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return `${instanceUrl}/services/oauth2/authorize?${params.join('&')}`;
}

export interface TokenResponse {
  access_token: string;
  signature: string;
  scope: string;
  id_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
}

export interface RequestTokenParam {
  /**
   * A temporary authorization code received from the authorization server.
   * The connected app uses this code in exchange for an access token.
   * This type of OAuth 2.0 flow is a secure way to pass the access token back to the application.
   */
  code: string;

  /**
   * The type of validation that the connected app can provide to prove it's a safe visitor.
   * For the web server flow, the value must be authorization_code.
   */
  grant_type?: 'authorization_code'; //only `web server flow` supported type for now;
  /**
   * The connected app’s consumer key, which you can find on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   */
  client_id: string;
  /**
   * The connected app’s consumer secret, which you can find on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   * This parameter is required unless the connected app doesn’t have Require Secret for Web Server Flow enabled.
   * If a client_secret isn’t required, and the connected app sends it in the authorization request, Salesforce attempts to validate it anyway.
   */
  client_secret: string;
  /**
   * The URL where users are redirected after a successful authentication. The redirect URI must match one of the values in the connected app’s Callback URL field.
   * Otherwise, the approval fails. You can find the redirect URI on the connected app’s Manage Connected Apps page or from the connected app’s definition.
   * This value must be URL encoded.
   */
  redirect_uri: string;
}

/**
 * Retrieves the access token for web-server flow
*/
export async function requestAccessToken(instanceUrl: string, params: RequestTokenParam): Promise<TokenResponse> {
  //defaults
  params = { ...{ grant_type: 'authorization_code' }, ...params };
  const reqParam = toFormData(params as any);

  const resp = await Axios.request({
    url: `${instanceUrl}/services/oauth2/token`, method: 'POST', data: reqParam, headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
  })
  return resp.data;
}


function toFormData(obj: { [key: string]: string }) {
  return Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    })
    .join('&');
}

