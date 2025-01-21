/**
 * Interface which declares the basic methods every Platform Integration module must implement
 * 
 * Platform specific interfaces can extend it to define method signatures as per platform needs
 */
export interface IntegrationInterface {
    // ***************   AUTHENTICATICATION METHODS   ***********************

    /**
     * Method which returns url which user needs to be redirected to
     * @param scopes optional scopes parameter which platform might need
     */
    authorize(scopes?: any): any;

    /**
     * Method which takes authorization code and exchanges it in return of access token and other related data
     * @param code 
     */
    getTokens({}: any): Promise<any>;



    // **************   USER RELATED METHOD   ***************

    /**
     * Return user information of the user from the platform
     * @param token takes accessToken as input
     */
    fetchUserInfo(token?: any): Promise<any>;
    
    // ****************   TASKS RELATED METHODS   ****************
    
    /**
     * Method to create new task/issue, needs platform specific implementation
     * @param param0 whatever input is needed to create task
     */
    createTask({}: any): Promise<void>;

    // TODO: METHOD WHICH NEEDS TO BE IMPLEMENTED AS NEEDED
    /*
    getTasks(): Promise<void>;
    updateTask(): Promise<void>;
    deleteTask(): Promise<void>;
    */
};