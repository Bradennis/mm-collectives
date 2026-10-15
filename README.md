# MM Collectives — Import & Order Platform

A China → Ghana import/order e-commerce platform, inspired by the China Ghana Plug business model (custom item sourcing + quoting + shipment tracking), rebuilt from scratch with original design, code, and branding.

## Structure

```
mm-collectives/
├── backend/      Express + MongoDB API (auth, products, orders, import requests, analytics)
├── storefront/   Customer-facing React app (red + orange theme, Tailwind CSS)
└── admin/        Admin dashboard React app (indigo + slate theme — deliberately distinct from storefront)
```

## Feature Set

**Storefront** (layout and flows modelled on chinaghanaplug.com; Tailwind CSS)
- Scrolling announcement ticker, sticky nav with wishlist/cart badges, slide-out mobile menu, WhatsApp button
- Home: swipeable hero slider with stats bar, category tiles, sale banner, featured products
- Product listing with tabs (All / Featured / New / Bestsellers / On Sale), live search, category filter, sort, pagination
- Product page: gallery, variants (size/color), quantity, sale + group-buy pricing, reviews, related products
- Wishlist and cart saved in the browser (no account needed)
- Two-step cart: review, then delivery details + sea/air choice. Guests can order; no payment is taken online
- Automatic shipping + customs estimate based on item weight, shown on the order confirmation
- "Custom Orders": three-step request form for items not in the catalog, returns an MMR- reference number
- "Track Order": public lookup by order number (MMC-) or request reference (MMR-) with a status timeline
- Customer accounts remain optional (order history, request history, accept/decline quotes)
- Brand name, contacts, ticker text and hero slides: `storefront/src/config/site.js`. Colours: `storefront/src/styles/theme.css`
**Admin Dashboard**
- Analytics: revenue over time, orders-by-status breakdown, top-selling products, import-request conversion funnel
- Order management: update status along the full China→Ghana pipeline, add tracking numbers, view status history
- Product management: CRUD, margin visibility (cost vs. sell price), sale price, image URLs, New/Bestseller badges, group-buy settings
- Import request queue: quote custom requests, track submitted → quoted → accepted → converted
- Customer management: spend/order stats, suspend/reactivate accounts
- Role-based access: admin vs. staff

**Placeholder images (temporary)**
- `storefront/public/placeholders/` holds photos copied from chinaghanaplug.com. They appear only where a product, category or hero slide has no image of its own (`storefront/src/utils/placeholders.js`, `storefront/src/config/site.js`), so images set from the admin replace them automatically.
- They belong to another business: replace them and delete the folder before going live.

**Not yet built (flagged for next steps)**
- Payment gateway integration (Paystack/Hubtel for Mobile Money + card) — intentionally skipped this round
- Image upload (products take image URLs, one per line in the admin form; the request form has no photo upload)
- Admin-managed hero slides (currently edited in `storefront/src/config/site.js`)
- Category images (the `image` field exists on Category but has no admin page)
- SMS/email notifications on status change
- Shipping batch UI (the `ShippingBatch` model exists in the backend but has no admin page yet)

## Getting Started

### 1. Backend
```bash
cd backend
cp .env.example .env    # then edit MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed             # WIPES users/categories/products, then creates a demo admin (admin@mmcollectives.com / ChangeMe123!) + sample products
npm run seed:catalog     # optional: adds sample categories/products only if missing, deletes nothing
npm run dev              # runs on http://localhost:5000
```

### 2. Storefront
```bash
cd storefront
npm install
npm run dev               # runs on http://localhost:5173
```

### 3. Admin Dashboard
```bash
cd admin
npm install
npm run dev               # runs on http://localhost:5174
```

Log into the admin dashboard with the seeded admin account above.

## Notes on Design
The two frontends use separate CSS variable palettes (`storefront/src/styles/theme.css` vs `admin/src/styles/theme.css`) so they never look like the same product to an end user — storefront leans warm/market (deep red + orange), admin leans operational (indigo/slate + cyan chart accents).

## Suggested Next Steps
1. Wire in Paystack or Hubtel for Mobile Money + card payments (update `paymentStatus`/`paymentMethod` on `Order` after a successful charge).
2. Add image upload (e.g. Cloudinary or S3) for products and import-request photos.
3. Build the Shipping Batch admin page to bulk-assign orders to a container/flight and update statuses in bulk.
4. Add SMS notifications (e.g. via a Ghana-focused SMS gateway) when order status changes.

## Deployment
| Part | Host | URL |
|---|---|---|
| Storefront (`storefront/`) | Vercel | https://mm-collectives.vercel.app |
| Admin (`admin/`) | Vercel | https://mm-collectives-admin.vercel.app |
| API (`backend/`) | Render | https://mm-collectives-api.onrender.com |

- Pushing to `main` on GitHub redeploys automatically: both Vercel sites rebuild on every push (about a minute), and Render redeploys the API when `backend/` changes (a few minutes).
- Both Vercel sites forward `/api/*` to the Render API (`vercel.json`), so the browser only ever talks to one domain.
- API environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_URL`, ...) are set in the Render dashboard, never in the repo.
- `GET /api/health` reports the commit the API is running.
