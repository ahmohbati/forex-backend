# Forex Exchange System — Backend

[![Node.js CI - Tests](https://github.com/ahmohbati/forex-backend/actions/workflows/nodejs-tests.yml/badge.svg?branch=main)](https://github.com/ahmohbati/forex-backend/actions/workflows/nodejs-tests.yml)

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
---

## Deploying to Render

This project can be deployed to Render as a Node web service with an attached Postgres database. Below are recommended steps and tips to get the app running on Render.

Quick steps

1. Push your repository to GitHub (or GitLab) and connect it to Render.
2. Create a new **Web Service** on Render:
	- Environment: `Node`
	- Branch: `main` (or whichever branch you want to deploy)
	- Build command: `npm install`
	- Start command: `npm start`
3. Create a managed Postgres instance on Render or provide an external `DATABASE_URL`.
	- If you use Render's managed DB, attach it to the Web Service under Environment → Databases; Render will populate `DATABASE_URL` automatically.
4. Add the following environment variables in your Web Service settings:
	- `JWT_SECRET` — strong secret for JWT signing
	- `DATABASE_URL` — database connection string (if not using Render-managed DB)
	- `NODE_ENV=production`

Database initialization

- The repository includes `npm run db:init` which runs `src/models/init.js` to create tables and seed sample data.
- Recommended approach:
  - After the first deploy, open a one-off shell from the Render dashboard and run `npm run db:init` to create tables and seed the DB.
  - Alternatively, run `npm run db:init` locally against the Render DB (set `DATABASE_URL` locally) before deploying.

Files included to help deployment

- `Procfile` — contains `web: npm start` so Procfile-aware hosts will start the app.
- `render.yaml` — template file that can be used to describe the web service in code. Edit placeholders before applying.

Notes and troubleshooting

- Ensure `DATABASE_URL` is set correctly and reachable from the Render service.
- If you prefer the app to initialize tables automatically on first-run, consider gating that behavior behind an environment variable (e.g. `DB_INIT_ON_START=true`) rather than having `initDatabase()` call `process.exit()`.
- If you encounter build failures on Render, inspect the build logs and check Node version compatibility. The `package.json` indicates Node `>=18 <23`.

If you want, I can also:
- Add a small `render.postdeploy` npm script and instructions for running it as a one-off deploy step.
- Provide a cross-platform Node smoke script so Render can run health checks as part of CI.
