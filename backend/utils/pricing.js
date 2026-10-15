// Single source of truth for what a customer pays per unit.
// Sale price (if valid) replaces the list price; group-buy discount applies on top once the quantity threshold is met.

function getUnitPriceGHS(product, quantity = 1) {
  const base = product.priceGHS;
  const onSale = product.salePriceGHS > 0 && product.salePriceGHS < base;
  let unit = onSale ? product.salePriceGHS : base;

  const groupBuy =
    product.minGroupBuyQty > 0 && product.groupBuyDiscountPct > 0 && quantity >= product.minGroupBuyQty;
  if (groupBuy) unit *= 1 - product.groupBuyDiscountPct / 100;

  return { unitPriceGHS: Math.round(unit * 100) / 100, groupBuy };
}

module.exports = { getUnitPriceGHS };
