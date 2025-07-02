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

router.get(
  "/top/:count",
  async (req: Request, res: Response): Promise<void> => {
    const count = parseInt(req.params.count, 10);
    try {
      await connectRedis();
      const leaderboard = await client.zRangeWithScores(
        "leaderboard",
        0,
        count || 10,
      );
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

router.get(
  "/player/:playerId",
  async (req: Request, res: Response): Promise<void> => {
    const playerId = req.params.playerId;
    console.log("Fetching player score for:", playerId);
    try {
      await connectRedis();
      const [rank, score] = await client
        .multi()
        .zRevRank("leaderboard", playerId)
        .zScore("leaderboard", playerId)
        .exec();
      if (rank === null || score === null) {
        res.status(404).json({ error: "Player not found in leaderboard" });
        console.log("Player not found:", playerId);
        return;
      }
      console.log("Player found:", playerId, "Rank:", rank, "Score:", score);
      res.status(200).json({ message: "Player found", playerId, rank, score });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error fetching player score:", error);
    }
  },
);

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { playerId, score } = req.body;
  if (!playerId || typeof score !== "number") {
    res.status(400).json({ error: "Invalid input" });
  }
  try {
    await connectRedis();
    const postScore = await client.zAdd("leaderboard", {
      score,
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
