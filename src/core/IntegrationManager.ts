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

    constructor({linear, clickup, jira } : { linear?: LinearIntegration, clickup?: ClickUpIntegration, jira?: JiraIntegration }) {
        if(linear)      { this.linear = linear; }
        if(clickup)     { this.clickup = clickup; }
        if(jira)        { this.jira = jira; }
    }
    
    
    // #####################   AUTHORIZATION LINK   ########################
    getLinearAuthorizationUrl(scopes: string): string {
        return this.linear?.authorize(scopes) ?? "Linear Integration not added";
    }

    getClickUpAuthorizationUrl(): string {
        return this.clickup?.authorize() ?? "ClickUp Integration not added";
    }

    getJiraAuthorizationUrl(scopes: string){
        return this.jira?.authorize(scopes) ?? "Jira Integration not added";
    }


    // ####################   GET ACCESS TOKEN   ########################
    async getLinearAccessToken(code: string): Promise<any> {
        return await this.linear?.getTokens(code);
    }

    async getCickUpAccessToken(code: string): Promise<any> {
        return await this.clickup?.getTokens(code);
    }

    async getJiraAccessToken(code: string): Promise<any> {
        return await this.jira?.getTokens(code);
    }


    // ###################   FETCH USER INFO   ###################
    async linearUser(accessToken: string): Promise<User>{
        return await this.linear?.fetchUserInfo(accessToken)!;
    }

    async clickUpUser(accessToken: string): Promise<any> {
        return await this.clickup?.fetchUserInfo(accessToken);
    }

    async jiraUser(accessToken: string): Promise<any> {
        return await this.jira?.fetchUserInfo(accessToken);
    }


    // #####################   CREATE NEW TASK   ####################
    async createTaskOnLinear({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        return await this.linear?.createTask({ accessToken, title, description });
    }

    async createTaskOnClickUp({ accessToken, title, description }: { accessToken: string, title: string, description: string }): Promise<any> {
        return await this.clickup?.createTask({ accessToken, title, description });
    }

    async createTaskOnJira({ accessToken, summary, description }: { accessToken: string, summary: string, description: string }): Promise<any> {
        return await this.jira?.createTask({ accessToken, summary, description });
    }
}