import { User } from "@linear/sdk";
import { ClickUpIntegration } from "../integrations/ClickUp/ClickUpIntegration";
import { JiraIntegration } from "../integrations/Jira/JiraIntegration";
import { LinearIntegration } from "../integrations/Linear/LinearIntegration";

enum Platforms {
    linear,
    clickup
}

export class IntegrationManager {
    // TODO: GETTERS & SETTERS
    private linear?: LinearIntegration;
    private clickup? : ClickUpIntegration;
    private jira? : JiraIntegration;

    /**
     * @param param0 expects LinearIntegration, ClickUpIntegration and JiraIntegration objects, all are optional
     */
    constructor({linear, clickup, jira } : { linear?: LinearIntegration, clickup?: ClickUpIntegration, jira?: JiraIntegration }) {
        if(linear)      { this.linear = linear; }
        if(clickup)     { this.clickup = clickup; }
        if(jira)        { this.jira = jira; }
    }
    
    
    // #####################   AUTHORIZATION LINK   ########################
    /**
     * get Linear auth url
     * @param scopes expects comma(,) seperated scopes without space
     * @returns auth url user should to redirected to
     */
    getLinearAuthorizationUrl(scopes: string): string {
        return this.linear?.authorize(scopes) ?? "Linear Integration not added";
    }


    /**
     * get ClickUp auth url, expects no args
     * @returns auth url user should to redirected to
     */
    getClickUpAuthorizationUrl(): string {
        return this.clickup?.authorize() ?? "ClickUp Integration not added";
    }


    /**
     * get Jira auth url
     * @param scopes expects space seperated jira scopes
     * @returns auth url user should to redirected to
     */
    getJiraAuthorizationUrl(scopes: string){
        return this.jira?.authorize(scopes) ?? "Jira Integration not added";
    }


    // ####################   GET ACCESS TOKEN   ########################
    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns access_token, token_type, expires_in, scope 
     */
    async getLinearAccessToken(code: string): Promise<any> {
        return await this.linear?.getTokens(code);
    }

    /**
     * Signin user and get access token
     * @param code axpects auth code, you get from url
     * @returns access_token
     */
    async getClickUpAccessToken(code: string): Promise<string> {
        return await this.clickup?.getTokens(code) ?? "";
    }

    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns access_token, expires_in and scope
     */
    async getJiraAccessToken(code: string): Promise<any> {
        return await this.jira?.getTokens(code);
    }


    // ###################   FETCH USER INFO   ###################
    /**
     * Fetch user info from Linear
     * @param accessToken expects accessToken as argument
     * @returns User model returned by linear
     */
    async linearUser(accessToken: string): Promise<User>{
        return await this.linear?.fetchUserInfo(accessToken)!;
    }


    /**
     * Fetch user info from ClickUp
     * @param accessToken expects accessToken as argument
     * @returns user info returned by clickup
     */
    async clickUpUser(accessToken: string): Promise<any> {
        return await this.clickup?.fetchUserInfo(accessToken);
    }


    /**
     * Fetch user info from jira
     * @param accessToken expects accessToken as argument
     * @returns user info returned by jira
     */
    async jiraUser(accessToken: string): Promise<any> {
        return await this.jira?.fetchUserInfo(accessToken);
    }


    // #####################   REFRESH TOKEN   ####################
    /**
     * Refresh Linear access token
     * @param refreshToken expects refresh token to get new access token
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    async refreshJiraToken(refreshToken: string): Promise<any> {
        return await this.jira?.refreshToken(refreshToken) ?? "";
    }

    // #####################   CREATE NEW TASK   ####################
    /**
     * Create new task on Linear
     * @param param0 expects accessToken, title and description to create task on linear
     * @returns linear response
     */
    async createTaskOnLinear({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        return await this.linear?.createTask({ accessToken, title, description });
    }

    /**
     * Create new task on ClickUp
     * @param param0 expects accessToken, title and description to create task on clickup
     * @returns clickup response
     */
    async createTaskOnClickUp({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        return await this.clickup?.createTask({ accessToken, title, description });
    }


    /**
     * Create new task on Jira
     * @param param0 expects accessToken, title and description to create task on jira
     * @returns jira response
     */
    async createTaskOnJira({ accessToken, summary, description }: { accessToken: string, summary: string, description: string }): Promise<any> {
        return await this.jira?.createTask({ accessToken, summary, description });
    }
}