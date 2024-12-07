import { LinearInterface } from './interface/LinearInterface';
import { User } from '@linear/sdk';
export declare class LinearIntegration implements LinearInterface {
    private clientId;
    private clientSecret;
    private redirectUrl;
    private static readonly authUrl;
    private static readonly tokenUrl;
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
     * Fetches User information from Linear
     * @param accessToken needs access token provided by Linear
     * @returns Linear User model
     */
    fetchUserInfo(accessToken: string): Promise<User>;
    /**
     * Creates new issue/task in Linear in default/first team
     * @param param0 accessToken, title, description needed to create new issue/task
     * @returns response of Linear
     */
    createTask({ accessToken, title, description }: {
        accessToken: string;
        title: string;
        description: string;
    }): Promise<any>;
}
