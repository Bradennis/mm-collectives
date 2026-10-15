const express = require("express");
const {
  createImportRequest,
  trackImportRequest,
  getMyImportRequests,
  getAllImportRequests,
  quoteImportRequest,
  respondToQuote,
} = require("../controllers/importRequestController");
const { protect, optionalAuth, requireRole } = require("../middleware/authMiddleware");
const { publicWriteLimiter, trackLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/", publicWriteLimiter, optionalAuth, createImportRequest);
router.get("/track/:reference", trackLimiter, trackImportRequest);
router.get("/mine", protect, getMyImportRequests);
router.get("/", protect, requireRole("admin", "staff"), getAllImportRequests);
router.patch("/:id/quote", protect, requireRole("admin", "staff"), quoteImportRequest);
router.patch("/:id/respond", protect, respondToQuote);

module.exports = router;
