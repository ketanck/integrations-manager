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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickUpIntegration = void 0;
const url_1 = require("url");
const axios_1 = __importDefault(require("axios"));
// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
class ClickUpIntegration {
    constructor({ clientId, clientSecret, redirectUrl }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }
    /**
     * Get ClickUp authorization url, expects no argumments
     * @returns url string to which user should be redirected
     */
    authorize() {
        const url = new url_1.URL(ClickUpIntegration.authUrl);
        const params = new url_1.URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl
        });
        url.search = params.toString();
        return url.toString();
    }
    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by ClickUp when user grants access
     * @returns access token
     */
    getTokens(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code
            };
            const res = yield axios_1.default.post(ClickUpIntegration.tokenUrl, data);
            return res.data.access_token;
        });
    }
    /**
     * Fetches User information from ClickUp
     * @param accessToken needs access token provided by ClickUp
     * @returns ClickUp response
     */
    fetchUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const res = yield axios_1.default.get(ClickUpIntegration.userInfoUrl, { headers });
            return res.data.user;
        });
    }
    /**
     * Creates new task in the default workspace/list
     * @param param0 expects accessToken, title and description of the task to be created
     * @returns Clickup response
     */
    createTask(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description }) {
            const listId = yield this.getListId(accessToken);
            if (listId === "Error") {
                return "Error";
            }
            // TODO: TAKE OTHER PROPERTIES ALSO, LIKE PRIORITY, ASSIGNEE ETC
            const taskPayload = {
                name: title,
                description: description
            };
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            };
            const res = yield axios_1.default.post(`${ClickUpIntegration.apiUrl}/list/${listId}/task`, taskPayload, { headers });
            return res.data;
        });
    }
    // ##################   HELPER METHODS   ####################
    getListId(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
                const teamsRes = yield axios_1.default.get(`${ClickUpIntegration.apiUrl}/team`, {
                    headers
                });
                if (!teamsRes.data || !teamsRes.data.teams || teamsRes.data.teams.length == 0) {
                    return "No teams found for this access token";
                }
                const teamId = teamsRes.data.teams[0].id;
                const listRes = yield axios_1.default.get(`${ClickUpIntegration.apiUrl}/team/${teamId}/list`, {
                    headers
                });
                if (!listRes.data || !listRes.data.lists || listRes.data.lists.length === 0) {
                    return 'No lists found for this team';
                }
                return listRes.data.lists[0].id;
            }
            catch (err) {
                console.error(err);
                return "Error";
            }
        });
    }
}
exports.ClickUpIntegration = ClickUpIntegration;
ClickUpIntegration.authUrl = "https://app.clickup.com/api";
ClickUpIntegration.tokenUrl = "https://api.clickup.com/api/v2/oauth/token";
ClickUpIntegration.userInfoUrl = "https://api.clickup.com/api/v2/user";
ClickUpIntegration.apiUrl = "https://api.clickup.com/api/v2";
