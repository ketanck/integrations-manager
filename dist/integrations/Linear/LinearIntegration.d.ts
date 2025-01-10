import { LinearInterface } from './interface/LinearInterface';
export declare class LinearIntegration implements LinearInterface {
    private clientId;
    private clientSecret;
    private redirectUrl;
    private static readonly authUrl;
    private static readonly tokenUrl;
    private static readonly tokenRevokeUrl;
    private static readonly endpoint;
    constructor({ clientId, clientSecret, redirectUrl }: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
    });
    /**
     * Send user to authorization screen so that he/she can grant access
     * @param scopes comma(,) seperated list of scopes
     * @returns url string to which user should be redirected
     */
    authorize(scopes: string): string;
    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by Linear when user grants access
     * @returns access token and releavant information
     */
    getTokens(code: string): Promise<any>;
    /**
     * Revokes Linear access token
     * @param accessToken needs access token provided by Linear
     * @returns Linear response
     */
    revokeAuthToken(accessToken: string): Promise<any>;
    /**
     * Fetches User information from Linear
     * @param accessToken needs access token provided by Linear
     * @returns Linear User model
     */
    fetchUserInfo(accessToken: string): Promise<any>;
    /**
     * Fetches all the teams, user is part of
     * @param accessToken needs access token provided by Linear
     * @returns list of linear teams
     */
    fetchAllTeams(accessToken: string): Promise<any>;
    /**
     * Creates new issue/task in Linear in default/first team
     * @param param0 accessToken, title, description needed to create new issue/task
     * @returns response of Linear
     */
    createTask({ accessToken, title, description, teamId }: {
        accessToken: string;
        title: string;
        description: string;
        teamId: string;
    }): Promise<any>;
}
