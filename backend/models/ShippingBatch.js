const mongoose = require("mongoose");

const shippingBatchSchema = new mongoose.Schema(
  {
    batchCode: { type: String, required: true, unique: true }, // e.g. SB-2026-08
    originPort: { type: String, default: "Guangzhou, China" },
    destinationPort: { type: String, default: "Tema Port, Ghana" },
    mode: { type: String, enum: ["sea", "air"], default: "sea" },
    departureDate: Date,
    estimatedArrivalDate: Date,
    actualArrivalDate: Date,
    status: {
      type: String,
      enum: ["preparing", "in_transit", "at_customs", "cleared", "completed"],
      default: "preparing",
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingBatch", shippingBatchSchema);
