import { JiraInterface } from "./interface/JiraInterface";
export declare class JiraIntegration implements JiraInterface {
    private clientId;
    private clientSecret;
    private redirectUrl;
    private static readonly authUrl;
    private static readonly tokenUrl;
    private static readonly baseUrl;
    private static readonly cloudIdUrl;
    private static readonly apiUrl;
    constructor({ clientId, clientSecret, redirectUrl }: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
    });
    /**
     * Get Jira authorization url, expects scopes as arguments
     * @param scopes space-seperated scopes of the data/permissions you need access to
     * @returns url string to which user should be redirected
     */
    authorize(scopes: string): string;
    /**
     * Get access token and other relevant data by passing in auth code
     * @param code authorization code returned by Jira
     * @returns access_token, expires_in, token_type and scope (and refresh_token)
     */
    getTokens(code: string): Promise<any>;
    /**
     * Revoke Jira access token
     * @param accessToken Jira access token
     * @returns Jira response
     */
    revokeAuthToken(accessToken: string): Promise<any>;
    /**
     * Get new access token by passing in refresh token
     * @param refreshToken refresh token provided by Jira
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    refreshToken(refreshToken: string): Promise<any>;
    /**
     * Fetches user information from Jira
     * @param accessToken expects access tokn provided by Jira
     * @returns Jira response
     */
    fetchUserInfo(accessToken: string): Promise<any>;
    fetchAllProjects(accessToken: string, cloudId: string): Promise<any>;
    fetchCloudId(accessToken: string): Promise<any>;
    /**
     * Creates new task in the default project
     * @param param0 expects accessToken, summary and description of the task to be created
     * @returns Jira response
     */
    createTask({ accessToken, summary, description, cloudId, projectKey }: {
        accessToken: string;
        summary: string;
        description: string;
        cloudId: string;
        projectKey: string;
    }): Promise<any>;
}
