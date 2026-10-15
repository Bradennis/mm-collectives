const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

// No 0/O/1/I so a reference read out over the phone or WhatsApp can't be mistyped.
const makeReference = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

const importRequestSchema = new mongoose.Schema(
  {
    // sparse: requests created before reference numbers existed have none
    referenceNumber: { type: String, unique: true, sparse: true, default: () => `MMR-${makeReference()}` },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = guest request
    contact: { name: String, email: String, phone: String },
    productName: String,
    category: String,
    brand: String,
    productLink: String, // e.g. link to 1688/Alibaba/Taobao listing
    productImage: String,
    description: String,
    quantity: { type: Number, default: 1 },
    deliveryAddress: String,
    additionalNotes: String,
    estimatedUnitCostGHS: Number,
    estimatedShippingGHS: Number,
    quotedTotalGHS: Number,
    status: {
      type: String,
      enum: ["submitted", "quoted", "accepted", "rejected", "converted_to_order", "expired"],
      default: "submitted",
    },
    adminNote: String,
    quotedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quotedAt: Date,
    convertedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportRequest", importRequestSchema);
