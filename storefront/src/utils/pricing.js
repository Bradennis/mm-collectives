// Mirrors backend/utils/pricing.js so the cart shows what the order will charge.

const NEW_ARRIVAL_DAYS = 30;
const LOW_STOCK_THRESHOLD = 5;

export const formatGHS = (amount) =>
  Number(amount || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function getPricing(product, quantity = 1) {
  const base = Number(product.priceGHS) || 0;
  const onSale = product.salePriceGHS > 0 && product.salePriceGHS < base;
  let unit = onSale ? product.salePriceGHS : base;

  const groupBuy =
    product.minGroupBuyQty > 0 && product.groupBuyDiscountPct > 0 && quantity >= product.minGroupBuyQty;
  if (groupBuy) unit *= 1 - product.groupBuyDiscountPct / 100;

  return {
    unit: Math.round(unit * 100) / 100,
    original: onSale || groupBuy ? base : null,
    onSale,
    groupBuy,
    discountPct: onSale ? Math.round((1 - product.salePriceGHS / base) * 100) : 0,
  };
}

export const isInStock = (product) => Number(product.stock) > 0;
export const isLowStock = (product) => isInStock(product) && product.stock <= LOW_STOCK_THRESHOLD;

export const isNewArrival = (product) =>
  Boolean(product.isNewArrival) ||
  (Boolean(product.createdAt) &&
    Date.now() - new Date(product.createdAt).getTime() < NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000);
