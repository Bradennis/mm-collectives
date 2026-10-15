const rateLimit = require("express-rate-limit");

// Guest-facing writes (orders, import requests, reviews) need no login, so cap them per IP.
const publicWriteLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

// Reference-number lookups: slow down anyone guessing references.
const trackLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

module.exports = { publicWriteLimiter, trackLimiter };
