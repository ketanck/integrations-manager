import { URL, URLSearchParams } from "url";
import { ClickUpInterface } from "./interface/ClickUpInterface";
import axios from "axios";

// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
export class ClickUpIntegration implements ClickUpInterface {
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;

    private static readonly authUrl: string = "https://app.clickup.com/api";
    private static readonly tokenUrl: string = "https://api.clickup.com/api/v2/oauth/token";
    private static readonly userInfoUrl: string = "https://api.clickup.com/api/v2/user";
    private static readonly apiUrl: string = "https://api.clickup.com/api/v2";

    constructor({clientId, clientSecret, redirectUrl}: {clientId: string, clientSecret: string, redirectUrl: string}) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }


    /**
     * Get ClickUp authorization url, expects no argumments
     * @returns url string to which user should be redirected
     */
    authorize(): string {
        const url: URL = new URL(ClickUpIntegration.authUrl);

        const params: URLSearchParams = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl
        });
        url.search = params.toString();

        return url.toString();
    }


    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by ClickUp when user grants access
     * @returns access token
     */
    async getTokens(code: any): Promise<any> {
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code
        };

        try {
            const res: axios.AxiosResponse = await axios.post(ClickUpIntegration.tokenUrl, data);
            
            return {
                success: true,
                data: res.data
            };
        } catch (err) {
            console.error("Error " + err);

            return {
                success: false,
                error: err
            }
        }
        // return res.data.access_token;
    }


    /**
     * Fetches User information from ClickUp
     * @param accessToken needs access token provided by ClickUp
     * @returns ClickUp response
     */
    async fetchUserInfo(accessToken: string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        try {
            const res: axios.AxiosResponse = await axios.get(ClickUpIntegration.userInfoUrl,
                { headers }
            );

            return {
                success: true,
                data: res.data
            };
        } catch (err) {
            console.error("Error " + err);

            return {
                success: false,
                error: err
            }
        }
        // return res.data.user;
    }


    /**
     * Fetches all the teams associated with the user
     * @param accessToken expects Clickup access token
     * @returns clickup response
     */
    async fetchAllTeams(accessToken: string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        try {
            const teamsRes: axios.AxiosResponse = await axios.get(
                `${ClickUpIntegration.apiUrl}/team`,
                {
                    headers
                }
            );    

            return {
                success: true,
                data: teamsRes.data
            };
        } catch (err) {
            console.error("Error " + err);

            return {
                success: false,
                error: err
            }
        }
        // return teamsRes.data;
    }


    /**
     * Fetches all the lists associated with the user in a team
     * @param accessToken expects Clickup access token
     * @param teamId expects user teamId
     * @returns clickup response
     */
    async fetchAllLists(accessToken: string, teamId: string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        try {
            const listRes : axios.AxiosResponse = await axios.get(
                `${ClickUpIntegration.apiUrl}/team/${teamId}/list`,
                {
                    headers
                }
            );    

            return {
                success: true,
                data: listRes.data
            };
        } catch (err) {
            console.error("Error " + err);

            return {
                success: false,
                error: err
            }
        }
        // return listRes.data;
    }


    /**
     * Creates new task in the default workspace/list
     * @param param0 expects accessToken, title and description of the task to be created
     * @returns Clickup response
     */
    async createTask({ accessToken, title, description, listId }: { accessToken: string, title: string, description: string, listId: string }): Promise<any> {
        // TODO: TAKE OTHER PROPERTIES ALSO, LIKE PRIORITY, ASSIGNEE ETC
        const taskPayload = {
            name: title, 
            description: description
        };
        
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        try {
            const res: axios.AxiosResponse = await axios.post(
                `${ClickUpIntegration.apiUrl}/list/${listId}/task`,
                taskPayload,
                { headers }
            );

            return {
                success: true,
                data: res.data
            };
        } catch (err) {
            console.error("Error " + err);

            return {
                success: false,
                error: err
            }
        }
        // return res.data;
    }
}