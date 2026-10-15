// Everything brand- or contact-specific on the storefront lives here.

export const site = {
  name: "MM Collectives",
  tagline: "CHINA → GHANA IMPORTS",
  blurb: "Order products directly from China to Ghana. Fast, transparent, and reliable.",
  phoneDisplay: "+233 24 000 0000",
  phoneHref: "tel:+233240000000",
  whatsappHref: "https://wa.me/233240000000",
  email: "hello@mmcollectives.com",
  location: "Accra, Ghana",
  // Leave a URL empty to hide that icon.
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },
};

export const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/new-products", label: "New" },
  { to: "/request-product", label: "Custom Orders" },
  { to: "/track-request", label: "Track Order" },
  { to: "/about", label: "About" },
];

export const tickerMessages = [
  "Quality imports direct from China",
  "Sea & air freight to Ghana",
  "Track your order at every stage",
  "Can't find it? Request any item",
  "Group-buy discounts on bulk orders",
];

// Home page hero slides. `image` is a file in /public; remove it to fall back to the gradient.
// The /placeholders/ photos are temporary stand-ins — swap in your own before launch.
export const heroSlides = [
  {
    tagline: "China to Ghana, simplified",
    heading: "Order From China to Ghana — With Ease",
    description:
      "Browse our catalog or request any item you find online. We handle sourcing, shipping, and customs.",
    image: "/placeholders/hero-1.jpg",
    gradient: "from-secondary via-primary to-[#3d0700]",
    buttons: [
      { label: "Shop Now", link: "/products", style: "primary" },
      { label: "Request an Item", link: "/request-product", style: "outline" },
    ],
  },
  {
    tagline: "Custom sourcing",
    heading: "Seen It Online? We'll Source It.",
    description:
      "Found something on 1688, Alibaba, or Taobao? Send us the link or a description and we'll get you a quote.",
    image: "/placeholders/hero-2.jpg",
    gradient: "from-[#1a2744] via-primary to-secondary",
    buttons: [
      { label: "Start a Request", link: "/request-product", style: "primary" },
      { label: "Track a Request", link: "/track-request", style: "outline" },
    ],
  },
  {
    tagline: "Group buy",
    heading: "Buy Together, Pay Less",
    description: "Order in bulk and unlock group-buy pricing on selected products.",
    image: "/placeholders/product-vehicle-2.jpg",
    gradient: "from-primary via-[#7a0e00] to-[#1a2744]",
    buttons: [
      { label: "Shop Deals", link: "/products?tab=onSale", style: "primary" },
      { label: "All Products", link: "/products", style: "outline" },
    ],
  },
];

export const requestCategories = [
  { value: "electronics_gadgets", label: "Electronics & Gadgets" },
  { value: "fashion_clothing", label: "Fashion & Clothing" },
  { value: "home_kitchen", label: "Home & Kitchen" },
  { value: "beauty_health", label: "Beauty & Health" },
  { value: "toys_games", label: "Toys & Games" },
  { value: "auto_parts", label: "Auto Parts" },
  { value: "sports_fitness", label: "Sports & Fitness" },
  { value: "other", label: "Other / General" },
];
