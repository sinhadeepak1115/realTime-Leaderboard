import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

export async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    await client.hSet("deepak", {
      name: "Deepak",
      sessionId: "12345",
      surname: "Sinha",
      age: 30,
    });
    const user = await client.hGetAll("deepak");
    console.log("User data:", JSON.stringify(user));
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}
