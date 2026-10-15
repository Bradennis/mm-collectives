const express = require("express");
const {
  getProducts,
  getProductBySlug,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { publicWriteLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/:id/reviews", publicWriteLimiter, addProductReview);
router.post("/", protect, requireRole("admin", "staff"), createProduct);
router.put("/:id", protect, requireRole("admin", "staff"), updateProduct);
router.delete("/:id", protect, requireRole("admin"), deleteProduct);

module.exports = router;
