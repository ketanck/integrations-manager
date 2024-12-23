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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraIntegration = void 0;
const axios_1 = __importDefault(require("axios"));
// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
class JiraIntegration {
    constructor({ clientId, clientSecret, redirectUrl }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }
    /**
     * Get Jira authorization url, expects scopes as arguments
     * @param scopes space-seperated scopes of the data/permissions you need access to
     * @returns url string to which user should be redirected
     */
    authorize(scopes) {
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
        return _a.authUrl + `?audience=api.atlassian.com&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&scope=${scopes}&response_type=code&prompt=consent`;
    }
    /**
     * Get access token and other relevant data by passing in auth code
     * @param code authorization code returned by Jira
     * @returns access_token, expires_in, token_type and scope (and refresh_token)
     */
    getTokens(code) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const res = yield axios_1.default.post(_a.tokenUrl, data, { headers });
            return res.data;
        });
    }
    /**
     * Get new access token by passing in refresh token
     * @param refreshToken refresh token provided by Jira
     * @returns new access_token, refresh_token expires_in, token_type and scope
     */
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                refresh_token: refreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "refresh_token"
            };
            const headers = {
                "Content-Type": "application/json"
            };
            const res = yield axios_1.default.post(_a.tokenUrl, data, { headers });
            return res.data;
        });
    }
    /**
     * Fetches user information from Jira
     * @param accessToken expects access tokn provided by Jira
     * @returns Jira response
     */
    fetchUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            };
            try {
                const res = yield axios_1.default.get(`${_a.baseUrl}/me`, { headers });
                return {
                    status: 200,
                    data: res.data
                };
            }
            catch (err) {
                console.error(err);
                if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                    console.error("Unauthorized");
                    return {
                        status: 401,
                        message: "Unauthorized"
                    };
                }
                else {
                    return {
                        status: 500,
                        message: "Internal Server Error"
                    };
                }
            }
        });
    }
    /**
     * Creates new task in the default project
     * @param param0 expects accessToken, summary and description of the task to be created
     * @returns Jira response
     */
    createTask(_b) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, summary, description }) {
            var _c;
            const cloudId = yield this.getCloudId(accessToken);
            console.log("cloud id: " + cloudId);
            if (cloudId === "Unauthorized") {
                return {
                    status: 401,
                    message: "Unauthorized"
                };
            }
            else if (cloudId === "Error") {
                return {
                    status: 500,
                    message: "Internal Server Error"
                };
            }
            const projectKey = yield this.getProjectKey(accessToken, cloudId);
            console.log("project key: " + projectKey);
            if (projectKey === "Unauthorized") {
                return {
                    status: 401,
                    message: "Unauthorized"
                };
            }
            else if (projectKey === "Error") {
                return {
                    status: 500,
                    message: "Internal Server Error"
                };
            }
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
                const res = yield axios_1.default.post(`${_a.apiUrl}/${cloudId}/rest/api/3/issue`, {
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
                }, { headers });
                return res.data;
            }
            catch (err) {
                console.error(err);
                if (((_c = err.response) === null || _c === void 0 ? void 0 : _c.status) === 401) {
                    console.error("Unauthorized");
                    return {
                        status: 401,
                        message: "Unauthorized"
                    };
                }
                else {
                    return {
                        status: 500,
                        message: "Internal Server Error"
                    };
                }
            }
        });
    }
    // ###################   HELPER METHODS   #####################
    getCloudId(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            };
            try {
                const res = yield axios_1.default.get(_a.cloudIdUrl, { headers });
                return res.data[0].id;
            }
            catch (err) {
                console.error(err);
                if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                    console.error("Unauthorized");
                    return "Unauthorized";
                }
            }
            return "Error";
        });
    }
    getProjectKey(accessToken, cloudId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            try {
                const res = yield axios_1.default.get(`${_a.apiUrl}/${cloudId}/rest/api/3/project`, { headers });
                return res.data[0].key;
            }
            catch (err) {
                console.error(err);
                if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                    console.error("Unauthorized");
                    return "Unauthorized";
                }
            }
            return "Error";
        });
    }
}
exports.JiraIntegration = JiraIntegration;
_a = JiraIntegration;
JiraIntegration.authUrl = "https://auth.atlassian.com/authorize";
JiraIntegration.tokenUrl = "https://auth.atlassian.com/oauth/token";
JiraIntegration.baseUrl = "https://api.atlassian.com";
JiraIntegration.cloudIdUrl = `${_a.baseUrl}/oauth/token/accessible-resources`;
JiraIntegration.apiUrl = `${_a.baseUrl}/ex/jira`;
