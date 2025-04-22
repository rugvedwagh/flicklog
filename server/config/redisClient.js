import Redis from "ioredis";

let redis;
let redisAvailable = false;

const connectRedis = () => {
    redis = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        retryStrategy: (times) => {
            if (times >= 2) {
                console.error("❌ Redis is down. Stopping further retries.");
                return null;
            }
            return Math.min(times * 100, 2000);
        },
        maxRetriesPerRequest: 1,
        connectTimeout: 500,
        enableOfflineQueue: false,
    });

    redis.on("connect", () => {
        console.log(`✅ Connected to Redis on ${redis.options.host}:${redis.options.port}`);
        redisAvailable = true;
    });

    redis.on("error", (err) => { 
        console.error("❌ Redis Connection Error:", err);
        redisAvailable = false;
    });
};

// Getter for redis instance
const getRedis = () => redis;

export { connectRedis, getRedis, redisAvailable };
