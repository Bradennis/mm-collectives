const express = require("express");
const {
  createOrder,
  trackOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, optionalAuth, requireRole } = require("../middleware/authMiddleware");
const { publicWriteLimiter, trackLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/", publicWriteLimiter, optionalAuth, createOrder);
router.get("/track/:orderNumber", trackLimiter, trackOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, requireRole("admin", "staff"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, requireRole("admin", "staff"), updateOrderStatus);

module.exports = router;
