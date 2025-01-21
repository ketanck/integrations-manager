"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationManager = void 0;
var Platforms;
(function (Platforms) {
    Platforms[Platforms["linear"] = 0] = "linear";
    Platforms[Platforms["clickup"] = 1] = "clickup";
})(Platforms || (Platforms = {}));
class IntegrationManager {
    /**
     * @param param0 expects LinearIntegration, ClickUpIntegration and JiraIntegration objects, all are optional
     */
    constructor({ linear, clickup, jira }) {
        if (linear) {
            this.linear = linear;
        }
        if (clickup) {
            this.clickup = clickup;
        }
        if (jira) {
            this.jira = jira;
        }
    }
    // #####################   AUTHORIZATION LINK   ########################
    /**
     * get Linear auth url
     * @param scopes expects comma(,) seperated scopes without space
     * @returns auth url user should to redirected to
     */
    getLinearAuthorizationUrl(scopes) {
        var _a, _b;
        return (_b = (_a = this.linear) === null || _a === void 0 ? void 0 : _a.authorize(scopes)) !== null && _b !== void 0 ? _b : "Linear Integration not added";
    }
    /**
     * get ClickUp auth url, expects no args
     * @returns auth url user should to redirected to
     */
    getClickUpAuthorizationUrl() {
        var _a, _b;
        return (_b = (_a = this.clickup) === null || _a === void 0 ? void 0 : _a.authorize()) !== null && _b !== void 0 ? _b : "ClickUp Integration not added";
    }
    /**
     * get Jira auth url
     * @param scopes expects space seperated jira scopes
     * @returns auth url user should to redirected to
     */
    getJiraAuthorizationUrl(scopes) {
        var _a, _b;
        return (_b = (_a = this.jira) === null || _a === void 0 ? void 0 : _a.authorize(scopes)) !== null && _b !== void 0 ? _b : "Jira Integration not added";
    }
    // ####################   GET ACCESS TOKEN   ########################
    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns access_token, token_type, expires_in, scope
     * @returns linear response - access_token, token_type, expires_in, scope
     */
    getLinearAccessToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, redirectUrl }) {
            var _b;
            return yield ((_b = this.linear) === null || _b === void 0 ? void 0 : _b.getTokens({ code, redirectUrl }));
        });
    }
    /**
     * Signin user and get access token
     * @param code axpects auth code, you get from url
     * @returns clickup response - access_token
     */
    getClickUpAccessToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, redirectUrl }) {
            var _b;
            return yield ((_b = this.clickup) === null || _b === void 0 ? void 0 : _b.getTokens({ code, redirectUrl }));
        });
    }
    /**
     * Signin user and get access token
     * @param code expects auth code, you get from url
     * @returns jira response - access_token, expires_in and scope
     */
    getJiraAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.getTokens(code));
        });
    }
    // ###################   FETCH USER INFO   ###################
    /**
     * Fetch user info from Linear
     * @param accessToken expects accessToken as argument
     * @returns User model returned by linear
     */
    linearUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.linear) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    /**
     * Fetch user info from ClickUp
     * @param accessToken expects accessToken as argument
     * @returns user info returned by clickup
     */
    clickUpUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.clickup) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    /**
     * Fetch user info from jira
     * @param accessToken expects accessToken as argument
     * @returns user info returned by jira
     */
    jiraUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    // #####################   REFRESH TOKEN   ####################
    /**
     * Refresh Jira access token
     * @param refreshToken expects refresh token to get new access token
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    refreshJiraToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return (_b = yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.refreshToken(refreshToken))) !== null && _b !== void 0 ? _b : "";
        });
    }
    // #####################   REVOKE TOKEN   ##################### 
    /**
     * Revokes Linear access token
     * @param accessToken expects accessToken as argument
     * @returns linear response
     */
    revokeLinearToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.linear) === null || _a === void 0 ? void 0 : _a.revokeAuthToken(accessToken));
        });
    }
    /**
     * Revokes Jira access token
     * @param accessToken expects accessToken as argument
     * @returns jira response
     */
    revokeJiraToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.revokeAuthToken(accessToken));
        });
    }
    // #####################   CREATE NEW TASK   ####################
    /**
     * Create new task on Linear
     * @param param0 expects accessToken, title and description to create task on linear
     * @returns linear response
     */
    createTaskOnLinear(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description, teamId }) {
            var _b;
            return yield ((_b = this.linear) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, title, description, teamId }));
        });
    }
    /**
     * Create new task on ClickUp
     * @param param0 expects accessToken, title and description to create task on clickup
     * @returns clickup response
     */
    createTaskOnClickUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description, listId }) {
            var _b;
            return yield ((_b = this.clickup) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, title, description, listId }));
        });
    }
    /**
     * Create new task on Jira
     * @param param0 expects accessToken, title and description to create task on jira
     * @returns jira response
     */
    createTaskOnJira(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, summary, description, cloudId, projectKey }) {
            var _b;
            return yield ((_b = this.jira) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, summary, description, cloudId, projectKey }));
        });
    }
    // *********************   LINEAR   ********************
    getLinearTeams(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.linear) === null || _a === void 0 ? void 0 : _a.fetchAllTeams(accessToken));
        });
    }
    // ********************   JIRA   *******************
    getJiraCloudId(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.fetchCloudId(accessToken));
        });
    }
    getJiraProjects(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, cloudId }) {
            var _b;
            return yield ((_b = this.jira) === null || _b === void 0 ? void 0 : _b.fetchAllProjects(accessToken, cloudId));
        });
    }
    // *******************   CLICKUP   *******************
    getClickupTeams(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.clickup) === null || _a === void 0 ? void 0 : _a.fetchAllTeams(accessToken));
        });
    }
    getClickupLists(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, teamId }) {
            var _b;
            return yield ((_b = this.clickup) === null || _b === void 0 ? void 0 : _b.fetchAllLists(accessToken, teamId));
        });
    }
}
exports.IntegrationManager = IntegrationManager;
