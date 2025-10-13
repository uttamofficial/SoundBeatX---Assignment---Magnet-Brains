# SoundBeatX – Full-Stack App (MongoDB + Express + React + Vite + Stripe)

SoundBeatX is a full-stack ecommerce-style app with a public storefront and an admin panel.
- Backend: Node.js/Express, MongoDB (Mongoose), Stripe (payments), Cloudinary proxy (optional)
- Frontend: React + Vite + Tailwind, TypeScript/TSX, Stripe Elements, optional Clerk in dev

This README explains architecture, setup, environment variables, how to seed and run locally, and key endpoints.

## Project Structure

```
SoundBeatX-main/
  backend/
    config/              # DB/Cloudinary config
    data/                # Seed/product data (stationery)
    models/              # Mongoose models: Admin, Customer, Order, Product
    routes/              # Express routes (public + admin)
    scripts/             # Database seeding scripts
    services/            # Cloudinary service utilities
    server.js            # Express app entry
    package.json

  frontend/
    public/              # Static assets
    src/
      admin/             # Admin UI (Dashboard, Products, Orders)
      components/        # Shared UI components (Navbar, Cards, etc.)
      services/          # API clients (fetch backend only)
      config/            # Frontend config (Cloudinary)
      contexts/          # App contexts (Cart)
      App.tsx, main.tsx  # Frontend entry and routes (TypeScript/TSX)
    package.json
```

## Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- Stripe account (test keys)
- Cloudinary account (optional for PDF proxy endpoints)

## Environment Variables
Create two .env files (one per app).

### backend/.env
```
PORT=5010
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
DB_NAME=soundbeatx
JWT_SECRET=your_admin_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx   # optional if using webhooks

# Frontend URL (for CORS and Stripe redirects)
FRONTEND_URL=http://localhost:5173

# Cloudinary (optional for /api/cloudinary/* endpoints)
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Optional (for logs)
BACKEND_URL=http://localhost:5010
```

### frontend/.env
```
VITE_BACKEND_URL=http://localhost:5010

# Clerk (optional in dev; provider tolerates missing keys in dev)
VITE_CLERK_USER_PUBLISHABLE_KEY=
VITE_CLERK_ADMIN_PUBLISHABLE_KEY=
VITE_CLERK_PUBLISHABLE_KEY=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary (optional)
VITE_CLOUDINARY_CLOUD_NAME=xxxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxxx
```

Notes
- Frontend uses only the backend REST API. Supabase was removed.
- If Clerk keys are not present in dev, the app renders without Clerk to avoid crashes.

## Install & Run
Open two terminals (backend and frontend).

### Backend
```
cd backend
npm install
# Seed DB with 20 stationery products + sample admins
npm run seed
# Start API
npm run dev
```
Backend runs at: http://localhost:5010

### Frontend (TypeScript/TSX)
```
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

Optional: run a TypeScript type-check (no emit):
```
cd frontend
npx tsc --noEmit
```

## Seeding Data
We seed 20 stationery products and two admin users.
- Script: backend/scripts/seedMongoDB.js
- Data source: backend/data/products.js (stationery-style items for user site)

Default admin accounts (from seed):
- admin@soundbeatx.com / admin123
- manager@soundbeatx.com / manager123

## Key Endpoints

Public
- GET /api/products – list products (MongoDB)
- GET /api/products/:id – get product by ObjectId
- POST /api/orders/create-payment-intent – create Stripe payment intent
- POST /api/orders/create – create a COD order
- POST /api/orders/verify-session – verify Stripe checkout session

Admin (requires Bearer token from POST /api/admin/auth/login)
- POST /api/admin/auth/login – returns JWT
- GET /api/admin/products?all=true – all products (no pagination)
- GET /api/admin/products/stats/overview – product count
- POST /api/admin/products – create
- PUT /api/admin/products/:id – update
- DELETE /api/admin/products/:id – delete
- GET /api/admin/orders – list orders (pagination/filter)
- GET /api/admin/orders/stats/overview – orders count, revenue, status counts
- PATCH /api/admin/orders/:id/status – update order/payment status

Cloudinary (optional)
- GET /api/cloudinary/view/:publicId – proxy view
- GET /api/cloudinary/download/:publicId – proxy download

## Frontend Routes
- / – Landing
- /gadgets – Products (from /api/products)
- /cart, /checkout, /payment, /order-success, /payment-failure, /orders
- Admin: /admin/login, /admin/dashboard, /admin/products, /admin/orders

## Authentication
- Admin panel uses custom JWT (/api/admin/auth/login). Store token in localStorage as `adminToken`. Frontend sends `Authorization: Bearer <token>`.
- Clerk components are wrapped with a route-aware provider that tolerates missing keys in dev. You can remove Clerk entirely if not needed.

## Payments
- Stripe test mode supported. In dev, Stripe warns about HTTP; this is expected. For production, serve over HTTPS and set proper webhook secret if using webhooks.

## CORS
- Configured in backend/server.js. Defaults to `http://localhost:5173` and `FRONTEND_URL`.

## Troubleshooting
- Frontend calling wrong server: set `VITE_BACKEND_URL` and restart `npm run dev`.
- JSON parse error with `<!DOCTYPE ...>`: request likely hit the Vite dev server; set `VITE_BACKEND_URL` correctly.
- Admin stats/product mismatch: reseed DB and ensure frontend points to the same backend.
- Missing Clerk keys error: in dev, `DualClerkProvider` renders without Clerk and logs a warning.
- CORS errors: verify `FRONTEND_URL` in backend .env matches the actual frontend origin.

## Deployment Notes
- Build frontend: `cd frontend && npm run build` (outputs `dist/`)
- Serve frontend behind your web host; set backend `FRONTEND_URL` to the deployed origin.
- Ensure env vars are set securely in hosting for both services.

## Admin Dashboard

Admin users are seeded in MongoDB and can log in to the dashboard to manage the store.

Admin Users Created in MongoDB:
- Super Admin: admin@soundbeatx.com / admin123
- Manager: manager@soundbeatx.com / manager123

Login
- Open http://localhost:5173/admin/login
- Enter one of the credentials above
- On success, a JWT is stored as `adminToken` in localStorage and used for admin API requests

Capabilities
- Products
  - Add new products (name, description, price, category, image)
  - Update existing products
  - Delete products
  - View all products (admin endpoint uses `?all=true` to avoid pagination)
- Orders
  - View placed orders with items and customer shipping details
  - Update order status: Pending → Processing → Shipped → Delivered (or Cancelled)
  - Update payment status (e.g., Pending → Paid)

Where to manage
- Dashboard: http://localhost:5173/admin/dashboard – KPIs, quick links
- Products: http://localhost:5173/admin/products – add/edit/delete products
- Orders: http://localhost:5173/admin/orders – view orders and update status/payment

Security notes
- All admin routes require `Authorization: Bearer <adminToken>` from `/api/admin/auth/login`
- JWT secret configured via `JWT_SECRET` in backend `.env`
