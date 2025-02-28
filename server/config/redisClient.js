import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => console.log(`\n✅ Connected to Redis on ${redis.options.host}:${redis.options.port}`));
redis.on("error", (err) => console.error("❌ Redis Connection Error:", err));

export default redis;
