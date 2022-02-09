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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    throw Error("API_BASE_URL not set!");
}
var SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw Error("SECRET_KEY not set!");
}
var SYNC_PERIOD = parseInt(process.env.SYNC_PERIOD, 10);
if (!SYNC_PERIOD) {
    throw Error("SYNC_PERIOD not set!");
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var resp, lastUpdate, updateInterval, respUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1["default"])({
                        method: 'get',
                        url: API_BASE_URL + "/update/status/last",
                        headers: {
                            'x-update-secret-key': SECRET_KEY
                        }
                    })];
                case 1:
                    resp = _a.sent();
                    if (resp.status !== 200) {
                        throw Error("got " + resp.status + " error when calling " + API_BASE_URL + "/update/status/last");
                    }
                    lastUpdate = resp.data[0];
                    if (!lastUpdate.finished) {
                        console.log("last update at " + lastUpdate.startedAt + " did not finish, overwriting");
                    }
                    updateInterval = Math.floor(Date.now() / 1000) - lastUpdate.before;
                    if (updateInterval > SYNC_PERIOD + 60) {
                        console.warn("api limit previously hit, possible sync issues");
                    }
                    if (updateInterval > 3 * SYNC_PERIOD) {
                        console.warn("last update occured too long ago ".concat(updateInterval, "s, reseting to \n      3 sync_periods ").concat(3 * SYNC_PERIOD));
                        updateInterval = 3 * SYNC_PERIOD;
                    }
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: 'get',
                            url: API_BASE_URL + "/update?interval=" + updateInterval,
                            headers: {
                                'x-update-secret-key': SECRET_KEY
                            }
                        })];
                case 2:
                    respUpdate = _a.sent();
                    if (respUpdate.status !== 204) {
                        throw Error("got " + respUpdate.status + " error when calling " + API_BASE_URL + "/update");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
