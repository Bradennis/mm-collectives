require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const importRequestRoutes = require("./routes/importRequestRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const customerRoutes = require("./routes/customerRoutes");

connectDB();

const app = express();

// Behind Render's load balancer (and Vercel's /api rewrite), so rate limits key on the real client IP
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS || 1));

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Basic rate limiting on auth routes to slow brute-force attempts
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/import-requests", importRequestRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/customers", customerRoutes);

// RENDER_GIT_COMMIT is set by Render, so this shows which commit is live
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "mm-collectives-api", commit: process.env.RENDER_GIT_COMMIT?.slice(0, 7) || "local" })
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MM Collectives API running on port ${PORT}`));
