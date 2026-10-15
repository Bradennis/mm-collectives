const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: String, // e.g. "Color", "Size"
    options: [String], // e.g. ["Red", "Blue"]
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous", trim: true, maxlength: 60 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120 },
    comment: { type: String, trim: true, maxlength: 1500 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, trim: true },
    priceGHS: { type: Number, required: true }, // customer-facing price
    salePriceGHS: { type: Number, default: 0 }, // 0 = not on sale; must be below priceGHS to take effect
    costPriceGHS: { type: Number, default: 0 }, // internal cost for margin analytics
    stock: { type: Number, default: 0 },
    unitWeightKg: { type: Number, default: 0 }, // used for shipping calc
    variants: [variantSchema],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sourceCountry: { type: String, default: "China" },
    minGroupBuyQty: { type: Number, default: 0 }, // 0 = no group buy
    groupBuyDiscountPct: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
