// Simple weight-based shipping + customs estimate calculator.
// Rates are placeholders — tune to real freight/customs rates.

const RATE_PER_KG_SEA_GHS = 45;
const RATE_PER_KG_AIR_GHS = 90;
const CUSTOMS_FLAT_RATE_PCT = 0.12; // 12% of item value as a rough customs estimate

function calculateShipping({ totalWeightKg = 0, itemsSubtotalGHS = 0, mode = "sea" }) {
  const ratePerKg = mode === "air" ? RATE_PER_KG_AIR_GHS : RATE_PER_KG_SEA_GHS;
  const shippingFeeGHS = Math.max(totalWeightKg, 0.5) * ratePerKg;
  const customsFeeGHS = itemsSubtotalGHS * CUSTOMS_FLAT_RATE_PCT;

  return {
    shippingFeeGHS: Math.round(shippingFeeGHS * 100) / 100,
    customsFeeGHS: Math.round(customsFeeGHS * 100) / 100,
    totalGHS: Math.round((itemsSubtotalGHS + shippingFeeGHS + customsFeeGHS) * 100) / 100,
  };
}

module.exports = { calculateShipping };
