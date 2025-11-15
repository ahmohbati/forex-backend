# Forex Exchange System — Backend

Lightweight backend for a Forex Exchange Management System built with Node.js, Express and Sequelize (Postgres).

**Features**
- User authentication (Argon2 password hashing, JWT)
- Currency catalog and exchange rates
- Create and query transactions (buy/sell/convert)
- Sample data seeding and database initialization script

---

## Prerequisites

- Node.js 18+ (tested with Node 18+)
- A running PostgreSQL database
- `npm` or `yarn` to install dependencies

## Quick Start

1. Clone the repository and change into the backend folder:

...\forex-exchange-system\backend
```

2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file in the project root with the following values:

```text
DATABASE_URL=postgres://USER:PASS@HOST:PORT/DATABASE
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

4. (Optional) Initialize the database and insert sample data:

```powershell
npm run db:init
```

5. Start the server in development (auto-reload):

```powershell
npm run dev
```

Or run the production start:

```powershell
npm start
```

---

## Available npm Scripts

- `npm run dev` — start server with Node `--watch` for development
- `npm start` — start server
- `npm run db:init` — run database initialization and seed sample data
- `npm run db:reset` — run init script intended for resetting (script flags supported by the init script)

## Environment Variables

- `DATABASE_URL` — Postgres connection string (required)
- `PORT` — Port for Express server (default `3000`)
- `FRONTEND_URL` — Allowed CORS origin (default `http://localhost:5173`)
- `JWT_SECRET` — Secret used to sign JWT tokens
- `NODE_ENV` — `development` or `production` (affects logging)

---

## API Overview

Base URL: `/api`

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT
- `GET /api/health` — Health check endpoint

- `GET /api/currencies` — List available currencies
- `GET /api/currencies/:code` — Get a single currency by code

- `GET /api/transactions` — List transactions (authenticated)
- `POST /api/transactions` — Create a transaction (authenticated)

Notes
- Routes are defined in `src/routes/*`.
- Authentication middleware is in `src/middleware/auth.js`.

---

## Models (brief)

- `User` — stores user credentials and profile fields (table: `users`)
- `Currency` — currency catalog (table: `currencies`, keyed by `code`)
- `ExchangeRate` — exchange rates between currencies
- `Transaction` — records currency conversions and trades (table: `transactions`)

Associations are configured in `src/models/associations.js` and are initialized during the database setup flow.

---

## Database

This project uses Sequelize with PostgreSQL. Connection is configured via `DATABASE_URL`.

Run `npm run db:init` to create tables and insert sample currencies and exchange rates.

If you need to change synchronization behavior, open `src/models/init.js` and adjust `sequelize.sync()` options.

---

## Development Notes

- The server entry point is `src/app.js`.
- Models live in `src/models/` and routes in `src/routes/`.
- Error handling and security middleware (Helmet, rate limiter) are applied globally.

## License

MIT — see `package.json` for details.

---