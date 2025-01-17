import axios, { Axios } from "axios";
import { JiraInterface } from "./interface/JiraInterface";
import { error } from "console";

// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
// TODO: ERROR HANDLING
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
     * @returns access_token, expires_in, token_type and scope (and refresh_token)
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
            "Content-Type": "application/json"
        };
        
        try {
            const res: axios.AxiosResponse = await axios.post(JiraIntegration.tokenUrl,
                data,
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
    }


    /**
     * Revoke Jira access token
     * @param accessToken Jira access token
     * @returns Jira response
     */
    async revokeAuthToken(accessToken: string): Promise<any> {
        try {
            const res = await axios.post(
                `${JiraIntegration.tokenUrl}/revoke`,
                {
                    token: `${accessToken}`,
                    client_id: this.clientId
                },
                { headers: { "Content-Type": "application/json" }, }
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
    }

    /**
     * Get new access token by passing in refresh token
     * @param refreshToken refresh token provided by Jira
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    async refreshToken(refreshToken: string): Promise<any> {
        const data = {
            refresh_token: refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "refresh_token"
        };
        const headers = {
            "Content-Type": "application/json"
        };

        
        try {
            const res: axios.AxiosResponse = await axios.post(JiraIntegration.tokenUrl,
                data,
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
        
        try {
            const res: axios.AxiosResponse = await axios.get(
                `${JiraIntegration.baseUrl}/me`,
                { headers }
            );
            
            return {
                success: true,
                data: res.data
            }
        } catch (err: any) {
            console.error(err);

            if(err.response?.status === 401) {
                console.error("Unauthorized");
                
                return {
                    success: false,
                    message: "Unauthorized",
                    error: err
                }
            } else {
                return {
                    success: false,
                    message: "Internal Server Error",
                    error: err
                };
            }
        }
    }


    async fetchAllProjects(accessToken: string, cloudId: string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        try {
            const res: axios.AxiosResponse = await axios.get(
                `${JiraIntegration.apiUrl}/${cloudId}/rest/api/3/project`,
                { headers }
            );
            
            return {
                success: true,
                data: res.data
            };
        } catch (err: any) {
            console.error(err);

            if(err.response?.status === 401) {
                console.error("Unauthorized");
                
                return {
                    success: false,
                    message: "Unauthorized",
                    error: err
                }
            } else {
                return {
                    success: false,
                    message: "Internal Server Error",
                    error: err
                };
            }
        }
    }


    async fetchCloudId(accessToken:string): Promise<any> {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        try {
            const res: axios.AxiosResponse = await axios.get(
                JiraIntegration.cloudIdUrl,
                { headers }
            );

            return {
                success: true,
                data: res.data
            };
        } catch (err: any) {
            console.error(err);

            if(err.response?.status === 401) {
                console.error("Unauthorized");
                
                return {
                    success: false,
                    message: "Unauthorized",
                    error: err
                }
            } else {
                return {
                    success: false,
                    message: "Internal Server Error",
                    error: err
                };
            }
        }
    }


    /**
     * Creates new task in the default project
     * @param param0 expects accessToken, summary and description of the task to be created
     * @returns Jira response
     */
    async createTask({ accessToken, summary, description, cloudId, projectKey }: { accessToken: string, summary: string, description: string, cloudId: string, projectKey: string }): Promise<any> {
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
        
        try {
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
    
            return {
                success: true,
                data: res.data
            }
        } catch (err: any) {
            console.error(err);

            if(err.response?.status === 401) {
                console.error("Unauthorized");
                
                return {
                    success: false,
                    message: "Unauthorized",
                    error: err
                }
            } else {
                return {
                    success: false,
                    message: "Internal Server Error",
                    error: err
                };
            }
        }
    }
}