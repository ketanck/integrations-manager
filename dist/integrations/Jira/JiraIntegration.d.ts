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
     * @returns access_token, expires_in and scope
     */
    getTokens(code: string): Promise<any>;
    /**
     * Fetches user information from Jira
     * @param accessToken expects access tokn provided by Jira
     * @returns Jira response
     */
    fetchUserInfo(accessToken: string): Promise<any>;
    /**
     * Creates new task in the default project
     * @param param0 expects accessToken, summary and description of the task to be created
     * @returns Jira response
     */
    createTask({ accessToken, summary, description }: {
        accessToken: string;
        summary: string;
        description: string;
    }): Promise<any>;
    private getCloudId;
    private getProjectKey;
    private parseScopes;
}
