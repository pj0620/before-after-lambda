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
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    throw Error("API_BASE_URL not set!");
}
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw Error("SECRET_KEY not set!");
}
const SYNC_PERIOD = parseInt(process.env.SYNC_PERIOD, 10);
if (!SYNC_PERIOD) {
    throw Error("SYNC_PERIOD not set!");
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield (0, axios_1.default)({
            method: 'get',
            url: API_BASE_URL + "/update/status/last",
            headers: {
                'x-update-secret-key': SECRET_KEY
            }
        });
        if (resp.status !== 200) {
            throw Error("got " + resp.status + " error when calling " + API_BASE_URL + "/update/status/last");
        }
        const lastUpdate = resp.data[0];
        if (!lastUpdate.finished) {
            console.warn("last update at " + lastUpdate.startedAt + " did not finish, overwriting");
        }
        let updateInterval = Math.floor(Date.now() / 1000) - lastUpdate.before;
        if (updateInterval > SYNC_PERIOD + 60) {
            console.warn("api limit previously hit, possible sync issues");
        }
        if (updateInterval > 3 * SYNC_PERIOD) {
            console.warn(`last update occured too long ago ${updateInterval}s, reseting to 
      3 sync_periods ${3 * SYNC_PERIOD}`);
            updateInterval = 3 * SYNC_PERIOD;
        }
        const respUpdate = yield (0, axios_1.default)({
            method: 'get',
            url: API_BASE_URL + "/update?interval=" + updateInterval,
            headers: {
                'x-update-secret-key': SECRET_KEY
            }
        });
        if (respUpdate.status !== 204) {
            throw Error("got " + respUpdate.status + " error when calling " + API_BASE_URL + "/update");
        }
    });
}
main();
