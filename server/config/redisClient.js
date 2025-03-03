import Redis from "ioredis";

const redis = new Redis({
	host: process.env.REDIS_HOST || "127.0.0.1",
	port: process.env.REDIS_PORT || 6379,
	retryStrategy: (times) => {
		if (times >= 2) {
			return null;
		}
		return Math.min(times * 100, 2000);
	},
	maxRetriesPerRequest: 1,
	connectTimeout: 500,
	enableOfflineQueue: false,
});

redis.on("connect", () => {
	console.log(`✅ Connected to Redis on ${redis.options.host}:${redis.options.port}`)
});

redis.on("error", (err) => {
	console.error("❌ Redis Connection Error:", err)
});

export default redis;
