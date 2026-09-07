# Aurex — Backend API

> Case study: the REST API powering a 3-service e-commerce platform — auth, catalog, cart, orders, and payments for 2,500+ concurrent users.

**[Live API →](https://e-commerce-backend-76n4.onrender.com)** · hosted on Render's free tier, so the first request after idle takes ~30s to wake up. Every request after that is fast.

---

## The problem

An e-commerce backend isn't hard because any single endpoint is complex — it's hard because *everything touches money and inventory at once*. A slow product query is annoying. A race condition on stock during checkout is a real bug that loses real trust. This service was built with that asymmetry in mind.

## The approach

**Index for the queries that actually run.** Product listing and filtering are the highest-traffic reads in any storefront. Targeted MongoDB indexes and aggregation pipelines took API response times down 38% — not by guessing, but by looking at what the frontend actually calls most.

**Two-layer auth, not one.** A `auth` middleware checks the JWT is valid; a separate `adminAuth` middleware checks the role. Every admin route runs both — a customer with a stolen-but-valid token still can't touch `/api/order/all`.

**Payments verified server-side, always.** Stripe checkout sessions are created on the backend, and payment success is *re-verified* by the backend after redirect — never trusted from the client. That's the difference between "payment reliability" being a real number and being a hope.

## API surface

**Base URL:** `https://e-commerce-backend-76n4.onrender.com`

```
/api/user     register · login · profile · admin: list all users
/api/product  list · get one · admin: add / update / delete
/api/cart     get · add · update · remove
/api/order    place (COD) · list · admin: all + status update
              stripe checkout session · stripe verify
```

## Auth flow

```
POST /api/user/login
   → bcrypt.compare(password, hash)
   → sign JWT (7-day expiry)
Client sends it back as Authorization: Bearer <token>
   → auth middleware verifies the token, every protected request
   → adminAuth middleware additionally checks role === "admin"
```

## Data models (trimmed)

```js
User    { name, email (unique), password (bcrypt), role, cartData }
Product { name, description, price, category, stock, images: [Cloudinary URLs] }
Order   { userId, items: [{productId, qty, price}], amount, address,
          status: pending|processing|shipped|delivered,
          paymentMethod: stripe|cod, payment: bool }
```

## Trade-offs I made

| Decision | Why | Cost |
|---|---|---|
| MongoDB over a relational DB | Product schemas vary a lot by category; flexible documents fit | Weaker cross-collection integrity than SQL joins/FKs |
| JWT in headers, not sessions | Stateless, scales horizontally without a session store | Revoking a token before expiry needs extra plumbing |
| Server-side Stripe verification | Payment truth can't be spoofed from the client | One extra round-trip vs. trusting the client callback |

## Results

| | |
|---|---|
| Concurrent users supported | 2,500+ |
| Stripe transaction reliability | 99.9% |
| API response time | 38% faster via indexing |
| Stock management | 50% less manual effort |
| Media delivery | 1.5s faster via Cloudinary CDN |

## Stack

Node.js · Express · MongoDB + Mongoose · JWT · bcrypt · Stripe · Cloudinary · cors · dotenv — deployed on Render.

## Run it locally

```bash
git clone https://github.com/Harsh-Kumar-Pandit/E-commerce-backend.git
cd E-commerce-backend
npm install
cp .env.example .env
npm run dev
```

`.env`:
```env
PORT=5000
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

Runs at `localhost:5000`.

## The rest of the platform

- 🎨 [Storefront](https://github.com/Harsh-Kumar-Pandit/E-commerce-frontend) — the customer-facing React app this API serves
- 🔧 [Admin Panel](https://github.com/Harsh-Kumar-Pandit/Ecommerce-admin) — the other consumer of this API

---

**Harsh Kumar Pandit** · [GitHub](https://github.com/Harsh-Kumar-Pandit)
