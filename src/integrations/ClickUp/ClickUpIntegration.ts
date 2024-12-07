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
    async getTokens(code: any): Promise<string> {
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code
        };
        
        const res: axios.AxiosResponse = await axios.post(ClickUpIntegration.tokenUrl, data);

        return res.data.access_token;
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

        const res: axios.AxiosResponse = await axios.get(ClickUpIntegration.userInfoUrl,
            { headers }
        );

        return res.data.user;
    }


    /**
     * Creates new task in the default workspace/list
     * @param param0 expects accessToken, title and description of the task to be created
     * @returns Clickup response
     */
    async createTask({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        const listId: string = await this.getListId(accessToken);

        if(listId === "Error") {
            return "Error";
        }

        // TODO: TAKE OTHER PROPERTIES ALSO, LIKE PRIORITY, ASSIGNEE ETC
        const taskPayload = {
            name: title, 
            description: description
        };
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        const res: axios.AxiosResponse = await axios.post(
            `${ClickUpIntegration.apiUrl}/list/${listId}/task`,
            taskPayload,
            { headers }
        );

        return res.data;
    }
    
    // ##################   HELPER METHODS   ####################
    private async getListId(accessToken: string): Promise<string> {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
    
            const teamsRes: axios.AxiosResponse = await axios.get(
                `${ClickUpIntegration.apiUrl}/team`,
                {
                    headers
                }
            )
            if(!teamsRes.data || !teamsRes.data.teams || teamsRes.data.teams.length == 0) {
                return "No teams found for this access token";
            }
    
            const teamId: string = teamsRes.data.teams[0].id;
            const listRes : axios.AxiosResponse = await axios.get(
                `${ClickUpIntegration.apiUrl}/team/${teamId}/list`,
                {
                    headers
                }
            );
            if (!listRes.data || !listRes.data.lists || listRes.data.lists.length === 0) {
                return 'No lists found for this team';
            }
    
            return listRes.data.lists[0].id;
        } catch(err) {
            console.error(err);

            return "Error";
        }
    }
}