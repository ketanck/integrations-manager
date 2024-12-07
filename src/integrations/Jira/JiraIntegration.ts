import axios from "axios";
import { JiraInterface } from "./interface/JiraInterface";

// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
export class JiraIntegration implements JiraInterface {
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;

    private static readonly authUrl: string = "https://auth.atlassian.com/authorize";
    private static readonly tokenUrl: string = "https://auth.atlassian.com/oauth/token";
    private static readonly baseUrl : string = "https://api.atlassian.com";
    private static readonly cloudIdUrl: string = `${this.baseUrl}/oauth/token/accessible-resources`;
    private static readonly apiUrl: string = `${this.baseUrl}/ex/jira`;

    constructor({clientId, clientSecret, redirectUrl}: {clientId: string, clientSecret: string, redirectUrl: string}) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }


    /**
     * Get Jira authorization url, expects scopes as arguments
     * @param scopes space-seperated scopes of the data/permissions you need access to
     * @returns url string to which user should be redirected
     */
    authorize(scopes: string): string {
        // const url: URL = new URL(JiraIntegration.authUrl);
        
        // const params: URLSearchParams = new URLSearchParams({
        //     audience: "api.atlassian.com",
        //     client_id: this.clientId,
        //     redirect_uri: this.redirectUrl,
        //     // scope: scopes,
        //     response_type: "code",
        //     prompt: "consent"
        // });
        // url.search = params.toString();

        return JiraIntegration.authUrl + `?audience=api.atlassian.com&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&scope=${scopes}&response_type=code&prompt=consent`;
    }
    

    /**
     * Get access token and other relevant data by passing in auth code
     * @param code authorization code returned by Jira
     * @returns access_token, expires_in and scope
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
        
        const res: axios.AxiosResponse = await axios.post(JiraIntegration.tokenUrl,
            data,
            { headers }
        );
        
        const { access_token, expires_in, scope } = res.data;
        
        // DEFINE A TYPE/INTERFACE AND RETURN THIS DATA
        return { access_token, expires_in, scope };
    }
    

    /**
     * Fetches user information from Jira
     * @param accessToken expects access tokn provided by Jira
     * @returns Jira response
     */
    async fetchUserInfo(accessToken: string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };
        
        const res: axios.AxiosResponse = await axios.get(
            `${JiraIntegration.baseUrl}/me`,
            { headers }
        );

        return res.data;
    }


    /**
     * Creates new task in the default project
     * @param param0 expects accessToken, summary and description of the task to be created
     * @returns Jira response
     */
    async createTask({ accessToken, summary, description }: { accessToken: string, summary: string, description: string }): Promise<any> {
        const cloudId: string = await this.getCloudId(accessToken);
        console.log("cloud id: " + cloudId);

        const projectKey: string = await this.getProjectKey(accessToken, cloudId);
        console.log("project key: " + projectKey);

        const data = {
            'fields': {
                'project': { 'key': projectKey },
                'summary': summary,
                'description': description,
                'issuetype': { 'name': 'Task' }
            }
        };
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        const res: axios.AxiosResponse = await axios.post(
            `${JiraIntegration.apiUrl}/${cloudId}/rest/api/3/issue`,
            {
                'fields': {
                    'project': { 'key': projectKey },
                    'summary': summary,
                    "description": {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "text": description, 
                                        "type": "text"
                                    }
                                ]
                            }
                        ]
                    },
                    'issuetype': { 'name': 'Task' }
                }
            }, 
            { headers }
        );

        return res.data;
    }
    
    // ###################   HELPER METHODS   #####################
    private async getCloudId(accessToken: string): Promise<string> {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }

        const res: axios.AxiosResponse = await axios.get(
            JiraIntegration.cloudIdUrl,
            { headers }
        );

        return res.data[0].id;
    }

    private async getProjectKey(accessToken: string, cloudId: string): Promise<string> {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        const res: axios.AxiosResponse = await axios.get(
            `${JiraIntegration.apiUrl}/${cloudId}/rest/api/3/project`,
            { headers }
        );

        return res.data[0].key;
    }

    private parseScopes(scopes: string): string {
        const scopesArr: string[] = scopes.split(',');

        let parsedScopes = "";
        for(let i=0; i<scopesArr.length; i++) {
            parsedScopes += scopesArr[i].replace(":", "%3A");
            if(i!=scopesArr.length-1) {
                parsedScopes += "%20";
            }
        }

        return parsedScopes;
    }
}