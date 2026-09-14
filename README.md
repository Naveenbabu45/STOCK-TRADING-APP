# 📈 SB Stocks — Full-Stack Paper Trading Platform

<p align="center">
  <strong>Practice Trading • Track Portfolios • Analyze Performance</strong>
</p>

<p align="center">
  React • Node.js • Express • MongoDB • JWT • Market Data
</p>

---

## 🔗 Quick Links

- 🚀 **[Live Demo — SB Stocks](https://sb-stocks-frontend.onrender.com/)**
- 💻 **[GitHub Repository](https://github.com/Naveenbabu45/STOCK-TRADING-APP)**

---

## ⚠️ Important Disclaimer

> **SB Stocks is an educational paper-trading simulation.**
>
> It uses virtual capital and does not place real trades, execute real financial transactions, or provide financial advice.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why This Project](#-why-this-project)
- [Core Features](#-core-features)
- [User Workflow](#-user-workflow)
- [Trading Workflow](#-trading-workflow)
- [Portfolio Flow](#-portfolio-flow)
- [Admin Workflow](#-admin-workflow)
- [System Architecture](#-system-architecture)
- [Security Architecture](#-security-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Trading Model](#-trading-model)
- [API Overview](#-api-overview)
- [Local Setup](#-local-setup)
- [Deployment](#-deployment)
- [Security Notes](#-security-notes)
- [Development Commands](#-development-commands)
- [Live Demo](#-live-demo)
- [Roadmap](#-roadmap)
- [Project Highlights](#-project-highlights)
- [Author](#-author)

---

# 🚀 Overview

**SB Stocks** is a full-stack paper-trading platform that simulates stock investing using virtual capital.

The application combines a React-based trading dashboard with an Express/MongoDB backend to provide a realistic trading workflow without financial risk.

Users can:

- Discover stocks
- View stock details
- Analyze historical price charts
- Maintain personal watchlists
- Buy and sell stocks using virtual cash
- Track holdings and portfolio value
- Monitor realized and unrealized P&L
- Review orders and transaction history

The platform also includes protected administration features for managing users, orders, and transactions.

---

# 🎯 Why This Project

The project is designed around the core workflows of a retail trading application:

- Authenticated user accounts
- Market discovery and stock detail views
- Trusted server-side trade pricing
- Buy/sell execution with virtual cash
- Weighted-average cost basis
- Realized and unrealized P&L
- Portfolio and transaction history
- Personal watchlists
- Protected admin operations
- Responsive trading-oriented UI

The primary goal is to build a realistic full-stack trading experience while keeping all transactions virtual and risk-free.

---

# ✨ Core Features

## 📈 Trading

- Buy and sell stocks using virtual cash
- Server-side quote resolution instead of trusting client-submitted prices
- Balance validation before purchases
- Holding validation before sales
- Weighted-average cost tracking
- Realized P&L on sales
- Atomic MongoDB transactions for balance, holdings, orders, and transactions

## 💼 Portfolio

- Total cash and portfolio value
- Net worth
- Unrealized P&L and return percentage
- Position-level average cost
- Market value
- Position-level P&L
- Allocation and position insights

## 🌎 Market Experience

- Stock search and market overview
- Stock detail pages
- Historical price charts
- Multiple chart ranges
- Market movers
- Persistent personal watchlist
- Quote caching to reduce repeated provider requests

## 🔐 Account & Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- User profile management
- Role-based access control

## 👨‍💼 Administration

- Protected admin access
- User management views
- Order management views
- Transaction management views
- Separation between normal users and administrators

---

# 👤 User Workflow

```mermaid
flowchart TD
    A["👤 User"]
    B["🔐 Register / Login"]
    C["📊 Trading Dashboard"]
    D["🔎 Explore Stocks"]
    E["📈 View Stock Details"]
    F["⭐ Manage Watchlist"]
    G["💰 Buy / Sell"]
    H["💼 Portfolio"]
    I["📋 Orders & Transactions"]
    J["📊 Analyze P&L"]

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    E --> G
    G --> H
    H --> I
    H --> J
