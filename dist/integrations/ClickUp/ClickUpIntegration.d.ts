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
    getTokens(code: any): Promise<string>;
    /**
     * Fetches User information from ClickUp
     * @param accessToken needs access token provided by ClickUp
     * @returns ClickUp response
     */
    fetchUserInfo(accessToken: string): Promise<any>;
    /**
     * Creates new task in the default workspace/list
     * @param param0 expects accessToken, title and description of the task to be created
     * @returns Clickup response
     */
    createTask({ accessToken, title, description }: {
        accessToken: string;
        title: string;
        description: string;
    }): Promise<any>;
    private getListId;
}
