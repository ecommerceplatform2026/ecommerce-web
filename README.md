# ecommerce-web

A modern, production-ready fashion e-commerce frontend built with Next.js 16 (App Router), React 19, and TypeScript. Designed for performance, scalability, and a clean developer experience.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Developer Notes](#developer-notes)

---

## Overview

`ecommerce-web` is the frontend application for a full-stack fashion e-commerce platform. It consumes a .NET 8 REST API backend and provides a complete shopping experience — from product browsing and cart management to checkout, order tracking, and an admin dashboard.

**Backend repository:** `ecommerce-api` (.NET 8 · Clean Architecture · PostgreSQL · JWT)

---

## Features

### Storefront
- Product catalog with filtering, sorting, search, and pagination
- Product detail page with image gallery and variant selection (size × color)
- Guest cart (localStorage) and authenticated cart (server-synced)
- Merge guest cart into user cart after login
- Checkout flow with shipping form and payment method selection
- COD and online payment support (PayOS / MoMo / ZaloPay)
- Order history and order detail pages

### User Account
- Register, login, logout with JWT authentication
- View and update profile information
- Avatar upload
- Order history with status tracking

### Admin Panel
- Dashboard with KPIs: revenue, orders, top products, low-stock variants
- Revenue and order charts with date range filtering
- Product and category CRUD with Cloudinary image upload
- Order management with status updates
- User management and review moderation

### Developer Experience
- Full TypeScript coverage
- Type-safe environment variables (Zod)
- Centralized API error handling
- Automatic JWT refresh with race condition protection
- Path aliases for clean imports

---

## Tech Stack

| Category          | Library / Tool                        |
|-------------------|---------------------------------------|
| Framework         | Next.js 16 (App Router)               |
| Language          | TypeScript                            |
| Styling           | Tailwind CSS 4                        |
| Server State      | TanStack React Query v5               |
| Client State      | Redux Toolkit                         |
| Forms             | React Hook Form + Zod                 |
| HTTP Client       | Axios                                 |
| Auth              | JWT (`jwt-decode`, `js-cookie`)       |
| Charts            | Recharts                              |
| Notifications     | react-hot-toast                       |
| Icons             | lucide-react                          |
| Date Utilities    | Day.js                                |
| Utilities         | clsx, lodash.debounce                 |
| Package Manager   | npm                                   |

---

## Project Structure

```
ecommerce-web/
├── public/                         # Static assets: logo, favicon, images
├── src/
│   ├── app/                        # Next.js App Router — pages & layouts
│   │   ├── (auth)/                 # Route group: login, register
│   │   ├── (shop)/                 # Route group: products, cart, checkout, orders
│   │   ├── admin/                  # Route group: dashboard, products, categories, orders
│   │   ├── layout.tsx              # Root layout: providers, font, metadata
│   │   └── page.tsx                # Homepage
│   │
│   ├── components/                 # UI components
│   │   ├── ui/                     # Atomic: Button, Input, Modal, Badge, Skeleton
│   │   ├── layout/                 # Header, Footer, Sidebar
│   │   ├── product/                # ProductCard, ProductGrid, ProductFilter, Gallery
│   │   ├── cart/                   # CartItem, CartSummary
│   │   └── checkout/               # CheckoutForm, OrderSummary
│   │
│   ├── constants/                  # App-wide constants
│   │   ├── api.ts                  # All API endpoint URLs
│   │   ├── routes.ts               # All page routes + middleware helpers
│   │   ├── config.ts               # Page size, currency, app config
│   │   └── enums.ts                # Enums + label/color maps
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useFilter.ts
│   │   ├── useWishlist.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/                        # Third-party wrappers & setup
│   │   ├── axios.ts                # Axios instance + JWT interceptor
│   │   └── env.ts                  # Type-safe environment variables (Zod)
│   │
│   ├── redux/                      # Redux Toolkit state management
│   │   ├── store.ts
│   │   ├── hooks.ts                # useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── authSlice.ts        # User, token, auth state
│   │       ├── cartSlice.ts        # Cart items, totals
│   │       ├── productSlice.ts     # Product list, filters, pagination
│   │       └── wishlistSlice.ts    # Wishlist items
│   │
│   ├── services/                   # API call functions
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── cartService.ts
│   │   └── uploadService.ts
│   │
│   ├── styles/                     # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── types/                      # TypeScript interfaces & types
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── cart.ts
│   │   └── api.ts                  # ApiResponse<T>, PaginatedResponse<T>
│   │
│   ├── utils/                      # Pure helper functions
│   │   ├── formatPrice.ts
│   │   ├── formatDate.ts
│   │   ├── validators.ts
│   │   └── imageHelpers.ts
│   │
│   └── middleware.ts               # Route protection: auth + admin guard
│
├── .env.local                      # Local environment variables (not committed)
├── .env.example                    # Environment variable template
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Backend API running at `http://localhost:5000` (see `ecommerce-api`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ecommerce-web.git
cd ecommerce-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then fill in your values in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# .env.example

# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# App name (displayed in UI)
NEXT_PUBLIC_APP_NAME=Fashion Store

# Cloudinary (image upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Payment gateways (add only the ones you use)
NEXT_PUBLIC_PAYOS_CLIENT_ID=your_payos_client_id
NEXT_PUBLIC_MOMO_PARTNER_CODE=your_momo_partner_code
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in `NEXT_PUBLIC_` variables. Planned: environment variables will be validated with Zod. — the app will throw a descriptive error if any required variable is missing or malformed.

---

## Authentication Flow

This app uses **JWT-based authentication** managed via `js-cookie`.

```
1. User submits login form
       ↓
2. POST /api/auth/login → { accessToken, refreshToken, user }
       ↓
3. Tokens saved to cookies (access: 1 day, refresh: 7 days)
   User saved to Redux authSlice
       ↓
4. Every Axios request automatically attaches:
   Authorization: Bearer <accessToken>
       ↓
5. On 401 response:
   → Axios interceptor calls POST /api/auth/refresh-token
   → On success: retry original request with new token
   → On failure: clear cookies, redirect to /login
       ↓
6. On logout:
   → DELETE /api/auth/logout
   → Clear cookies + Redux state
   → Redirect to /login
```

**Route protection** is handled in `src/middleware.ts`:

| Route Pattern | Rule |
|---|---|
| `/login`, `/register` | Redirect to `/` if already authenticated |
| `/cart`, `/checkout`, `/orders`, `/profile` | Redirect to `/login` if not authenticated |
| `/admin/*` | Redirect to `/` if not `UserRole.Admin` |

---

## API Integration

All API calls go through the Axios instance in `src/lib/axios.ts`.

**Base URL:** `http://localhost:5000` (configured via `NEXT_PUBLIC_API_URL`)

**Standard response format from backend:**

```ts
// Success
{
  success: true,
  message: "OK",
  statusCode: 200,
  data: T
}

// Paginated list
{
  success: true,
  message: "OK",
  statusCode: 200,
  data: {
    items: T[],
    pagination: {
      currentPage, pageSize, totalItems, totalPages,
      hasNextPage, hasPreviousPage
    }
  }
}

// Error
{
  success: false,
  message: "Error message",
  statusCode: 400,
  errors: [{ field: "email", message: "Already exists" }]
}
```

**Adding a new service:**

```ts
// src/services/exampleService.ts
import axiosInstance from '@/lib/axios'
import { EXAMPLE_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { Example } from '@/types/example'

export const getExample = async (id: string): Promise<Example> => {
  const res = await axiosInstance.get<ApiResponse<Example>>(
    EXAMPLE_ENDPOINTS.GET_BY_ID(id)
  )
  return res.data.data
}
```

**Using with React Query:**

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['example', id],
  queryFn: () => getExample(id),
})
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check (no emit) |

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set all environment variables in the Vercel dashboard (same keys as `.env.example`)
4. Deploy — Vercel auto-detects Next.js and configures the build

**Production environment variables to configure in Vercel:**

```
NEXT_PUBLIC_API_URL         → Your production API URL
NEXT_PUBLIC_APP_NAME        → Fashion Store
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

> Vercel automatically handles caching, CDN, image optimization, and preview deployments per pull request.

---

## Developer Notes

### State Management Strategy

- **React Query** handles all server state (product lists, orders, categories). It provides caching, background refetch, loading and error states out of the box.
- **Redux Toolkit** is used only for client state that needs to persist across pages and is not directly from the server: `auth` (user + token) and `cart` (guest + synced).
- Do not store API data in Redux — use React Query for that.

### Import Aliases

Path aliases are configured in `tsconfig.json`:

```ts
import { ROUTES } from '@/constants/routes'
import axiosInstance from '@/lib/axios'
import { ProductCard } from '@/components/product/ProductCard'
```

### Error Handling

Errors from the Axios interceptor are normalized to `ApiError`. In React Query, catch them in `onError` or check `error` from `useQuery`. In Redux Thunks, use `rejectWithValue`.

### Working with Enums

All enums have corresponding label and color maps in `constants/enums.ts`. Use them directly in components instead of hardcoding strings:

```ts
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, OrderStatus } from '@/constants/enums'

<span className={ORDER_STATUS_COLOR[order.status]}>
  {ORDER_STATUS_LABEL[order.status]}
</span>
```

### Mock Data During Development

While waiting for backend endpoints, use [json-server](https://github.com/typicode/json-server) or hardcode mock responses directly in service files. Swap to the real endpoint when ready — no other code changes required.

```ts
// Temporary mock — swap with real call when BE is ready
export const getProducts = async () => {
  return MOCK_PRODUCTS  // ← remove this line when BE is ready
  const res = await axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL)
  return res.data.data
}
```

---

## License

This project is for educational and portfolio purposes.