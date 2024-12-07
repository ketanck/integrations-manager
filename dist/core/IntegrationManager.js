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
    getLinearAuthorizationUrl(scopes) {
        var _a, _b;
        return (_b = (_a = this.linear) === null || _a === void 0 ? void 0 : _a.authorize(scopes)) !== null && _b !== void 0 ? _b : "Linear Integration not added";
    }
    getClickUpAuthorizationUrl() {
        var _a, _b;
        return (_b = (_a = this.clickup) === null || _a === void 0 ? void 0 : _a.authorize()) !== null && _b !== void 0 ? _b : "ClickUp Integration not added";
    }
    getJiraAuthorizationUrl(scopes) {
        var _a, _b;
        return (_b = (_a = this.jira) === null || _a === void 0 ? void 0 : _a.authorize(scopes)) !== null && _b !== void 0 ? _b : "Jira Integration not added";
    }
    // ####################   GET ACCESS TOKEN   ########################
    getLinearAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.linear) === null || _a === void 0 ? void 0 : _a.getTokens(code));
        });
    }
    getCickUpAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.clickup) === null || _a === void 0 ? void 0 : _a.getTokens(code));
        });
    }
    getJiraAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.getTokens(code));
        });
    }
    // ###################   FETCH USER INFO   ###################
    linearUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.linear) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    clickUpUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.clickup) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    jiraUser(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.jira) === null || _a === void 0 ? void 0 : _a.fetchUserInfo(accessToken));
        });
    }
    // #####################   CREATE NEW TASK   ####################
    createTaskOnLinear(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description }) {
            var _b;
            return yield ((_b = this.linear) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, title, description }));
        });
    }
    createTaskOnClickUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, title, description }) {
            var _b;
            return yield ((_b = this.clickup) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, title, description }));
        });
    }
    createTaskOnJira(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessToken, summary, description }) {
            var _b;
            return yield ((_b = this.jira) === null || _b === void 0 ? void 0 : _b.createTask({ accessToken, summary, description }));
        });
    }
}
exports.IntegrationManager = IntegrationManager;
