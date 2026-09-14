# 📈 SB Stocks

<p align="center">
  <strong>A Full-Stack Paper Trading & Portfolio Management Platform</strong>
</p>

<p align="center">
  Practice Trading • Track Portfolios • Analyze Performance
</p>

<p align="center">
  <a href="https://sb-stocks-frontend.onrender.com/">Live Demo</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Naveenbabu45/STOCK-TRADING-APP">GitHub Repository</a>
</p>

---

## 📌 Overview

**SB Stocks** is a full-stack paper-trading platform designed to simulate stock market trading using virtual money.

The application provides a realistic trading workflow where users can:

- Create and manage accounts
- Browse market stocks
- View stock prices and charts
- Buy and sell stocks
- Maintain a virtual cash balance
- Track portfolio holdings
- Monitor profit and loss
- Manage a persistent watchlist
- Review orders and transaction history
- Analyze portfolio allocation and performance

The project demonstrates how a modern full-stack application can connect a **React frontend**, **REST API**, **MongoDB database**, **authentication layer**, **market-data service**, and **production deployment environment** into one complete system.

> ⚠️ **Important:** SB Stocks is a paper-trading simulator. It does not execute real stock market orders and does not handle real money.

---

# 🚀 Live Application

### 🌐 Live Demo

**Frontend:**  
https://sb-stocks-frontend.onrender.com

**Backend API:**  
https://sb-stocks-backend-pv2g.onrender.com

### 💻 Source Code

https://github.com/Naveenbabu45/STOCK-TRADING-APP

---

# 🎯 Project Goals

The primary goals of SB Stocks are:

1. Build a complete full-stack trading workflow.
2. Implement secure user authentication.
3. Design RESTful backend APIs.
4. Persist users, portfolios, orders, and transactions in MongoDB.
5. Integrate market data into the application.
6. Implement server-side trading validation.
7. Maintain portfolio and cash consistency.
8. Provide meaningful portfolio analytics.
9. Implement persistent watchlist functionality.
10. Deploy the frontend and backend as production services.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Password hashing
- Authenticated user sessions
- Role-based administrative access
- Public admin registration disabled

## 📊 Market Dashboard

- Tracked market stocks
- Current stock prices
- Price changes
- Market overview
- Gainers and losers
- Stock search
- Quick stock access
- Market pulse indicators

## 📈 Stock Charts

Supported chart ranges:

- `1D`
- `5D`
- `1M`
- `6M`
- `1Y`

The frontend receives chart and market information through the backend market-data service.

## 💰 Paper Trading

Users receive virtual funds and can simulate trades.

### Buy

- Select a stock
- Enter quantity
- Review trade value
- Place a buy order
- Update portfolio automatically

### Sell

- Select an owned stock
- Enter quantity
- Validate available shares
- Place a sell order
- Update cash balance
- Record realized P&L

## 💼 Portfolio Management

Portfolio information includes:

- Cash balance
- Holdings value
- Total portfolio value
- Net worth
- Individual positions
- Current prices
- Average purchase price
- Unrealized P&L
- Realized P&L
- Portfolio allocation
- Largest position
- Top performer
- Position requiring attention

## ⭐ Persistent Watchlist

Users can:

- Add stocks
- Remove stocks
- View their watchlist
- Keep watchlist data persistent across sessions

### Watchlist Flow

```text
Add Stock
   ↓
Persist Symbol
   ↓
MongoDB
   ↓
Retrieve Watchlist
   ↓
Display on Dashboard
```

## 📋 Order & Transaction History

### Orders

Tracks:

- Buy orders
- Sell orders
- Quantity
- Execution price
- Total value
- Realized P&L
- Order status
- Timestamp

### Transactions

Tracks:

- Deposits
- Withdrawals
- Buys
- Sells
- Transaction values
- Timestamps

### History Filters

- Buy
- Sell
- Deposit
- Withdrawal

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │       User / Browser    │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    React + Vite Client  │
                         │                         │
                         │ • Dashboard             │
                         │ • Portfolio             │
                         │ • Trading               │
                         │ • Watchlist             │
                         │ • History               │
                         │ • Authentication        │
                         └────────────┬────────────┘
                                      │
                                  REST API
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │   Express.js Backend    │
                         │                         │
                         │ • Routes                │
                         │ • Controllers           │
                         │ • Middleware            │
                         │ • Authentication        │
                         │ • Validation             │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
          ┌─────────────────┐ ┌───────────────┐ ┌──────────────────┐
          │ MongoDB         │ │ Market Data   │ │ JWT Auth         │
          │                 │ │ Service       │ │                  │
          │ • Users         │ │ • Prices      │ │ • Tokens         │
          │ • Holdings      │ │ • Charts      │ │ • Protected API  │
          │ • Orders        │ │ • Cache       │ │ • Roles          │
          │ • Transactions  │ │ • Fallback    │ │                  │
          └─────────────────┘ └───────┬───────┘ └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ External Market  │
                            │ Data Provider    │
                            └──────────────────┘
```

---

# 🔄 Application Request Flow

```text
User Action
    │
    ▼
React Component
    │
    ▼
API Request
    │
    ▼
Express Router
    │
    ▼
Authentication Middleware
    │
    ▼
Controller
    │
    ├───────────────┐
    │               │
    ▼               ▼
MongoDB        Market Data Service
    │               │
    └───────┬───────┘
            ▼
       API Response
            │
            ▼
      React UI Update
```

---

# 🔐 Authentication Architecture

```text
                 USER
                  │
                  ▼
          Login / Register
                  │
                  ▼
        Authentication API
                  │
                  ▼
        Validate Credentials
                  │
                  ▼
            JWT Created
                  │
                  ▼
        Frontend Stores Token
                  │
                  ▼
       Protected API Request
                  │
                  ▼
      JWT Authentication Middleware
                  │
          ┌───────┴───────┐
          │               │
       Valid            Invalid
          │               │
          ▼               ▼
     Controller         401 Error
```

### Security Principles

- Passwords are hashed before storage.
- JWT tokens authenticate protected requests.
- Protected routes require authentication.
- JWT secret is supplied through environment variables.
- Weak JWT secrets are rejected.
- Admin registration is not publicly exposed.
- CORS is restricted to the configured frontend origin.

---

# 💸 Buy Order Workflow

```text
User selects stock
        │
        ▼
Enter quantity
        │
        ▼
Send BUY request
        │
        ▼
Authenticate user
        │
        ▼
Validate quantity
        │
        ▼
Resolve server-side trade price
        │
        ▼
Calculate order value
        │
        ▼
Check available cash
        │
        ├───────────────┐
        │               │
     Insufficient     Sufficient
        │               │
        ▼               ▼
      Reject       Create/Update
                       Holding
                         │
                         ▼
                   Deduct Cash
                         │
                         ▼
                   Create Order
                         │
                         ▼
                Create Transaction
                         │
                         ▼
                      Commit
                         │
                         ▼
                  Return Result
```

---

# 💵 Sell Order Workflow

```text
User selects owned stock
          │
          ▼
Enter quantity
          │
          ▼
Send SELL request
          │
          ▼
Authenticate user
          │
          ▼
Validate quantity
          │
          ▼
Check owned shares
          │
          ├────────────────┐
          │                │
      Not enough        Enough shares
          │                │
          ▼                ▼
        Reject       Resolve trade price
                           │
                           ▼
                     Calculate proceeds
                           │
                           ▼
                     Calculate P&L
                           │
                           ▼
                    Update holdings
                           │
                           ▼
                      Add cash
                           │
                           ▼
                     Create order
                           │
                           ▼
                 Create transaction
                           │
                           ▼
                         Commit
                           │
                           ▼
                     Return result
```

---

# 🧮 Trading & Portfolio Logic

## Average Purchase Price

When additional shares are purchased, weighted-average cost is used.

```text
New Average Price =

(Existing Shares × Existing Average Price
 + New Shares × New Purchase Price)
/
(Total Shares After Purchase)
```

### Example

```text
Existing:
10 shares × $100 = $1,000

New purchase:
5 shares × $120 = $600

Total:
15 shares
$1,600 invested

Average Price:
$1,600 / 15
= $106.67
```

## 📊 Unrealized P&L

```text
Unrealized P&L

= (Current Price - Average Purchase Price)
  × Quantity Held
```

## 📈 Realized P&L

```text
Realized P&L

= (Sell Price - Average Purchase Price)
  × Quantity Sold
```

## 💼 Portfolio Value

```text
Holdings Value
=
Σ(Current Price × Quantity)
```

```text
Net Worth
=
Cash Balance + Holdings Value
```

---

# 🗄️ Database Architecture

MongoDB is used as the primary persistent database.

```text
                     MongoDB
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Users         Holdings       Orders
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                   Transactions
```

## 👤 User

```text
User
├── name
├── email
├── passwordHash
├── role
├── cashBalance
└── watchlist
```

## 📦 Holding

```text
Holding
├── user
├── symbol
├── quantity
├── averagePrice
├── currentPrice
└── unrealizedPnl
```

## 🧾 Order

```text
Order
├── user
├── symbol
├── type
├── quantity
├── price
├── totalValue
├── realizedPnl
└── status
```

## 💳 Transaction

```text
Transaction
├── user
├── type
├── symbol
├── amount
├── quantity
├── price
└── createdAt
```

## 🔗 Relationships

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
      Holdings        Orders      Transactions
          │
          ▼
       Stock
      Position
```

A user can have multiple holdings, orders, transactions, and watchlist symbols.

---

# 📡 Market Data Architecture

```text
React Client
     │
     ▼
GET /api/stocks
     │
     ▼
Express Backend
     │
     ▼
Market Data Service
     │
     ├───────────────┐
     │               │
     ▼               ▼
External API      Cached Data
     │               │
     └───────┬───────┘
             ▼
        Stock Response
             │
             ▼
         React UI
```

The market-data service uses caching to reduce unnecessary external requests.

A deterministic fallback dataset is also available when external market data cannot be retrieved.

> SB Stocks is intended for paper-trading simulation and application demonstration, not real-world brokerage execution.

---

# 📊 Dashboard Architecture

```text
                    Dashboard
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Market Stocks     Portfolio       Watchlist
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                  Dashboard State
                        │
                        ▼
                    UI Cards
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   Market Pulse     Net Worth        P&L
```

---

# 📈 Portfolio Analytics

The portfolio dashboard provides both visual and numerical analysis.

### Metrics

- Cash Balance
- Holdings Value
- Net Worth
- Unrealized P&L
- Realized P&L
- Position count
- Largest position
- Top performer
- Position requiring attention

### Allocation Visualization

```text
             Portfolio
                 │
        ┌────────┼────────┐
        │        │        │
       AAPL     META      V
        │        │        │
        ▼        ▼        ▼
      % of     % of     % of
    Portfolio Portfolio Portfolio
```

---

# 🧭 Frontend Application Flow

```text
                    Application
                         │
          ┌──────────────┴──────────────┐
          │                             │
       Public                       Protected
          │                             │
          ▼                             ▼
      Login Page                    Dashboard
      Register Page                     │
                                        ├── Portfolio
                                        ├── Trading
                                        ├── Watchlist
                                        ├── History
                                        └── Profile
```

---

# 📁 Project Structure

```text
STOCK-TRADING-APP/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env.example
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .github/
│   └── ISSUE_TEMPLATE/
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── render.yaml
└── vercel.json
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Frontend build tool |
| Tailwind CSS | Styling |
| JavaScript | Application logic |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |

## Database

| Technology | Purpose |
|---|---|
| MongoDB | Persistent application data |
| Mongoose | Schema & database interaction |

## Market Data

| Component | Purpose |
|---|---|
| Market Data Service | Fetch and normalize stock data |
| Cache | Reduce repeated external requests |
| Fallback Data | Maintain application usability |

## Deployment

| Platform | Component |
|---|---|
| Render | Frontend |
| Render | Backend |
| MongoDB | Database |

---

# 📡 REST API

## Authentication

### Register

```http
POST /api/auth/register
```

Creates a new user account.

### Login

```http
POST /api/auth/login
```

Authenticates a user and returns an authentication token.

## Stocks

### Get Market Stocks

```http
GET /api/stocks
```

Returns available market stocks.

### Get Portfolio Stocks

```http
GET /api/stocks/portfolio/me
```

Returns stock information associated with the authenticated user's portfolio.

## Orders

### Create Buy/Sell Order

```http
POST /api/orders
```

Creates a paper-trading order after server-side validation.

### Get Orders

```http
GET /api/orders
```

Returns authenticated user's order history.

## Portfolio

### Get My Portfolio

```http
GET /api/portfolio/me
```

Returns the authenticated user's portfolio information.

## Transactions

### Get Transactions

```http
GET /api/transactions
```

Returns the user's transaction history and supports transaction filtering.

## Watchlist

### Get Watchlist

```http
GET /api/users/watchlist
```

Returns the authenticated user's watchlist.

### Add Stock

```http
POST /api/users/watchlist
```

Adds a stock symbol to the watchlist.

### Remove Stock

```http
DELETE /api/users/watchlist/:symbol
```

Removes a stock from the watchlist.

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "sb-stocks-api"
}
```

---

# 🛡️ Security

Security was considered across both frontend and backend layers.

### Authentication

- JWT-based authentication
- Protected routes
- Token verification middleware

### Password Security

- Password hashing using bcrypt
- Plain-text passwords are not stored

### API Security

- Server-side validation
- Authenticated trading endpoints
- Role-aware authorization
- Restricted CORS configuration

### Trading Security

The backend does not blindly trust sensitive trading values supplied by the client.

The server resolves the trade price and validates:

- User authentication
- Quantity
- Available cash
- Available shares
- Order type
- Portfolio state

---

# 🔄 Transaction Consistency

Trading operations modify multiple pieces of financial data.

For example, a BUY operation may update:

```text
User Cash
     +
Holding
     +
Order
     +
Transaction
```

To keep these operations consistent, the backend uses a MongoDB transaction.

```text
                 BUY / SELL
                     │
                     ▼
             Start DB Transaction
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        User      Holding      Order
          │          │          │
          └──────────┼──────────┘
                     ▼
                Transaction
                     │
                     ▼
                  Commit
                     │
                     ▼
               Success
```

If an operation fails, the transaction can be rolled back rather than leaving partially updated trading data.

---

# 🧪 Validation

The backend validates important trading conditions.

Examples:

- Invalid quantity
- Missing required fields
- Insufficient cash
- Selling more shares than owned
- Invalid authentication
- Invalid request data
- Unauthorized access

```text
User attempts to sell
        │
        ▼
Does user own enough shares?
        │
    ┌───┴────┐
    │        │
   NO       YES
    │        │
    ▼        ▼
 Reject    Continue
```

---

# 🌐 Deployment Architecture

```text
                    INTERNET
                       │
                       ▼
             ┌─────────────────┐
             │     Render      │
             │    Frontend     │
             └────────┬────────┘
                      │
                   HTTPS API
                      │
                      ▼
             ┌─────────────────┐
             │     Render      │
             │     Backend     │
             └───────┬─────────┘
                     │
             ┌───────┴─────────┐
             │                 │
             ▼                 ▼
       ┌──────────┐      ┌──────────────┐
       │ MongoDB  │      │ Market Data  │
       │ Database │      │ Service      │
       └──────────┘      └──────────────┘
```

---

# ⚙️ Environment Configuration

## Backend

Create `.env` inside `server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

## Frontend

Create `.env` inside `client`:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://sb-stocks-backend-pv2g.onrender.com
```

> Never commit real credentials, database connection strings, JWT secrets, or API keys to GitHub.

---

# 💻 Local Development

## Prerequisites

- Node.js
- npm
- MongoDB
- Git

## 1. Clone Repository

```bash
git clone https://github.com/Naveenbabu45/STOCK-TRADING-APP.git
cd STOCK-TRADING-APP
```

## 2. Install Dependencies

Root:

```bash
npm install
```

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

## 3. Configure Environment Variables

Create the required `.env` files using the provided examples.

## 4. Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 5. Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔍 Example User Journey

```text
                    New User
                       │
                       ▼
                  Register
                       │
                       ▼
                    Login
                       │
                       ▼
                  Dashboard
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
    Explore         Watchlist       Portfolio
       │               │               │
       ▼               ▼               ▼
  Select Stock     Add Stock       View Holdings
       │                               │
       ▼                               ▼
     Trade                         Analyze P&L
       │                               │
   ┌───┴────┐                          │
   ▼        ▼                          │
  BUY      SELL                         │
   │        │                           │
   └────┬───┘                           │
        ▼                               │
      Order                             │
        │                               │
        ▼                               │
   Transaction                          │
        │                               │
        └──────────────┬────────────────┘
                       ▼
                  History
```

---

# 📱 Main Application Modules

## 1. Authentication Module

Responsible for:

- Registration
- Login
- JWT authentication
- Protected access

## 2. Market Module

Responsible for:

- Stock listing
- Market prices
- Price changes
- Search
- Chart data

## 3. Trading Module

Responsible for:

- Buy orders
- Sell orders
- Trade validation
- Trade price resolution
- Cash updates
- Holdings updates

## 4. Portfolio Module

Responsible for:

- Holdings
- Portfolio valuation
- Average purchase price
- Unrealized P&L
- Allocation analysis

## 5. Watchlist Module

Responsible for:

- Adding stocks
- Removing stocks
- Persisting symbols
- Displaying tracked stocks

## 6. History Module

Responsible for:

- Orders
- Transactions
- Filtering
- P&L history
- Activity tracking

---

# 📊 Feature Matrix

| Feature | Status |
|---|:---:|
| User Registration | ✅ |
| User Login | ✅ |
| JWT Authentication | ✅ |
| Market Dashboard | ✅ |
| Stock Search | ✅ |
| Stock Charts | ✅ |
| Paper Buy Orders | ✅ |
| Paper Sell Orders | ✅ |
| Portfolio Tracking | ✅ |
| P&L Calculation | ✅ |
| Watchlist | ✅ |
| Order History | ✅ |
| Transaction History | ✅ |
| History Filters | ✅ |
| Portfolio Allocation | ✅ |
| Admin Functionality | ✅ |
| REST API | ✅ |
| MongoDB Persistence | ✅ |
| Production Deployment | ✅ |
| Health Check API | ✅ |

---

# 🧠 Engineering Highlights

### Server-side Trade Price Resolution

The backend determines the trade price instead of trusting a sensitive price directly supplied by the frontend.

### Weighted-Average Holdings

Multiple purchases of the same stock are combined using weighted-average cost.

### Atomic Trading Operations

Buy/sell operations update related records together using database transactions.

### Persistent Watchlist

Watchlist data is stored in the database instead of being maintained only in frontend state.

### Market-Data Caching

Market data requests use a cache layer to reduce repeated external requests.

### Protected API Routes

Sensitive operations require authenticated users.

### SPA Routing Support

Production routing is configured so direct navigation to frontend routes works correctly.

---

# 🧩 Challenges Solved

## API & CORS Configuration

The frontend and backend are deployed separately, requiring correct production API and CORS configuration.

## Environment Configuration

Production secrets and URLs are managed through environment variables instead of hardcoded values.

## Trading Consistency

Buying and selling affect multiple database records:

- Cash
- Holdings
- Orders
- Transactions

These updates must remain consistent.

## Frontend Request Lifecycle

React effects and callbacks were structured carefully to avoid unnecessary repeated API requests.

## Production SPA Routing

Client-side routes such as:

```text
/dashboard
/portfolio
/history
```

are configured to work correctly when accessed directly.

---

# 🚦 Error Handling

The application handles common HTTP errors:

```text
400 → Invalid request / trading validation
401 → Authentication required
403 → Unauthorized access
404 → Resource not found
500 → Server error
```

The frontend displays user-friendly feedback instead of exposing internal server details.

---

# 🧪 Testing Checklist

### Authentication

- [x] Register
- [x] Login
- [x] Protected routes
- [x] Invalid credentials

### Trading

- [x] Buy stock
- [x] Sell stock
- [x] Insufficient cash validation
- [x] Insufficient shares validation
- [x] Portfolio update

### Portfolio

- [x] Holdings
- [x] Current prices
- [x] Portfolio value
- [x] P&L
- [x] Allocation

### Watchlist

- [x] Add stock
- [x] Remove stock
- [x] Persistent watchlist

### History

- [x] Orders
- [x] Transactions
- [x] Filters

### Deployment

- [x] Frontend deployment
- [x] Backend deployment
- [x] MongoDB connection
- [x] Production API
- [x] SPA routing
- [x] Health endpoint

---

# 📈 Future Improvements

Possible future improvements include:

- Real-time WebSocket market updates
- Advanced technical indicators
- Candlestick charts
- Advanced order types
- Stop-loss orders
- Limit orders
- Trade notifications
- Portfolio performance graphs
- Benchmark comparison
- More detailed analytics
- Improved market-data provider
- Mobile-first optimization
- Automated testing
- CI/CD pipeline
- Rate limiting
- Audit logging
- Admin analytics
- Leaderboards
- Paper-trading competitions

---

# 🗺️ Roadmap

```text
Phase 1
Authentication
     ↓
Phase 2
Market Dashboard
     ↓
Phase 3
Trading Engine
     ↓
Phase 4
Portfolio Management
     ↓
Phase 5
Watchlist & History
     ↓
Phase 6
Analytics
     ↓
Phase 7
Production Deployment
     ↓
Future
Advanced Trading Features
```

---

# 📸 Application Screenshots

Store screenshots under:

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── portfolio.png
    ├── trading.png
    └── history.png
```

Then add them to the README:

### Dashboard

![Dashboard](./docs/screenshots/dashboard.png)

### Portfolio

![Portfolio](./docs/screenshots/portfolio.png)

### Trading

![Trading](./docs/screenshots/trading.png)

### History

![History](./docs/screenshots/history.png)

---

# 🔗 Important Links

| Resource | Link |
|---|---|
| 🌐 Live Application | https://sb-stocks-frontend.onrender.com |
| ⚙️ Backend API | https://sb-stocks-backend-pv2g.onrender.com |
| ❤️ API Health | https://sb-stocks-backend-pv2g.onrender.com/api/health |
| 💻 GitHub Repository | https://github.com/Naveenbabu45/STOCK-TRADING-APP |

---

# 👨‍💻 Developer

**Naveen Babu**

Full-Stack Developer | CSE Student

### Areas of Interest

- Full-Stack Development
- Backend Engineering
- REST APIs
- Database Systems
- Software Development
- Problem Solving

---

# 📜 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <strong>SB Stocks</strong>
  <br>
  Practice Trading. Track Performance. Learn by Building.
</p>
