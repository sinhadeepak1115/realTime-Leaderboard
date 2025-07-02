"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = require("express");
const redis_1 = __importStar(require("../redis"));
const router = (0, express_1.Router)();
// GET /leaderboard - Get top 100 players
// GET /leaderboard/top/:count - Get top N players
// GET /leaderboard/player/:playerId - Get a player's rank and score
// GET /leaderboard/around/:playerId - Get players around a specific player
// POST /leaderboard - Submit a new score
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_1.connectRedis)();
        const leaderboard = yield redis_1.default.zRangeWithScores("leaderboard", 0, 99);
        res.status(200).json(leaderboard);
    }
    catch (error) {
        console.error("Error connecting to Redis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId, score } = req.body;
    if (!playerId || typeof score !== "number") {
        res.status(400).json({ error: "Invalid input" });
    }
    try {
        yield (0, redis_1.connectRedis)();
        yield redis_1.default.zAdd("leaderboard", {
            score: score,
            value: playerId,
        });
        res.status(201).json({ message: "Score submitted successfully" });
    }
    catch (error) {
        console.error("Error submitting score:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
