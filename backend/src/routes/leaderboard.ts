import { Router, Request, Response } from "express";
import client, { connectRedis } from "../redis";

const router = Router();

// GET /leaderboard - Get top 100 players
// GET /leaderboard/top/:count - Get top N players
// GET /leaderboard/player/:playerId - Get a player's rank and score
// GET /leaderboard/around/:playerId - Get players around a specific player
// POST /leaderboard - Submit a new score

router.get("/", async (req, res) => {
  try {
    await connectRedis();
    const leaderboard = await client.zRangeWithScores("leaderboard", 0, 99);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { playerId, score } = req.body;
  if (!playerId || typeof score !== "number") {
    res.status(400).json({ error: "Invalid input" });
  }
  try {
    await connectRedis();
    const postScore = await client.zAdd("leaderboard", {
      score: score,
      value: playerId,
    });
    res
      .status(201)
      .json({ message: "Score submitted successfully", postScore });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
