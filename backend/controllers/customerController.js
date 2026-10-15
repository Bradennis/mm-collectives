const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc  List customers with order stats (admin/staff)
// @route GET /api/admin/customers
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });

  const orderStats = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: "$user", totalSpentGHS: { $sum: "$totalGHS" }, orderCount: { $sum: 1 } } },
  ]);
  const statsMap = Object.fromEntries(orderStats.map((s) => [s._id.toString(), s]));

  const enriched = customers.map((c) => ({
    ...c.toObject(),
    totalSpentGHS: statsMap[c._id.toString()]?.totalSpentGHS || 0,
    orderCount: statsMap[c._id.toString()]?.orderCount || 0,
  }));

  res.json(enriched);
});

// @desc  Toggle a customer's active status (admin only)
// @route PATCH /api/admin/customers/:id/status
const toggleCustomerStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Customer not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ _id: user._id, isActive: user.isActive });
});

module.exports = { getCustomers, toggleCustomerStatus };
