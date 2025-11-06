# Mock E‑Com Cart (Vibe Commerce Screening)

Minimal full‑stack shopping cart demonstrating product listing, cart, and mock checkout. Built to assess UI, API, and DB integration.

## Tech Stack

- Frontend: React (Vite, JavaScript), React Router
- Styling: CSS with custom light theme (CSS variables in `src/theme.css` + `src/style.css`)
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- API: REST

## Architecture

Monorepo with two apps:

- `backend/`: Express server, Mongoose models, REST endpoints, seeding
- `frontend/`: React SPA, routes, components, theme

Top‑level user flow:
1) User browses products → 2) Adds items to cart → 3) Reviews cart and adjusts qty → 4) Proceeds to checkout → 5) Submits name/email and receives a mock receipt

## Backend

Directory layout

- `src/index.js` — app bootstrap, Mongo connection, CORS, routes, error middleware
- `src/models/Product.js` — Product schema `{ name, price, image, description }`
- `src/models/CartItem.js` — CartItem schema `{ userId, product, qty }` with unique index per user+product
- `src/routes/products.js` — GET `/api/products`
- `src/routes/cart.js` — GET `/api/cart`, POST `/api/cart`, PATCH `/api/cart/:id`, DELETE `/api/cart/:id`
- `src/routes/checkout.js` — POST `/api/checkout` returns `{ receipt: { id, total, timestamp } }` and clears cart
- `src/middleware/error.js` — 404 and centralized error handling
- `src/seed.js` — Upserts demo products (uses Unsplash images)

Environment

- `PORT` (default 4000)
- `CLIENT_ORIGIN` (default http://localhost:5173)
- `MONGODB_URI` (default provided but override via `.env` for production)

API Endpoints

- GET `/api/products` → list products
- GET `/api/cart` → cart items + total for mock user
- POST `/api/cart` → body `{ productId, qty }`
- PATCH `/api/cart/:id` → body `{ qty }`
- DELETE `/api/cart/:id`
- POST `/api/checkout` → body `{ name, email, cartItems? }` returns `receipt`

Data Models

- Product: `{ _id, name, price(Number), image(String), description(String) }`
- CartItem: `{ _id, userId(String), product(ObjectId→Product), qty(Number) }`

Seeding (demo products)

Images from Unsplash are used as placeholders:
- `https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1200`
- `https://images.unsplash.com/photo-1590080875831-c9a7b3a5f35a?w=1200`
- `https://images.unsplash.com/photo-1606813909027-3884cf06b9e8?w=1200`
- `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200`
- `https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200`

## Frontend

Directory layout

- `src/main.jsx` — App entry, routes
- `src/theme.css` — light theme variables (background, surface, primary, text, borders, shadow)
- `src/style.css` — structural styles (grid, cards, forms, modal)
- `src/components/Header.jsx` — fixed navbar (Home removed; Products default)
- `src/components/Button.jsx` — button variants: default, primary, ghost
- `src/components/ProductCard.jsx` — image, title, price, add‑to‑cart
- `src/pages/Products.jsx` — products grid, add to cart
- `src/pages/Cart.jsx` — quantity update, remove, totals
- `src/pages/Checkout.jsx` — form + receipt modal; includes per‑item selection via checkboxes
- `src/utils/currency.js` — `formatINR()` for INR currency formatting

Design System (Light Theme)

CSS variables defined in `src/theme.css`:

- `--background: #FFFFFF` (app background)
- `--surface: #FFFFFF` (cards/navbar)
- `--primary: #2563EB`, `--primary-light: #EFF6FF`
- `--text-primary: #111827`, `--text-secondary: #6B7280`
- `--border-color: #E5E7EB`, `--shadow-color: rgba(0,0,0,0.05)`
- `--success: #10B981`, `--error: #EF4444`, `--warning: #F59E0B`

Typography & Components

- Font: Inter/Roboto fallbacks; headings use `--text-primary`, body uses `--text-secondary`
- ProductCard: rounded corners, surface background, subtle shadow; bold/darker titles; INR price
- Buttons: `.btn`, `.btn-primary`, `.btn-ghost` with hover/focus/active states
- Navbar: sticky, light surface, soft shadow, active/hover states
- Containers: `.container` with max‑width and responsive padding

Responsive Behavior

- Mobile‑first grid for products (`.grid` auto‑fill minmax)
- Navbar adapts spacing; cart rows collapse on small screens

INR Currency

- All prices rendered via `formatINR()` (en‑IN locale, currency INR)

## Getting Started

Prereqs: Node 18+ and MongoDB (Atlas or local).

Backend

```
cd backend
npm install
npm run seed   # seeds/updates demo products
npm run dev    # http://localhost:4000
```

Frontend

```
cd frontend
npm install
npm run dev    # http://localhost:5173
```

## Scripts

- Backend: `dev`, `start`, `seed`
- Frontend: `dev`, `build`, `preview`

## Notes

- Mock user used for cart (no auth)
- Checkout is mock only; returns a generated receipt and clears the cart
- Errors surfaced with simple JSON responses

## Demo Video

[[Watch the video]](https://www.youtube.com/watch?v=XxtFChB8LFU))


## Screenshots


### 🏠 Homepage
![Homepage](https://github.com/AjayLohith/Ecom/blob/main/frontend/src/assets/homepage.png?raw=true)

### 🛒 Cart Page
![Cart Page](https://github.com/AjayLohith/Ecom/blob/main/frontend/src/assets/cart-page.png?raw=true)

### 💳 Checkout Page
![Checkout Page](https://github.com/AjayLohith/Ecom/blob/main/frontend/src/assets/checkout-page.png?raw=true)

### 🗄️ MongoDB Data
![MongoDB Data](https://github.com/AjayLohith/Ecom/blob/main/frontend/src/assets/mongoDb-data.png?raw=true)


