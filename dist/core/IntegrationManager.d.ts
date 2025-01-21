import { ClickUpIntegration } from "../integrations/ClickUp/ClickUpIntegration";
import { JiraIntegration } from "../integrations/Jira/JiraIntegration";
import { LinearIntegration } from "../integrations/Linear/LinearIntegration";
export declare class IntegrationManager {
    private linear?;
    private clickup?;
    private jira?;
    /**
     * @param param0 expects LinearIntegration, ClickUpIntegration and JiraIntegration objects, all are optional
     */
    constructor({ linear, clickup, jira }: {
        linear?: LinearIntegration;
        clickup?: ClickUpIntegration;
        jira?: JiraIntegration;
    });
    /**
     * get Linear auth url
     * @param scopes expects comma(,) seperated scopes without space
     * @returns auth url user should to redirected to
     */
    getLinearAuthorizationUrl(scopes: string): string;
    /**
     * get ClickUp auth url, expects no args
     * @returns auth url user should to redirected to
     */
    getClickUpAuthorizationUrl(): string;
    /**
     * get Jira auth url
     * @param scopes expects space seperated jira scopes
     * @returns auth url user should to redirected to
     */
    getJiraAuthorizationUrl(scopes: string): string;
    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns access_token, token_type, expires_in, scope
     * @returns linear response - access_token, token_type, expires_in, scope
     */
    getLinearAccessToken({ code, redirectUrl }: {
        code: string;
        redirectUrl: string;
    }): Promise<any>;
    /**
     * Signin user and get access token
     * @param code axpects auth code, you get from url
     * @returns clickup response - access_token
     */
    getClickUpAccessToken({ code, redirectUrl }: {
        code: string;
        redirectUrl: string;
    }): Promise<any>;
    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns jira response - access_token, expires_in and scope
     */
    getJiraAccessToken(code: string): Promise<any>;
    /**
     * Fetch user info from Linear
     * @param accessToken expects accessToken as argument
     * @returns User model returned by linear
     */
    linearUser(accessToken: string): Promise<any>;
    /**
     * Fetch user info from ClickUp
     * @param accessToken expects accessToken as argument
     * @returns user info returned by clickup
     */
    clickUpUser(accessToken: string): Promise<any>;
    /**
     * Fetch user info from jira
     * @param accessToken expects accessToken as argument
     * @returns user info returned by jira
     */
    jiraUser(accessToken: string): Promise<any>;
    /**
     * Refresh Jira access token
     * @param refreshToken expects refresh token to get new access token
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    refreshJiraToken(refreshToken: string): Promise<any>;
    /**
     * Revokes Linear access token
     * @param accessToken expects accessToken as argument
     * @returns linear response
     */
    revokeLinearToken(accessToken: string): Promise<any>;
    /**
     * Revokes Jira access token
     * @param accessToken expects accessToken as argument
     * @returns jira response
     */
    revokeJiraToken(accessToken: string): Promise<any>;
    /**
     * Create new task on Linear
     * @param param0 expects accessToken, title and description to create task on linear
     * @returns linear response
     */
    createTaskOnLinear({ accessToken, title, description, teamId }: {
        accessToken: string;
        title: string;
        description: string;
        teamId: string;
    }): Promise<any>;
    /**
     * Create new task on ClickUp
     * @param param0 expects accessToken, title and description to create task on clickup
     * @returns clickup response
     */
    createTaskOnClickUp({ accessToken, title, description, listId }: {
        accessToken: string;
        title: string;
        description: string;
        listId: string;
    }): Promise<any>;
    /**
     * Create new task on Jira
     * @param param0 expects accessToken, title and description to create task on jira
     * @returns jira response
     */
    createTaskOnJira({ accessToken, summary, description, cloudId, projectKey }: {
        accessToken: string;
        summary: string;
        description: string;
        cloudId: string;
        projectKey: string;
    }): Promise<any>;
    getLinearTeams(accessToken: string): Promise<any>;
    getJiraCloudId(accessToken: string): Promise<any>;
    getJiraProjects({ accessToken, cloudId }: {
        accessToken: string;
        cloudId: string;
    }): Promise<any>;
    getClickupTeams(accessToken: string): Promise<any>;
    getClickupLists({ accessToken, teamId }: {
        accessToken: string;
        teamId: string;
    }): Promise<any>;
}
