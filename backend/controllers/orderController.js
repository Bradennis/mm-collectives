const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { calculateShipping } = require("../utils/shippingCalculator");
const { getUnitPriceGHS } = require("../utils/pricing");

// @desc  Create order from cart (logged-in customer or guest)
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress = {}, customer = {}, notes } = req.body;
  const mode = req.body.mode === "air" ? "air" : "sea";

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const contact = {
    name: String(customer.name || req.user?.name || "").trim(),
    email: String(customer.email || req.user?.email || "").trim(),
    phone: String(customer.phone || shippingAddress.phone || req.user?.phone || "").trim(),
  };
  if (!contact.name || !contact.phone) {
    res.status(400);
    throw new Error("Your name and phone number are required so we can confirm the order");
  }

  let itemsSubtotalGHS = 0;
  let totalWeightKg = 0;
  let isGroupBuy = false;
  const orderItems = [];

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!(quantity >= 1)) {
      res.status(400);
      throw new Error("Item quantity must be at least 1");
    }
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }
    const { unitPriceGHS, groupBuy } = getUnitPriceGHS(product, quantity);
    if (groupBuy) isGroupBuy = true;
    itemsSubtotalGHS += unitPriceGHS * quantity;
    totalWeightKg += (product.unitWeightKg || 0) * quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      variantSelections: item.variantSelections || {},
      quantity,
      unitPriceGHS,
    });
  }

  const { shippingFeeGHS, customsFeeGHS, totalGHS } = calculateShipping({
    totalWeightKg,
    itemsSubtotalGHS,
    mode,
  });

  const order = await Order.create({
    user: req.user?._id || null,
    customer: contact,
    items: orderItems,
    shippingAddress: {
      region: shippingAddress.region,
      city: shippingAddress.city,
      area: shippingAddress.area,
      landmark: shippingAddress.landmark,
      phone: contact.phone,
    },
    shippingMode: mode,
    notes: notes ? String(notes).slice(0, 1000) : undefined,
    itemsSubtotalGHS: Math.round(itemsSubtotalGHS * 100) / 100,
    shippingFeeGHS,
    customsFeeGHS,
    totalGHS,
    isGroupBuy,
    statusHistory: [{ status: "pending_payment", changedBy: req.user?._id }],
  });

  res.status(201).json(order);
});

// @desc  Public order tracking by order number (no address or contact details returned)
// @route GET /api/orders/track/:orderNumber
const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: String(req.params.orderNumber).toUpperCase() });
  if (!order) {
    res.status(404);
    throw new Error("No order found with that number");
  }
  res.json({
    orderNumber: order.orderNumber,
    status: order.status,
    statusHistory: order.statusHistory.map((h) => ({ status: h.status, note: h.note, changedAt: h.changedAt })),
    items: order.items.map((i) => ({
      name: i.name,
      image: i.image,
      quantity: i.quantity,
      unitPriceGHS: i.unitPriceGHS,
      variantSelections: i.variantSelections,
    })),
    shippingMode: order.shippingMode,
    itemsSubtotalGHS: order.itemsSubtotalGHS,
    shippingFeeGHS: order.shippingFeeGHS,
    customsFeeGHS: order.customsFeeGHS,
    totalGHS: order.totalGHS,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
  });
});

// @desc  Get logged-in user's orders
// @route GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get single order (owner or staff/admin)
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const isOwner = order.user?._id.toString() === req.user._id.toString();
  const isStaff = ["admin", "staff"].includes(req.user.role);
  if (!isOwner && !isStaff) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json(order);
});

// @desc  List all orders (admin/staff) with filters
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query).populate("user", "name email phone").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Order.countDocuments(query),
  ]);

  res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc  Update order status (admin/staff)
// @route PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.pushStatus(status, note, req.user._id);
  if (trackingNumber) order.trackingNumber = trackingNumber;
  await order.save();
  res.json(order);
});

module.exports = { createOrder, trackOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
