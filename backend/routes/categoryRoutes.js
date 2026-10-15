const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, requireRole("admin", "staff"), createCategory);
router.put("/:id", protect, requireRole("admin", "staff"), updateCategory);
router.delete("/:id", protect, requireRole("admin"), deleteCategory);

module.exports = router;
