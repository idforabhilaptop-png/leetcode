import redisClient from "../config/reddis_connect.js";

const submitCodeRateLimiter = async (req, res, next) => {
    const userId = req.result._id;
    const redisKey = `submit_cooldown:${userId}`;

    try {
        // Check if cooldown is active
        const exists = await redisClient.exists(redisKey);

        if (exists) {
            // Get remaining TTL (time to live)
            const ttl = await redisClient.ttl(redisKey);

            return res.status(429).json({
                success: false,
                error: 'Please wait before submitting again',
                message: `You can submit again in ${ttl} seconds`,
                retryAfter: ttl,
                cooldownEndsAt: Date.now() + (ttl * 1000)
            });
        }

        // Set cooldown with 10 second expiry
        // FIX: Use 'EX' as second parameter, not in options object
        await redisClient.set(redisKey, 'cooldown_active', 'EX', 10);

        next();

    } catch (err) {
        console.error('Rate limiter error:', err);
        res.status(500).json({
            success: false,
            error: 'Rate limiter error: ' + err.message
        });
    }
};

export default submitCodeRateLimiter;