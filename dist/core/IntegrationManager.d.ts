import { User } from "@linear/sdk";
import { ClickUpIntegration } from "../integrations/ClickUp/ClickUpIntegration";
import { JiraIntegration } from "../integrations/Jira/JiraIntegration";
import { LinearIntegration } from "../integrations/Linear/LinearIntegration";
export declare class IntegrationManager {
    private linear?;
    private clickup?;
    private jira?;
    constructor({ linear, clickup, jira }: {
        linear?: LinearIntegration;
        clickup?: ClickUpIntegration;
        jira?: JiraIntegration;
    });
    getLinearAuthorizationUrl(scopes: string): string;
    getClickUpAuthorizationUrl(): string;
    getJiraAuthorizationUrl(scopes: string): string;
    getLinearAccessToken(code: string): Promise<any>;
    getCickUpAccessToken(code: string): Promise<any>;
    getJiraAccessToken(code: string): Promise<any>;
    linearUser(accessToken: string): Promise<User>;
    clickUpUser(accessToken: string): Promise<any>;
    jiraUser(accessToken: string): Promise<any>;
    createTaskOnLinear({ accessToken, title, description }: {
        accessToken: string;
        title: string;
        description: string;
    }): Promise<any>;
    createTaskOnClickUp({ accessToken, title, description }: {
        accessToken: string;
        title: string;
        description: string;
    }): Promise<any>;
    createTaskOnJira({ accessToken, summary, description }: {
        accessToken: string;
        summary: string;
        description: string;
    }): Promise<any>;
}
