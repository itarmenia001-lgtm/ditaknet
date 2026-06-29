# DitakNet Public Website

This is the separate public website and customer portal for **DitakNet**, a local network visibility, discovery, monitoring, alerting, licensing, and IT support platform.

DitakNet helps businesses see, monitor, and manage their local networks from one simple dashboard.

## What It Includes

- Public SaaS-style website pages for product, features, pricing, docs, FAQ, news, about, contact, and support.
- Online registration and login with secure password hashing.
- Customer account area with next actions, license requests, and support tickets.
- License request collection flow for Medium and Professional activation.
- Support ticket and discussion flows.
- Admin pages for users, license requests, contact messages, tickets, discussions, and settings.
- `hy`, `en`, and `ru` translation files.
- Prisma schema for local SQLite development with a PostgreSQL-ready data model.

## Install

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:init:sqlite
npm run db:seed
npm run dev
```

Open the app at `http://localhost:3000`.

## Environment

Set at least:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_NAME="DitakNet Admin"
APP_NAME="DitakNet"
```

SMTP variables are optional. If SMTP is missing, the app saves messages in the database and logs a safe notification message.

## Database

Local development uses SQLite through Prisma:

```bash
npm run db:init:sqlite
npm run db:seed
```

`npm run prisma:migrate` is also provided for Prisma-managed migrations. On this Windows/Node 24 environment the Prisma schema engine returned a short engine error, so `db:init:sqlite` is included as a practical local fallback using the checked-in SQL migration.

## Scope

This project is only the public website and customer portal. It does not implement the monitoring engine, device scanner, or internal dashboard.

Brand strategy and naming guidance are documented in `docs/DITAKNET_BRAND_STRATEGY.md`.
