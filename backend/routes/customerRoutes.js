const express = require("express");
const { getCustomers, toggleCustomerStatus } = require("../controllers/customerController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireRole("admin", "staff"));
router.get("/", getCustomers);
router.patch("/:id/status", requireRole("admin"), toggleCustomerStatus);

module.exports = router;
