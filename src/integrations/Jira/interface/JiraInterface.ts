import { IntegrationInterface } from "../../../core/IntegrationInterface";

export interface JiraInterface extends IntegrationInterface {
    authorize(scopes: string): string;

    getTokens(code: string): Promise<any>;

    fetchUserInfo(accessToken: string): Promise<any>;

    createTask({ }: any): Promise<any>;
}