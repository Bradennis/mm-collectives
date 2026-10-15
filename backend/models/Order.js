const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    variantSelections: mongoose.Schema.Types.Mixed, // { Color: "Red", Size: "M" }
    quantity: { type: Number, required: true, default: 1 },
    unitPriceGHS: { type: Number, required: true },
  },
  { _id: false }
);

const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "ordered_from_china",
  "shipped_from_china",
  "arrived_ghana_customs",
  "cleared_customs",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, default: () => `MMC-${nanoid(8).toUpperCase()}` },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = guest order
    customer: { name: String, email: String, phone: String },
    items: [orderItemSchema],
    shippingAddress: {
      region: String,
      city: String,
      area: String,
      landmark: String,
      phone: String,
    },
    shippingMode: { type: String, enum: ["sea", "air"], default: "sea" },
    notes: String,
    itemsSubtotalGHS: { type: Number, required: true },
    shippingFeeGHS: { type: Number, default: 0 },
    customsFeeGHS: { type: Number, default: 0 },
    totalGHS: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["momo", "card", "cash_on_delivery", "unpaid"], default: "unpaid" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending_payment" },
    statusHistory: [statusHistorySchema],
    shippingBatch: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingBatch", default: null },
    trackingNumber: String,
    isGroupBuy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.methods.pushStatus = function (status, note, userId) {
  this.status = status;
  this.statusHistory.push({ status, note, changedBy: userId });
};

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
