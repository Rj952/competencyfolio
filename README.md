# CompetencyFolio v3

**Evidence-Based Professional Portfolio Built on the WEF 2030 Skills Framework**

Created by **Dr. Rohan Jowallah** — Educator, AI Consultant, and Author of *AI, Pedagogy and Inclusion* (2025)

---

## Overview

CompetencyFolio v3 is a full-stack web application that enables professionals to build evidence-based portfolios aligned with the World Economic Forum's 10 Core Skills for 2030. It features proprietary reflection frameworks (CARE, ACRE, CRAFT), digital badge earning, AI readiness tracking, and shareable public portfolio pages.

### Key Features

- **WEF 2030 Skills Map** — 10 core skill clusters from the Future of Jobs Report 2025
- **AI Readiness Index** — 8-competency taxonomy for AI-age preparedness
- **Digital Badges** — 5-level badge system (Explorer → Master) earned through evidence
- **CARE Reflections** — Consider, Analyze, Reflect, Evaluate guided framework
- **ACRE Evidence Quality** — Accuracy, Completeness, Relevance, Equity evaluation
- **Evidence Strength Scoring** — Auto-calculated 5-point quality assessment
- **Peer Endorsements** — Third-party validation collection
- **5-Year Growth Plan** — Professional trajectory mapping with status tracking
- **Skills Gap Analysis** — Radar charts and bar graphs for development priority
- **Shareable Portfolio** — Public share links with view count tracking
- **Auto-save** — Debounced save to cloud database with status indicator
- **JSON Export/Import** — Full data portability and backup
- **Dark/Light Mode** — Dual-theme support with warm design palette

### Tech Stack

- **Frontend**: Next.js 14, React 18, Recharts, Tailwind CSS
- **Backend**: Next.js API Routes, JWT Authentication (jose)
- **Database**: PostgreSQL via Prisma ORM (Vercel Postgres)
- **Fonts**: Fraunces (display), DM Sans (body), IBM Plex Mono (code)

---

## Deployment Guide — GitHub + Vercel

### Step 1: Push to GitHub

```bash
# Navigate to the project folder
cd competencyfolio

# Initialize git
git init
git add .
git commit -m "CompetencyFolio v3 — initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/competencyfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your `competencyfolio` repository
4. Vercel auto-detects Next.js — leave the default settings
5. Click **Deploy** (it will fail initially — that's expected, we need the database first)

### Step 3: Create Vercel Postgres Database

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → Select **Postgres** (Neon)
3. Name it `competencyfolio-db`
4. Click **Create**
5. Vercel automatically adds `DATABASE_URL` and `DIRECT_URL` environment variables to your project

### Step 4: Add Environment Variables

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | *(auto-added by Vercel Postgres)* |
| `DIRECT_URL` | *(auto-added by Vercel Postgres)* |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |

### Step 5: Initialize the Database

Option A — From your local machine:
```bash
# Copy DATABASE_URL from Vercel dashboard
cp .env.example .env.local
# Paste your DATABASE_URL and DIRECT_URL into .env.local

npm install
npx prisma db push
```

Option B — Using Vercel CLI:
```bash
npm i -g vercel
vercel link
vercel env pull .env.local
npx prisma db push
```

### Step 6: Redeploy

After the database is initialized:
1. Go to your Vercel project → **Deployments** tab
2. Click the **⋮** menu on the latest deployment → **Redeploy**
3. Your app should now be live!

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and JWT secret

# Push schema to database
npx prisma db push

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Using SQLite for Local Dev (optional)

If you prefer SQLite for local development, edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Remove the `directUrl` line, then run `npx prisma db push`.

---

## Project Structure

```
competencyfolio/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js      # POST /api/auth/login
│   │   │   ├── register/route.js   # POST /api/auth/register
│   │   │   ├── logout/route.js     # POST /api/auth/logout
│   │   │   └── me/route.js         # GET /api/auth/me
│   │   └── portfolio/
│   │       ├── route.js            # GET & PUT /api/portfolio
│   │       └── share/route.js      # POST, GET, DELETE /api/portfolio/share
│   ├── dashboard/page.jsx          # Protected portfolio editor
│   ├── login/page.jsx              # Sign in page
│   ├── register/page.jsx           # Registration page
│   ├── share/[slug]/page.jsx       # Public portfolio view
│   ├── layout.jsx                  # Root layout with metadata
│   └── page.jsx                    # Landing page
├── components/
│   └── portfolio/
│       ├── PortfolioApp.jsx        # Main portfolio editor (11 sections)
│       └── PortfolioPreview.jsx    # Public read-only preview
├── lib/
│   ├── auth.js                     # JWT token management
│   ├── constants.js                # WEF skills, AI taxonomy, frameworks
│   ├── db.js                       # Prisma client singleton
│   └── utils.js                    # Scoring, calculations, helpers
├── prisma/
│   └── schema.prisma               # Database schema (User, Portfolio, ShareLink)
├── styles/
│   └── globals.css                 # Tailwind + custom styles
├── middleware.js                    # Route protection
├── package.json
├── next.config.js
├── tailwind.config.js
├── jsconfig.json
├── vercel.json
└── .env.example
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account + portfolio |
| POST | `/api/auth/login` | No | Sign in, receive JWT cookie |
| POST | `/api/auth/logout` | Yes | Clear session cookie |
| GET | `/api/auth/me` | Yes | Get current user info |
| GET | `/api/portfolio` | Yes | Load portfolio data |
| PUT | `/api/portfolio` | Yes | Save portfolio data |
| POST | `/api/portfolio/share` | Yes | Create public share link |
| GET | `/api/portfolio/share` | Yes | Get active share link |
| DELETE | `/api/portfolio/share` | Yes | Deactivate share link |

## Database Schema

- **User** — id, email (unique), name, passwordHash, timestamps
- **Portfolio** — id, userId (unique FK), data (JSON), version, timestamps
- **ShareLink** — id, userId (FK), slug (unique), isActive, viewCount, expiresAt

## Frameworks

| Framework | Purpose | Developed By |
|-----------|---------|--------------|
| **CARE** | Professional reflection: Consider → Analyze → Reflect → Evaluate | Dr. Rohan Jowallah |
| **ACRE** | Evidence quality: Accuracy, Completeness, Relevance, Equity | Dr. Rohan Jowallah |
| **CRAFT** | AI prompt design: Context, Role, Action, Format, Threshold | Dr. Rohan Jowallah |
| **WEF 2030** | 10 Core Skills for the future workforce | World Economic Forum |

---

## License

© 2025 Dr. Rohan Jowallah. All rights reserved.

This application incorporates proprietary educational frameworks (CARE, ACRE, CRAFT) developed by Dr. Rohan Jowallah as described in *AI, Pedagogy and Inclusion: Shaping Pedagogy in a Changing World* (2025).
