"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../redis");
const router = (0, express_1.Router)();
// GET /leaderboard - Get top 100 players
// GET /leaderboard/top/:count - Get top N players
// GET /leaderboard/player/:playerId - Get a player's rank and score
// GET /leaderboard/around/:playerId - Get players around a specific player
// POST /leaderboard - Submit a new score
router.get("/", (req, res) => {
    const response = (0, redis_1.connectRedis)().catch(console.error);
    res.json({ response, message: "Welcome to the Leaderboard API" });
});
exports.default = router;
