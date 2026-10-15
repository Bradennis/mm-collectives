// Seeds a demo admin user, categories, and sample products.
// WARNING: this wipes ALL existing users, categories and products first.
// To add the sample catalogue without deleting anything, use: npm run seed:catalog
// Run with: npm run seed

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { categories, products } = require("./sampleCatalog");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding...");

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "MM Collectives Admin",
    email: "admin@mmcollectives.com",
    phone: "0240000000",
    password: "ChangeMe123!",
    role: "admin",
  });

  const created = await Category.create(categories);
  const categoryIdBySlug = Object.fromEntries(created.map((c) => [c.slug, c._id]));

  await Product.create(
    products.map(({ categorySlug, ...product }) => ({
      ...product,
      images: [],
      category: categoryIdBySlug[categorySlug],
    }))
  );

  console.log(`Seed complete. Admin login: ${admin.email} / ChangeMe123!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
