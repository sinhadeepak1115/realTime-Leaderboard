import express from "express";
import leaderboardRouter from "./routes/leaderboard";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Leaderboard API");
});
app.use("/leaderboard", leaderboardRouter);

app.listen(PORT);
