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
exports.LinearIntegration = void 0;
const url_1 = require("url");
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@linear/sdk");
// TODO: DEFINE STRUCTURE FOR ALL INPUTS AND OUTPUTS
// TODO: ADD STATE PARAM TO APIS TO PREVENT CSRF ATTACK
class LinearIntegration {
    constructor({ clientId, clientSecret, redirectUrl }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }
    /**
     * Send user to authorization screen so that he/she can grant access
     * @param scopes comma(,) seperated list of scopes
     * @returns url string to which user should be redirected
     */
    authorize(scopes) {
        const url = new url_1.URL(LinearIntegration.authUrl);
        const params = new url_1.URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            response_type: "code",
            scope: scopes
        });
        url.search = params.toString();
        return url.toString();
    }
    /**
     * Gets access token and other relevant information in exchange of auth code
     * @param code authorization code returned by Linear when user grants access
     * @returns access token and releavant information
     */
    getTokens(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, redirectUrl }) {
            const data = {
                code: code,
                redirect_uri: redirectUrl,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "authorization_code"
            };
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            try {
                const res = yield axios_1.default.post(LinearIntegration.tokenUrl, data, { headers });
                return {
                    success: true,
                    data: res.data
                };
            }
            catch (err) {
                console.error("Error " + err);
                return {
                    success: false,
                    error: err
                };
            }
            // const { access_token, token_type, expires_in, scope } = res.data;
            // // DEFINE A TYPE/INTERFACE AND RETURN THIS DATA
            // return { access_token, token_type, expires_in, scope };
        });
    }
    /**
     * Revokes Linear access token
     * @param accessToken needs access token provided by Linear
     * @returns Linear response
     */
    revokeAuthToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(LinearIntegration.tokenRevokeUrl, null, { headers: { Authorization: `Bearer ${accessToken}` } });
                return {
                    success: true,
                    data: res.data
                };
            }
            catch (err) {
                console.error("Error " + err);
                return {
                    success: false,
                    error: err
                };
            }
        });
    }
    /**
     * Fetches User information from Linear
     * @param accessToken needs access token provided by Linear
     * @returns Linear User model
     */
    fetchUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = new sdk_1.LinearClient({ accessToken });
                const user = yield client.viewer;
                return {
                    success: true,
                    data: user
                };
            }
            catch (err) {
                console.error("Error " + err);
                return {
                    success: false,
                    error: err
                };
            }
            // return user;
        });
    }
    /**
     * Fetches all the teams, user is part of
     * @param accessToken needs access token provided by Linear
     * @returns list of linear teams
     */
    fetchAllTeams(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = new sdk_1.LinearClient({ accessToken });
                const user = yield client.viewer;
                const t = yield user.teams();
                const teams = t.nodes;
                return {
                    success: true,
                    data: teams
                };
                // return teams;
            }
            catch (err) {
                console.error("Error " + err);
                return {
                    success: false,
                    error: err
                };
            }
        });
    }
    /**
     * Creates new issue/task in Linear in default/first team
     * @param param0 accessToken, title, description needed to create new issue/task
     * @returns response of Linear
     */
    createTask(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description, teamId }) {
            const query = `
                  mutation {
                    issueCreate(input: {
                      title: "${title}",
                      description: "${description || ""}",
                      teamId: "${teamId}"
                    }) {
                      success
                      issue {
                        id
                        title
                        description
                        url
                      }
                    }
                  }
                `;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            try {
                const res = yield axios_1.default.post(LinearIntegration.endpoint, { query }, { headers });
                return {
                    success: true,
                    data: res.data
                };
            }
            catch (err) {
                console.error("Error " + err);
                return {
                    success: false,
                    error: err
                };
            }
        });
    }
}
exports.LinearIntegration = LinearIntegration;
LinearIntegration.authUrl = "https://linear.app/oauth/authorize";
LinearIntegration.tokenUrl = "https://api.linear.app/oauth/token";
LinearIntegration.tokenRevokeUrl = "https://api.linear.app/oauth/token";
LinearIntegration.endpoint = "https://api.linear.app/graphql";
