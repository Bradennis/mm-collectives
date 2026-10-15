const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const ImportRequest = require("../models/ImportRequest");

// @desc  High-level dashboard overview stats
// @route GET /api/admin/analytics/overview
const getOverview = asyncHandler(async (req, res) => {
  const [totalOrders, totalCustomers, totalProducts, pendingImportRequests] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments({ isActive: true }),
    ImportRequest.countDocuments({ status: "submitted" }),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalGHS" } } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingImportRequests,
    totalRevenueGHS: revenueAgg[0]?.totalRevenue || 0,
    ordersByStatus: ordersByStatus.map((s) => ({ status: s._id, count: s.count })),
  });
});

// @desc  Revenue over time (daily, last N days)
// @route GET /api/admin/analytics/revenue?days=30
const getRevenueTimeSeries = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const series = await Order.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalGHS" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(series.map((s) => ({ date: s._id, revenue: s.revenue, orders: s.orders })));
});

// @desc  Top selling products
// @route GET /api/admin/analytics/top-products
const getTopProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const products = await Product.find({ isActive: true })
    .sort({ soldCount: -1 })
    .limit(limit)
    .select("name soldCount priceGHS images");
  res.json(products);
});

// @desc  Conversion funnel (import requests -> orders)
// @route GET /api/admin/analytics/funnel
const getFunnel = asyncHandler(async (req, res) => {
  const [submitted, quoted, accepted, converted] = await Promise.all([
    ImportRequest.countDocuments({}),
    ImportRequest.countDocuments({ status: { $in: ["quoted", "accepted", "rejected", "converted_to_order"] } }),
    ImportRequest.countDocuments({ status: { $in: ["accepted", "converted_to_order"] } }),
    ImportRequest.countDocuments({ status: "converted_to_order" }),
  ]);
  res.json({ submitted, quoted, accepted, converted });
});

module.exports = { getOverview, getRevenueTimeSeries, getTopProducts, getFunnel };
