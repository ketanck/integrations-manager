import { URL, URLSearchParams } from 'url';
import { IntegrationInterface } from "../../core/IntegrationInterface";
import axios from 'axios';
import { LinearInterface } from './interface/LinearInterface';
import { LinearClient, Team, TeamConnection, User } from '@linear/sdk';

// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
export class LinearIntegration implements LinearInterface {
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;

    private static readonly authUrl: string = "https://linear.app/oauth/authorize";
    private static readonly tokenUrl: string = "https://api.linear.app/oauth/token";
    private static readonly endpoint: string = "https://api.linear.app/graphql";

    constructor({clientId, clientSecret, redirectUrl}: {clientId: string, clientSecret: string, redirectUrl: string}) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }
    
    
    /**
     * Send user to authorization screen so that he/she can grant access
     * @param scopes comma(,) seperated list of scopes
     * @returns url string to which user should be redirected
     */
    authorize(scopes: string): string {
        const url: URL = new URL(LinearIntegration.authUrl);
        
        const params: URLSearchParams = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            response_type: "code",
            scope: scopes        
        });
        url.search = params.toString();
    
        return url.toString();
    }


    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by Linear when user grants access
     * @returns access token and releavant information
     */
    async getTokens(code: string): Promise<any> {
        const data = {
            code: code,
            redirect_uri: this.redirectUrl,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "authorization_code"
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const res: axios.AxiosResponse = await axios.post(LinearIntegration.tokenUrl,
            data,
            { headers }
        );

        const { access_token, token_type, expires_in, scope } = res.data;
        
        // DEFINE A TYPE/INTERFACE AND RETURN THIS DATA
        return { access_token, token_type, expires_in, scope };
    }


    /**
     * Fetches User information from Linear
     * @param accessToken needs access token provided by Linear
     * @returns Linear User model
     */
    async fetchUserInfo(accessToken: string): Promise<User> {
        const client: LinearClient = new LinearClient({accessToken});

        const user: User = await client.viewer;
        
        return user;
    }


    /**
     * Creates new issue/task in Linear in default/first team
     * @param param0 accessToken, title, description needed to create new issue/task
     * @returns response of Linear
     */
    async createTask({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        const user: User = await this.fetchUserInfo(accessToken);

        const teams: Team[] = (await user.teams()).nodes;
        const teamId: string = teams[0].id;

        const query: string = `
                  mutation {
                    issueCreate(input: {
                      title: "${title}",
                      description: "${description || ""}",
                      teamId: "${teamId}"
                    }) {
                      success
                      issue {
                        id
                        title
                        description
                      }
                    }
                  }
                `;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };

        const res: axios.AxiosResponse = await axios.post(LinearIntegration.endpoint,
            { query },
            { headers }
        );

        return res.data;
    }


    // getTasks(): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }

    // updateTask(): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }

    // deleteTask(): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }
    
}