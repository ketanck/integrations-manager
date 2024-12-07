import { IntegrationInterface } from "../../../core/IntegrationInterface";
/**
 * Interface which defines the method signatures as per needs to connect ClickUp
 */
export interface ClickUpInterface extends IntegrationInterface {
    authorize(): string;
    getTokens(code: any): Promise<string>;
    fetchUserInfo(accessToken: string): Promise<any>;
    createTask({}: any): Promise<any>;
}
