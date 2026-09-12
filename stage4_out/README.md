# SB Stocks — Full-Stack Paper Trading Platform

SB Stocks is a full-stack paper-trading platform that simulates stock investing with virtual capital. It combines a React dashboard with an Express/MongoDB API, market-data integration, portfolio accounting, watchlists, order history, and role-protected administration.

> **Important:** SB Stocks is an educational simulation. It does not place real trades and does not provide financial advice.

## Why this project

The project is designed around the core workflows of a retail trading application:

- authenticated user accounts
- market discovery and stock detail views
- trusted server-side trade pricing
- buy/sell execution with virtual cash
- weighted-average cost basis
- realized and unrealized P&L
- portfolio and transaction history
- personal watchlists
- protected admin operations
- responsive trading-oriented UI

## Core features

### Trading
- Buy and sell stocks using virtual cash
- Server-side quote resolution instead of trusting client-submitted prices
- Balance validation before purchases
- Holding validation before sales
- Weighted-average cost tracking
- Realized P&L on sales
- Atomic MongoDB transactions for balance, holdings, orders, and transactions

### Portfolio
- Total cash and portfolio value
- Net worth
- Unrealized P&L and return percentage
- Position-level average cost, market value, and P&L
- Allocation and position insights

### Market experience
- Stock search and market overview
- Stock detail pages
- Historical price charts with multiple ranges
- Market movers
- Watchlist with persistent user storage
- Quote caching to reduce repeated provider requests

### Account & administration
- JWT authentication
- Password hashing with bcrypt
- User profile management
- Protected routes
- User/admin role separation
- Admin views for users, orders, and transactions

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Chart.js, Lucide React |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Authentication | JWT + bcryptjs |
| Market data | Yahoo Finance chart endpoint via server-side market-data service |
| Deployment-ready | Render-compatible API + Vercel-compatible SPA configuration |

## Architecture

```text
┌───────────────────────────────┐
│          React / Vite         │
│ Dashboard • Portfolio • Stock │
│ History • Watchlist • Admin   │
└───────────────┬───────────────┘
                │ HTTPS / REST
                ▼
┌───────────────────────────────┐
│       Express API Server      │
│ Auth • Orders • Portfolio     │
│ Stocks • Transactions • Users │
└───────┬───────────┬───────────┘
        │           │
        ▼           ▼
   ┌─────────┐  ┌──────────────┐
   │ MongoDB │  │ Market Data  │
   │ Users   │  │ Provider     │
   │ Orders  │  │ Quotes/Chart │
   │ Holdings│  └──────────────┘
   └─────────┘
```

## Project structure

```text
.
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
├── .env.example
├── render.yaml
├── vercel.json
└── README.md
```

## Local setup

### Requirements

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas

### 1. Clone

```bash
git clone https://github.com/Naveenbabu45/STOCK-TRADING-APP.git
cd STOCK-TRADING-APP
```

### 2. Configure the API

Copy `.env.example` to `.env` and set your MongoDB URI and a strong JWT secret.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sb-stocks
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
CLIENT_URL=http://localhost:5173
```

Never commit `.env` or production secrets.

### 3. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 4. Run the API

```bash
cd server
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 5. Run the frontend

In another terminal:

```bash
cd client
npm run dev
```

Set `VITE_API_URL` when the API is not running on localhost:

```env
VITE_API_URL=http://localhost:5000
```

## API overview

| Area | Example endpoints |
| --- | --- |
| Auth | `POST /api/users/register`, `POST /api/users/login` |
| Profile | `GET /api/users/profile`, `PUT /api/users/profile` |
| Watchlist | `GET /api/users/watchlist`, `POST /api/users/watchlist`, `DELETE /api/users/watchlist/:symbol` |
| Stocks | `GET /api/stocks`, `GET /api/stocks/:symbol`, `GET /api/stocks/:symbol/history` |
| Trading | `POST /api/orders`, `GET /api/orders` |
| Portfolio | `GET /api/stocks/portfolio/me` |
| Transactions | `GET /api/transactions` |
| Health | `GET /api/health` |

Authenticated endpoints require:

```text
Authorization: Bearer <JWT>
```

## Trading model

SB Stocks uses a simplified paper-trading model:

1. The client submits the symbol, side, and quantity.
2. The API resolves the current market quote.
3. The API validates the user's cash or holding quantity.
4. A MongoDB session updates the relevant account state atomically.
5. The completed order and transaction are recorded.
6. Portfolio calculations use the resulting holding and current quote.

This prevents the browser from deciding the execution price or manufacturing transaction records.

## Deployment

### Backend

The repository includes `render.yaml` as a starting point for deploying the Express API to Render.

Required environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

### Frontend

The repository includes `vercel.json` for SPA routing. Configure:

```env
VITE_API_URL=https://your-api-domain.example.com
```

The value should point to the deployed API **without** the `/api` suffix because the frontend client appends it automatically.

## Security notes

- Public registration always creates a normal user account.
- Admin access is not controlled by a client-provided registration field.
- Passwords are hashed with bcrypt.
- JWT secrets are validated at startup.
- CORS is restricted to the configured frontend origin.
- Trading endpoints validate symbols, quantities, and ownership server-side.
- Environment files are ignored by Git.

This is still a learning project. A production brokerage would require substantially stronger controls such as secure session management, audit infrastructure, market-data licensing, regulatory controls, order execution infrastructure, and extensive automated testing.

## Development commands

### Client

```bash
cd client
npm run dev
npm run build
npm run lint
npm run typecheck
```

### Server

```bash
cd server
npm run dev
npm start
```

## GitHub presentation

For the repository to be portfolio-ready, keep the public repository focused on source code and documentation:

- Do not commit `.env`, database credentials, API keys, or generated build folders.
- Keep the repository description concise: `Full-stack paper trading platform with React, Express, MongoDB and market-data integration.`
- Pin this repository only after the production demo is working.
- Add 3–5 real screenshots or a short demo GIF once a production build is available.

## Roadmap

- [x] Authentication and protected routes
- [x] Paper trading workflow
- [x] Portfolio accounting
- [x] Market-data service
- [x] Watchlist
- [x] Admin views
- [x] Responsive dashboard polish
- [x] Deployment configuration
- [ ] Automated backend tests
- [ ] End-to-end browser tests
- [ ] Production monitoring and logging
- [ ] More advanced portfolio analytics

## Author

**Naveen Babu**

GitHub: `Naveenbabu45`
