const express = require("express");
const {
  getOverview,
  getRevenueTimeSeries,
  getTopProducts,
  getFunnel,
} = require("../controllers/analyticsController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireRole("admin", "staff"));
router.get("/overview", getOverview);
router.get("/revenue", getRevenueTimeSeries);
router.get("/top-products", getTopProducts);
router.get("/funnel", getFunnel);

module.exports = router;
