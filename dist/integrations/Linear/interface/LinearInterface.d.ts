import { User } from "@linear/sdk";
import { IntegrationInterface } from "../../../core/IntegrationInterface";
/**
 * Interface which defines the method signatures as per needs to connect Linear
 */
export interface LinearInterface extends IntegrationInterface {
    authorize(scopes: string): string;
    fetchUserInfo(accessToken: string): Promise<User>;
    createTask({ accessToken, title, description }: {
        accessToken: string;
        title: string;
        description: string;
    }): Promise<any>;
}
