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
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
client.on("error", (err) => console.error("Redis Client Error", err));
let isConnected = false;
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isConnected)
            return client;
        try {
            yield client.connect();
            isConnected = true;
            console.log("Connected to Redis");
            return client;
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
            throw error;
        }
    });
}
exports.default = client;
