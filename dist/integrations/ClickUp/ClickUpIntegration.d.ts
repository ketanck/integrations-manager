import { ClickUpInterface } from "./interface/ClickUpInterface";
export declare class ClickUpIntegration implements ClickUpInterface {
    private clientId;
    private clientSecret;
    private redirectUrl;
    private static readonly authUrl;
    private static readonly tokenUrl;
    private static readonly userInfoUrl;
    private static readonly apiUrl;
    constructor({ clientId, clientSecret, redirectUrl }: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
    });
    /**
     * Get ClickUp authorization url, expects no argumments
     * @returns url string to which user should be redirected
     */
    authorize(): string;
    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by ClickUp when user grants access
     * @returns access token
     */
    getTokens(code: any): Promise<any>;
    /**
     * Fetches User information from ClickUp
     * @param accessToken needs access token provided by ClickUp
     * @returns ClickUp response
     */
    fetchUserInfo(accessToken: string): Promise<any>;
    /**
     * Fetches all the teams associated with the user
     * @param accessToken expects Clickup access token
     * @returns clickup response
     */
    fetchAllTeams(accessToken: string): Promise<any>;
    /**
     * Fetches all the lists associated with the user in a team
     * @param accessToken expects Clickup access token
     * @param teamId expects user teamId
     * @returns clickup response
     */
    fetchAllLists(accessToken: string, teamId: string): Promise<any>;
    /**
     * Creates new task in the default workspace/list
     * @param param0 expects accessToken, title and description of the task to be created
     * @returns Clickup response
     */
    createTask({ accessToken, title, description, listId }: {
        accessToken: string;
        title: string;
        description: string;
        listId: string;
    }): Promise<any>;
}
