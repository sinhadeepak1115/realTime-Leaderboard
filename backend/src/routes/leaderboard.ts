import { Router } from "express";
import { Request, Response } from "express";
import { connectRedis } from "../redis";

const router = Router();

// GET /leaderboard - Get top 100 players
// GET /leaderboard/top/:count - Get top N players
// GET /leaderboard/player/:playerId - Get a player's rank and score
// GET /leaderboard/around/:playerId - Get players around a specific player
// POST /leaderboard - Submit a new score

router.get("/", (req, res) => {
  const response = connectRedis().catch(console.error);
  res.json({ response, message: "Welcome to the Leaderboard API" });
});

export default router;
