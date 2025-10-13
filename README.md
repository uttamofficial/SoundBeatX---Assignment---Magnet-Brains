# 🎧 **SoundBeatX – Full-Stack E-Commerce App**  
**Built with MERN + Vite + Stripe 💳**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-Vite-blue?logo=react)](https://react.dev/)
[![Stripe](https://img.shields.io/badge/Stripe-Enabled-blueviolet?logo=stripe)](https://stripe.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](#)

---

> A modern, high-performance full-stack app featuring a **public storefront** 🛍️ and a powerful **admin panel** ⚙️ for managing products, orders, and payments.

---

## 📖 **Table of Contents**

- [🧩 Tech Stack](#-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🔐 Environment Variables](#-environment-variables)
- [⚡ Install & Run Locally](#-install--run-locally)
- [🧾 Database Seeding](#-database-seeding)
- [🌐 API Endpoints](#-api-endpoints)
- [🛣️ Frontend Routes](#️-frontend-routes)
- [🔑 Authentication](#-authentication)
- [💳 Payments (Stripe)](#-payments-stripe)
- [🌍 CORS Configuration](#-cors-configuration)
- [🧠 Troubleshooting Guide](#-troubleshooting-guide)
- [🚀 Deployment Notes](#-deployment-notes)
- [🧮 Admin Dashboard Overview](#-admin-dashboard-overview)
- [🎉 Credits](#-credits)

---

## 🧩 **Tech Stack**

**Backend:**  
🟢 Node.js • 🚀 Express.js • 🍃 MongoDB (Mongoose) • 💳 Stripe • ☁️ Cloudinary (optional)

**Frontend:**  
⚛️ React + ⚡ Vite + 🎨 TailwindCSS • 🧠 TypeScript (TSX) • 🪶 Stripe Elements • 🔐 Clerk (optional in dev)

---

## 🏗️ **Project Structure**

```
SoundBeatX-main/
  backend/
    config/              # DB/Cloudinary config
    data/                # Seed/product data
    models/              # Mongoose models (Admin, Customer, Order, Product)
    routes/              # Express routes (public + admin)
    scripts/             # DB seeding scripts
    services/            # Cloudinary service utils
    server.js            # Express entry point
    package.json

  frontend/
    public/              # Static assets
    src/
      admin/             # Admin UI
      components/        # Shared UI components
      services/          # API client (fetch backend)
      config/            # Frontend configs
      contexts/          # React contexts (Cart)
      App.tsx, main.tsx  # Entry and routing
    package.json
```

---

## ⚙️ **Prerequisites**

Before running locally, make sure you have:  
- 🟩 **Node.js** 18+  
- 🍃 **MongoDB Atlas** (or local MongoDB)  
- 💳 **Stripe Account** (test keys)  
- ☁️ **Cloudinary Account** (optional for PDF proxy)

---

## 🔐 **Environment Variables**

You’ll need **two `.env` files** — one for backend and one for frontend.

### 🖥️ **backend/.env**
```env
PORT=5010
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
DB_NAME=soundbeatx
JWT_SECRET=your_admin_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5010

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

### 💻 **frontend/.env**
```env
VITE_BACKEND_URL=http://localhost:5010

# Clerk (optional)
VITE_CLERK_USER_PUBLISHABLE_KEY=
VITE_CLERK_ADMIN_PUBLISHABLE_KEY=
VITE_CLERK_PUBLISHABLE_KEY=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary (optional)
VITE_CLOUDINARY_CLOUD_NAME=xxxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxxx
```

> 📝 **Note:** The frontend talks only to your backend REST API.  
> Clerk keys are optional — the app works fine without them during local development.

---

## ⚡ **Install & Run Locally**

### 🧠 **Backend**
```bash
cd backend
npm install
npm run seed      # Seeds DB with sample products + admins
npm run dev
```
🟢 Runs on: `http://localhost:5010`

### 💻 **Frontend (Vite + TSX)**
```bash
cd frontend
npm install
npm run dev
```
🟣 Runs on: `http://localhost:5173`

Optional type check:
```bash
npx tsc --noEmit
```

---

## 🧾 **Database Seeding**

Seeds **20 stationery products** + **2 admin users**.

📜 Script: `backend/scripts/seedMongoDB.js`  
📦 Data: `backend/data/products.js`

👤 Default Admins:
| Role | Email | Password |
|------|--------|-----------|
| 🧑‍💼 Super Admin | `admin@soundbeatx.com` | `admin123` |
| 👨‍🏭 Manager | `manager@soundbeatx.com` | `manager123` |

---

## 🌐 **API Endpoints**

### **Public Routes**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Fetch single product |
| POST | `/api/orders/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/orders/create` | Create COD order |
| POST | `/api/orders/verify-session` | Verify Stripe session |

### **Admin Routes** (🔑 JWT required)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/admin/auth/login` | Admin login (returns JWT) |
| GET | `/api/admin/products?all=true` | Get all products |
| GET | `/api/admin/products/stats/overview` | Product stats |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/orders` | View orders |
| GET | `/api/admin/orders/stats/overview` | Order stats |
| PATCH | `/api/admin/orders/:id/status` | Update order status |

### ☁️ **Cloudinary Routes (Optional)**
- `/api/cloudinary/view/:publicId`
- `/api/cloudinary/download/:publicId`

---

## 🛣️ **Frontend Routes**

| Path | Description |
|------|-------------|
| `/` | Landing Page |
| `/gadgets` | Product Listing |
| `/cart`, `/checkout`, `/payment` | Shopping Flow |
| `/order-success`, `/payment-failure`, `/orders` | Order Pages |
| `/admin/login` | Admin Login |
| `/admin/dashboard` | Admin Overview |
| `/admin/products` | Manage Products |
| `/admin/orders` | Manage Orders |

---

## 🔑 **Authentication**

- Admin panel uses **JWT-based auth**.  
- On successful login, token is saved in `localStorage` as `adminToken`.  
- All admin API calls require header:  
  ```http
  Authorization: Bearer <token>
  ```

> 🧩 Clerk integration is **optional** — app gracefully disables it if missing keys in dev mode.

---

## 💳 **Payments (Stripe)**

- Supports **Stripe test mode** ✅  
- In dev, Stripe might warn about HTTP — ignore for local use.  
- For production: use HTTPS + webhook secret.

---

## 🌍 **CORS Configuration**

Set correctly in `backend/server.js`  
- Default: `http://localhost:5173`  
- Controlled by `FRONTEND_URL` in `.env`

---

## 🧠 **Troubleshooting Guide**

| Problem | Fix |
|----------|-----|
| ❌ Frontend calling wrong server | Check `VITE_BACKEND_URL` |
| ⚠️ JSON parse error (`<!DOCTYPE ...>`) | Probably hit Vite instead of API |
| 🔁 Admin stats mismatch | Reseed DB & confirm URLs |
| 🚫 Missing Clerk keys | Ignored in dev; safe to proceed |
| 🧱 CORS errors | Match `FRONTEND_URL` correctly |

---

## 🚀 **Deployment Notes**

- Build frontend:  
  ```bash
  cd frontend && npm run build
  ```
  Output: `dist/`

- Host frontend and backend separately or together.
- Update `FRONTEND_URL` in backend `.env` to match deployed domain.
- Always set env vars securely on hosting platform.

---

## 🧮 **Admin Dashboard Overview**

👨‍💻 **Login**
- URL: `http://localhost:5173/admin/login`
- Use seeded credentials to log in  
- JWT stored in `localStorage` → used for API authorization

🧭 **Capabilities**
- 📦 **Products:** Add / Edit / Delete / View all  
- 📬 **Orders:** View & Update Status (Pending → Delivered)  
- 💰 **Payments:** Update payment status (Pending → Paid)

🔒 **Security**
- All admin APIs require JWT verification  
- Secret key set via `JWT_SECRET` in `.env`

---

## 🎉 **Credits**

> Made with ❤️ by **Uttam Kumar**  
> Full-Stack Developer | Tech Enthusiast | MERN + TypeScript + AI Integration  

---
