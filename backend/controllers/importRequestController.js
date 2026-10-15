const asyncHandler = require("express-async-handler");
const ImportRequest = require("../models/ImportRequest");

const clean = (value, max = 500) => (value == null ? undefined : String(value).trim().slice(0, max) || undefined);

// @desc  Submit a custom import request (logged-in customer or guest)
// @route POST /api/import-requests
const createImportRequest = asyncHandler(async (req, res) => {
  const body = req.body;
  const contact = {
    name: clean(body.name || req.user?.name, 80),
    email: clean(body.email || req.user?.email, 120),
    phone: clean(body.phone || req.user?.phone, 30),
  };
  const productName = clean(body.productName, 160);
  const description = clean(body.description, 2000);
  const productLink = clean(body.productLink, 600);

  if (!productName && !description) {
    res.status(400);
    throw new Error("Tell us which product you want");
  }
  if (!contact.name || (!contact.email && !contact.phone)) {
    res.status(400);
    throw new Error("Your name and an email or phone number are required");
  }
  if (productLink && !/^https?:\/\//i.test(productLink)) {
    res.status(400);
    throw new Error("Product link must start with http:// or https://");
  }

  // Whitelisted fields only: status and quote amounts are staff-controlled.
  const request = await ImportRequest.create({
    user: req.user?._id || null,
    contact,
    productName,
    category: clean(body.category, 60),
    brand: clean(body.brand, 80),
    productLink,
    description,
    quantity: Math.max(1, Math.floor(Number(body.quantity)) || 1),
    deliveryAddress: clean(body.deliveryAddress, 300),
    additionalNotes: clean(body.additionalNotes, 1000),
  });
  res.status(201).json(request);
});

// @desc  Public request tracking by reference number (no contact details returned)
// @route GET /api/import-requests/track/:reference
const trackImportRequest = asyncHandler(async (req, res) => {
  const request = await ImportRequest.findOne({ referenceNumber: String(req.params.reference).toUpperCase() });
  if (!request) {
    res.status(404);
    throw new Error("No request found with that reference number");
  }
  res.json({
    referenceNumber: request.referenceNumber,
    status: request.status,
    productName: request.productName,
    category: request.category,
    brand: request.brand,
    description: request.description,
    quantity: request.quantity,
    quotedTotalGHS: request.quotedTotalGHS,
    adminNote: request.adminNote,
    quotedAt: request.quotedAt,
    createdAt: request.createdAt,
  });
});

// @desc  Get my import requests
// @route GET /api/import-requests/mine
const getMyImportRequests = asyncHandler(async (req, res) => {
  const requests = await ImportRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
});

// @desc  List all import requests (admin/staff)
// @route GET /api/import-requests
const getAllImportRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const requests = await ImportRequest.find(query).populate("user", "name email phone").sort({ createdAt: -1 });
  res.json(requests);
});

// @desc  Quote a request (admin/staff)
// @route PATCH /api/import-requests/:id/quote
const quoteImportRequest = asyncHandler(async (req, res) => {
  const { estimatedUnitCostGHS, estimatedShippingGHS, adminNote } = req.body;
  const request = await ImportRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Import request not found");
  }

  request.estimatedUnitCostGHS = estimatedUnitCostGHS;
  request.estimatedShippingGHS = estimatedShippingGHS;
  request.quotedTotalGHS = (estimatedUnitCostGHS * request.quantity) + estimatedShippingGHS;
  request.adminNote = adminNote;
  request.status = "quoted";
  request.quotedBy = req.user._id;
  request.quotedAt = new Date();
  await request.save();

  res.json(request);
});

// @desc  Customer accepts/rejects a quote
// @route PATCH /api/import-requests/:id/respond
const respondToQuote = asyncHandler(async (req, res) => {
  const { accept } = req.body;
  const request = await ImportRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Import request not found");
  }
  if (!request.user || !request.user.equals(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to respond to this quote");
  }
  request.status = accept ? "accepted" : "rejected";
  await request.save();
  res.json(request);
});

module.exports = {
  createImportRequest,
  trackImportRequest,
  getMyImportRequests,
  getAllImportRequests,
  quoteImportRequest,
  respondToQuote,
};
