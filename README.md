# Kartly

A full-stack, production-ready e-commerce platform built with a React frontend and a Node.js/Express backend. Kartly delivers a seamless shopping experience — from product discovery and cart management to secure checkout and order tracking.

---

## Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Docker](#docker)
- [Backend](#backend)
  - [Project Structure](#backend-project-structure)
  - [API Reference](#api-reference)
  - [Data Models](#data-models)
  - [Security](#security)
  - [Scripts](#backend-scripts)
- [Frontend](#frontend)
  - [Project Structure](#frontend-project-structure)
  - [Scripts](#frontend-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Kartly is a monorepo containing two independent packages:

| Package    | Description                                              |
| ---------- | -------------------------------------------------------- |
| `backend`  | REST API — Node.js, Express 5, MongoDB, Redis            |
| `frontend` | Web storefront — React 19, Vite, Tailwind CSS, Redux RTK |

Both packages are managed with **pnpm workspaces**.

---

## Monorepo Structure

```
kartly/
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── api/            # Feature route handlers (auth, products, cart, …)
│   │   ├── config/         # DB, Firebase Admin, JWT config
│   │   ├── helpers/        # Shared utility helpers
│   │   ├── middleware/     # Express middleware (auth, etc.)
│   │   ├── models/         # Mongoose models
│   │   ├── services/       # External service clients (Redis)
│   │   ├── types/          # TypeScript type declarations
│   │   ├── app.ts          # Express app setup
│   │   ├── index.ts        # Server entry point
│   │   └── routes.ts       # Top-level route registration
│   ├── dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite web application
│   ├── src/
│   │   ├── app/            # Redux store, providers, and routing
│   │   ├── components/     # Shared UI and layout components
│   │   ├── config/         # App-wide configuration and env helpers
│   │   ├── features/       # Feature-based modules (auth, cart, orders, …)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Third-party library setup (axios, query client)
│   │   ├── pages/          # Top-level route page components
│   │   ├── styles/         # Global CSS, fonts, and design tokens
│   │   ├── tests/          # Unit and integration tests
│   │   ├── types/          # Shared TypeScript types
│   │   └── utils/          # Pure utility functions
│   ├── dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

---

## Tech Stack

### Backend

| Layer            | Technology           |
| ---------------- | -------------------- |
| Runtime          | Node.js 22           |
| Language         | TypeScript           |
| Framework        | Express 5            |
| Database         | MongoDB (Mongoose)   |
| Cache / Sessions | Redis (ioredis)      |
| Auth             | JWT + Firebase Admin |
| Password Hashing | bcrypt               |
| Logging          | Pino + pino-pretty   |
| Validation       | Zod                  |
| ID Generation    | Snowflake ID         |
| Package Manager  | pnpm                 |

### Frontend

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Framework        | React 19 + TypeScript       |
| Build Tool       | Vite                        |
| Styling          | Tailwind CSS v4             |
| State Management | Redux Toolkit + React Redux |
| Server State     | TanStack React Query v5     |
| Routing          | React Router DOM v7         |
| Forms            | React Hook Form + Zod       |
| HTTP Client      | Axios                       |
| Icons            | Lucide React                |
| Package Manager  | pnpm                        |

---

## Features

- **Authentication & Sessions** — Register, sign in, token refresh, and secure session management with JWT access/refresh token pairs
- **User Profiles & Addresses** — Extended profile management and multiple saved delivery addresses per user
- **Product Catalogue** — Browse, search, and filter products by category, price, and rating with full CRUD for admins
- **Categories** — Hierarchical category tree for organising products
- **Shopping Cart** — Persistent cart with real-time totals and individual line-item management
- **Wishlist** — Save products for later with user-scoped wishlists
- **Order Management** — Place orders, track order status, and manage order line items
- **Checkout Flow** — Address, shipping, and payment steps with order summary
- **Email & Mobile Verification** — OTP-based verification for user email and mobile number
- **Admin Controls** — Role-based access for administrative operations
- **Caching** — Redis-backed caching for sessions and frequently accessed data
- **Rate Limiting** — Per-IP request throttling to prevent abuse
- **Responsive Design** — Optimised for desktop, tablet, and mobile

---

## Getting Started

### Prerequisites

| Requirement | Version |
| ----------- | ------- |
| Node.js     | ≥ 22    |
| pnpm        | ≥ 9     |
| MongoDB     | any     |
| Redis       | any     |

### Installation

```bash
# Clone the repository
git clone https://github.com/ShivanshTiwari01/kartly.git
cd kartly

# Install all workspace dependencies
pnpm install
```

### Environment Variables

#### Backend — `backend/.env`

Create a `.env` file inside the `backend/` directory. All variables are required unless marked optional.

```env
# Server
NODE_ENV=development
PORT=5001

# MongoDB
MONGO_URI=mongodb://localhost:27017/kartly

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Firebase (optional — for social auth / push notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

#### Frontend — `frontend/.env`

Create a `.env` file inside the `frontend/` directory.

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_APP_NAME=Kartly
```

> All client-side variables must be prefixed with `VITE_`. **Never commit `.env` files to version control.**

### Running the App

```bash
# Run the backend development server (from backend/)
cd backend
pnpm dev

# Run the frontend development server (from frontend/)
cd frontend
pnpm dev
```

The API will be available at `http://localhost:5001` and the frontend at `http://localhost:5173`.

---

## Backend

### Backend Project Structure

```
src/
├── api/
│   ├── auth/               # Auth routes, controller, validation, helpers
│   ├── users/              # User profile & address routes
│   ├── products/           # Product & product-details routes
│   ├── categories/         # Category routes
│   ├── cart/               # Cart & cart-item routes
│   ├── wishlist/           # Wishlist routes
│   └── orders/             # Order routes
├── config/
│   ├── db.ts               # MongoDB connection
│   ├── firebase_admin.ts   # Firebase Admin SDK setup
│   └── jwt.ts              # JWT config
├── helpers/                # Utility helpers (auth tokens, passwords, IDs, etc.)
├── middleware/
│   └── authentication.ts   # JWT auth middleware
├── models/                 # Mongoose models
├── services/
│   └── redis.ts            # Redis client (ioredis)
├── types/                  # Custom TypeScript type declarations
├── app.ts                  # Express app setup & middleware
├── index.ts                # Server entry point
└── routes.ts               # Top-level route registration
```

### API Reference

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <accessToken>` header.

#### Authentication — `/api/auth`

| Method | Endpoint                    | Auth | Description                                  |
| ------ | --------------------------- | :--: | -------------------------------------------- |
| `POST` | `/api/auth/register`        |  No  | Register a new user                          |
| `POST` | `/api/auth/signin`          |  No  | Sign in, receive access + refresh tokens     |
| `POST` | `/api/auth/refresh-token`   | Yes  | Issue a new access token using refresh token |
| `POST` | `/api/auth/signout`         | Yes  | Invalidate the current session               |
| `POST` | `/api/auth/verify-email`    | Yes  | Verify user email address with OTP           |
| `POST` | `/api/auth/verify-mobile`   | Yes  | Verify user mobile number with OTP           |
| `POST` | `/api/auth/forgot-password` |  No  | Request a password reset link                |
| `POST` | `/api/auth/reset-password`  |  No  | Reset password using a valid reset token     |

#### Users — `/api/users`

| Method   | Endpoint                      | Auth | Description                 |
| -------- | ----------------------------- | :--: | --------------------------- |
| `GET`    | `/api/users/me`               | Yes  | Get current user profile    |
| `PUT`    | `/api/users/me`               | Yes  | Update current user profile |
| `GET`    | `/api/users/me/addresses`     | Yes  | List all saved addresses    |
| `POST`   | `/api/users/me/addresses`     | Yes  | Add a new address           |
| `PUT`    | `/api/users/me/addresses/:id` | Yes  | Update an address           |
| `DELETE` | `/api/users/me/addresses/:id` | Yes  | Delete an address           |

#### Products — `/api/products`

| Method   | Endpoint            | Auth  | Description                             |
| -------- | ------------------- | :---: | --------------------------------------- |
| `GET`    | `/api/products`     |  No   | List all products (paginated, filtered) |
| `GET`    | `/api/products/:id` |  No   | Get a single product with details       |
| `POST`   | `/api/products`     | Admin | Create a new product                    |
| `PUT`    | `/api/products/:id` | Admin | Update a product                        |
| `DELETE` | `/api/products/:id` | Admin | Delete a product                        |

#### Categories — `/api/categories`

| Method   | Endpoint              | Auth  | Description                  |
| -------- | --------------------- | :---: | ---------------------------- |
| `GET`    | `/api/categories`     |  No   | List all categories          |
| `GET`    | `/api/categories/:id` |  No   | Get a category and its items |
| `POST`   | `/api/categories`     | Admin | Create a new category        |
| `PUT`    | `/api/categories/:id` | Admin | Update a category            |
| `DELETE` | `/api/categories/:id` | Admin | Delete a category            |

#### Cart — `/api/cart`

| Method   | Endpoint              | Auth | Description                  |
| -------- | --------------------- | :--: | ---------------------------- |
| `GET`    | `/api/cart`           | Yes  | Get current user's cart      |
| `POST`   | `/api/cart/items`     | Yes  | Add an item to the cart      |
| `PUT`    | `/api/cart/items/:id` | Yes  | Update item quantity         |
| `DELETE` | `/api/cart/items/:id` | Yes  | Remove an item from the cart |
| `DELETE` | `/api/cart`           | Yes  | Clear the entire cart        |

#### Wishlist — `/api/wishlist`

| Method   | Endpoint                   | Auth | Description                        |
| -------- | -------------------------- | :--: | ---------------------------------- |
| `GET`    | `/api/wishlist`            | Yes  | Get current user's wishlist        |
| `POST`   | `/api/wishlist`            | Yes  | Add a product to the wishlist      |
| `DELETE` | `/api/wishlist/:productId` | Yes  | Remove a product from the wishlist |

#### Orders — `/api/orders`

| Method | Endpoint                 | Auth  | Description                        |
| ------ | ------------------------ | :---: | ---------------------------------- |
| `GET`  | `/api/orders`            |  Yes  | List current user's orders         |
| `GET`  | `/api/orders/:id`        |  Yes  | Get a single order with line items |
| `POST` | `/api/orders`            |  Yes  | Place a new order                  |
| `PUT`  | `/api/orders/:id/cancel` |  Yes  | Cancel an order                    |
| `GET`  | `/api/admin/orders`      | Admin | List all orders (admin)            |
| `PUT`  | `/api/admin/orders/:id`  | Admin | Update order status (admin)        |

### Data Models

| Model            | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `User`           | Core credentials (email, username, mobile, password) |
| `UserProfile`    | Extended profile info (name, avatar, bio)            |
| `UserSession`    | Active refresh token sessions                        |
| `UserAddress`    | Saved delivery addresses per user                    |
| `Product`        | Product listings (name, price, stock, category)      |
| `ProductDetails` | Extended product attributes (specs, images, tags)    |
| `Categories`     | Hierarchical product category tree                   |
| `Cart`           | User shopping cart                                   |
| `CartItems`      | Individual cart line items (product, qty, price)     |
| `Wishlist`       | User wishlist entries                                |
| `OrderDetails`   | Order header (status, total, address, payment)       |
| `OrderItems`     | Order line items (product snapshot, qty, price)      |

### Security

- **Helmet** — sets secure HTTP response headers
- **CORS** — configurable cross-origin resource sharing
- **Rate Limiting** — 100 requests per 15-minute window per IP (via `express-rate-limit`)
- **bcrypt** — passwords hashed with a cost factor of 12
- **JWT** — short-lived access tokens + long-lived refresh tokens stored server-side
- **Non-root Docker user** — container runs as the `node` user
- **Input validation** — all request bodies validated with Zod schemas before processing

### Backend Scripts

| Script   | Command       | Description                      |
| -------- | ------------- | -------------------------------- |
| `dev`    | `pnpm dev`    | Start dev server with hot reload |
| `build`  | `pnpm build`  | Compile TypeScript to `dist/`    |
| `start`  | `pnpm start`  | Run compiled production build    |
| `lint`   | `pnpm lint`   | Run ESLint across `src/`         |
| `format` | `pnpm format` | Auto-format with Prettier        |

---

## Frontend

### Frontend Project Structure

```
src/
├── app/              # Redux store, root reducer, providers, and routing
├── components/       # Shared UI and layout components
├── config/           # App-wide configuration and environment helpers
├── features/         # Feature-based modules (auth, cart, products, orders, …)
├── hooks/            # Custom React hooks
├── lib/              # Third-party library setup (axios instance, query client)
├── pages/            # Top-level route page components
├── styles/           # Global CSS, fonts, and design tokens
├── tests/            # Unit and integration tests
├── types/            # Shared TypeScript types and interfaces
└── utils/            # Pure utility functions
```

### Frontend Scripts

| Script          | Description                           |
| --------------- | ------------------------------------- |
| `pnpm dev`      | Start the development server with HMR |
| `pnpm build`    | Type-check and build for production   |
| `pnpm preview`  | Preview the production build locally  |
| `pnpm lint`     | Run ESLint                            |
| `pnpm lint:fix` | Run ESLint and auto-fix issues        |

---

## Docker

Each service has its own `Dockerfile` and the project root contains a `docker-compose.yml` to orchestrate the full stack.

### Running with Docker Compose

```bash
# Build and start all services (API, web, MongoDB, Redis)
docker compose up --build
```

| Service    | Default Port | Description           |
| ---------- | :----------: | --------------------- |
| `backend`  |    `5001`    | Node.js REST API      |
| `frontend` |     `80`     | React web app (Nginx) |
| `mongo`    |   `27017`    | MongoDB database      |
| `redis`    |    `6379`    | Redis cache           |

### Building Individual Images

```bash
# Backend
docker build -t kartly-backend ./backend

# Frontend
docker build -t kartly-frontend ./frontend
```

Both containers run as non-root `node` / `nginx` users. The backend image includes a health check that probes the running process every 30 seconds.

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
2. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
3. Open a pull request against `main` and fill in the PR template
4. Ensure all lint checks pass before requesting a review

---

## License

This project is licensed under the **ISC License**.
