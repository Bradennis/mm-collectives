// Adds the sample categories and products WITHOUT deleting anything.
// Anything that already exists (matched by slug) is left exactly as it is; users are never touched.
// Run with: npm run seed:catalog

require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { categories, products } = require("./sampleCatalog");

async function seedCatalog() {
  await mongoose.connect(process.env.MONGO_URI);

  let addedCategories = 0;
  const categoryIdBySlug = {};
  for (const category of categories) {
    let existing = await Category.findOne({ $or: [{ slug: category.slug }, { name: category.name }] });
    if (!existing) {
      existing = await Category.create(category);
      addedCategories += 1;
    }
    categoryIdBySlug[category.slug] = existing._id;
  }

  let addedProducts = 0;
  for (const { categorySlug, ...product } of products) {
    if (await Product.exists({ slug: product.slug })) continue;
    await Product.create({ ...product, images: [], category: categoryIdBySlug[categorySlug] });
    addedProducts += 1;
  }

  console.log(
    `Added ${addedCategories} categories and ${addedProducts} products ` +
      `(${categories.length - addedCategories} categories and ${products.length - addedProducts} products already existed).`
  );
  process.exit(0);
}

seedCatalog().catch((err) => {
  console.error(err);
  process.exit(1);
});
