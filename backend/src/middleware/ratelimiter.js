import redisClient from "../config/reddis_connect";

const submitCodeRateLimiter = async (req, res, next) => {
    const userId = req.result._id;
    const redisKey = `submit_cooldown:${userId}`;

    try {
        // Atomically try to set cooldown - returns null if key already exists
        const result = await redisClient.set(redisKey, 'cooldown_active', {
            EX: 10,   // Expire in 10 seconds
            NX: true  // Only set if key doesn't exist
        });

        if (result === null) {
            // Key already exists - user is rate limited
            const ttl = await redisClient.ttl(redisKey);

            return res.status(429).json({
                success: false,
                error: 'Please wait before submitting again',
                message: `You can submit again in ${ttl} seconds`,
                retryAfter: ttl,
                cooldownEndsAt: Date.now() + (ttl * 1000)
            });
        }

        // Cooldown successfully set - allow submission
        next();

    } catch (err) {
        console.error('Rate limiter error:', err);
        
        // On Redis error, allow request through (fail open)
        // OR block request (fail closed) - your choice
        next(); // Fail open approach
        
        // Alternative: Fail closed (safer)
        // res.status(500).json({
        //     success: false,
        //     error: 'Rate limiter error: ' + err.message
        // });
    }
};

export default submitCodeRateLimiter;