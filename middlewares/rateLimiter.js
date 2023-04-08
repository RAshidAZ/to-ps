const rateLimit = require('express-rate-limit');

/**
 * This function sets a rate limit for requests based on a time window and maximum limit.
 * @param timeInMins - The time interval in minutes for which the rate limiting should be applied. It
 * is converted to milliseconds by multiplying with 60 (seconds) and 1000 (milliseconds).
 * @param limit - The `limit` parameter is the maximum number of requests allowed within the specified
 * time window (`windowMs`). In the example code, it limits each IP address to `limit` number of
 * requests per `windowMs` time period. If the limit is exceeded, the middleware will return the
 * message "Too
 * @returns The `limiter` function is being returned.
 */
module.exports = function(timeInMins, limit) {
    return rateLimit({
        windowMs: parseInt(timeInMins) * 60 * 1000, // 10 minutes
        max: limit, // limit each IP to 100 requests per windowMs
        message: 'Too many requests, please try again later.',
    });
}