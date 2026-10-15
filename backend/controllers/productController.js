const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const NEW_ARRIVAL_DAYS = 30;

const SORTS = {
  featured: { isFeatured: -1, createdAt: -1 },
  "price-asc": { priceGHS: 1 },
  "price-desc": { priceGHS: -1 },
  newest: { createdAt: -1 },
  rating: { ratingAvg: -1, ratingCount: -1 },
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc  List products (public) with filters/search/sort/pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    featured,
    bestseller,
    onSale,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const query = { isActive: true };
  const and = [];

  if (search) {
    // Regex rather than $text so partial words match while the customer is still typing
    const pattern = new RegExp(escapeRegex(search), "i");
    and.push({ $or: [{ name: pattern }, { brand: pattern }, { tags: pattern }] });
  }
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  if (bestseller) query.isBestseller = true;
  if (req.query.new) {
    const since = new Date(Date.now() - NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000);
    and.push({ $or: [{ isNewArrival: true }, { createdAt: { $gte: since } }] });
  }
  if (onSale) {
    query.salePriceGHS = { $gt: 0 };
    and.push({ $expr: { $lt: ["$salePriceGHS", "$priceGHS"] } });
  }
  if (minPrice || maxPrice) {
    query.priceGHS = {};
    if (minPrice) query.priceGHS.$gte = Number(minPrice);
    if (maxPrice) query.priceGHS.$lte = Number(maxPrice);
  }
  if (and.length) query.$and = and;

  const pageSize = Math.min(Number(limit) || 20, 100);
  const skip = (Number(page) - 1) * pageSize;
  const [products, total] = await Promise.all([
    Product.find(query)
      .select("-reviews")
      .populate("category", "name slug")
      .skip(skip)
      .limit(pageSize)
      .sort(SORTS[sort] || SORTS.newest),
    Product.countDocuments(query),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / pageSize) });
});

// @desc  Get single product by slug
// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate("category", "name slug");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Add a customer review (public)
// @route POST /api/products/:id/reviews
const addProductReview = asyncHandler(async (req, res) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be a whole number from 1 to 5");
  }

  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.reviews.push({
    name: String(req.body.name || "").trim() || "Anonymous",
    rating,
    title: req.body.title,
    comment: req.body.comment,
  });
  product.ratingCount = product.reviews.length;
  product.ratingAvg =
    Math.round((product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length) * 10) / 10;
  await product.save();

  res.status(201).json(await product.populate("category", "name slug"));
});

// @desc  Create product (admin/staff)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @desc  Update product (admin/staff)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Delete (soft) product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product deactivated" });
});

module.exports = { getProducts, getProductBySlug, addProductReview, createProduct, updateProduct, deleteProduct };
