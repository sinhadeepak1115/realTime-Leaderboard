import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

let isConnected = false;

export async function connectRedis() {
  if (isConnected) return client;
  try {
    await client.connect();
    isConnected = true;
    console.log("Connected to Redis");
    return client;
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    throw error;
  }
}

export default client;
