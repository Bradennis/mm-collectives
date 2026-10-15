// TEMPORARY stand-in images (files in /public/placeholders, taken from chinaghanaplug.com).
// They are only used when a product or category has no image of its own, so anything set
// from the admin dashboard replaces them automatically. Delete this file's usages and the
// folder before launch — the photos belong to another business.

const img = (name) => `/placeholders/${name}.jpg`;

// First matching rule wins; tested against "<category name> <product name>".
const PRODUCT_RULES = [
  { match: /fashion|wears?|cloth|shoe|bag|shirt/, images: ["product-leather-shoes-1", "product-leather-shoes-2"] },
  { match: /auto|vehicle|car\b|motor/, images: ["product-vehicle-2", "product-vehicle-1", "category-vehicles"] },
  { match: /home|kitchen|decor|appliance|cook/, images: ["product-electric-iron-1", "product-electric-iron-2", "category-home-decor"] },
  { match: /beauty|health|personal|hair|skin/, images: ["category-beauty-personal-care"] },
  { match: /sport|fitness|yoga|gym/, images: ["category-yoga-products"] },
  { match: /phone|mobile|electronic|gadget|audio|power/, images: ["category-mobile-phones", "category-electronics"] },
];

const CATEGORY_RULES = [
  { match: /fashion|wears?|cloth|shoe/, image: "product-leather-shoes-1" },
  { match: /auto|vehicle|car\b|motor/, image: "category-vehicles" },
  { match: /home|kitchen|decor/, image: "category-home-decor" },
  { match: /beauty|health|personal/, image: "category-beauty-personal-care" },
  { match: /sport|fitness|yoga/, image: "category-yoga-products" },
  { match: /phone|mobile/, image: "category-mobile-phones" },
  { match: /electronic|gadget/, image: "category-electronics" },
];

const FALLBACK_POOL = [
  "category-electronics",
  "category-home-decor",
  "category-mobile-phones",
  "category-vehicles",
  "category-beauty-personal-care",
  "category-yoga-products",
];

// Stable pick so an item keeps the same placeholder between renders and page loads
const pickFromPool = (key = "") => {
  let hash = 0;
  for (const char of String(key)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FALLBACK_POOL[hash % FALLBACK_POOL.length];
};

// A product's own images if it has any, otherwise placeholder(s)
export function productImages(product) {
  if (product.images?.length) return product.images;
  const text = `${product.category?.name || product.categoryName || ""} ${product.name || ""}`.toLowerCase();
  const rule = PRODUCT_RULES.find((r) => r.match.test(text));
  return (rule ? rule.images : [pickFromPool(product._id || product.name)]).map(img);
}

export function categoryImage(category) {
  if (category.image) return category.image;
  const rule = CATEGORY_RULES.find((r) => r.match.test(category.name.toLowerCase()));
  return img(rule ? rule.image : pickFromPool(category._id || category.name));
}
