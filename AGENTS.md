# AGENTS.md – Esoteros Analytics

## 1. Project Overview

**Name:** Esoteros Analytics  
**Type:** Next.js 14 (App Router) SaaS application  
**Mission:**  
Esoteros Analytics is a life-analytics and recovery-support platform. It combines data analytics, AI-driven insights, and dashboards to help people (especially those rebuilding after rehab) understand patterns in their behavior, finances, habits, and mood so they can intentionally redesign their lives.

The app will evolve into:

- A **Life OS** for personal analytics and self-insight  
- A **recovery insights engine** surfacing hidden patterns  
- A **SaaS platform** with dashboards, multi-tenant auth, and APIs  

Agents should prioritize **code clarity, safety, privacy, and extensibility**.

---

## 2. Tech Stack & Key Libraries

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **ORM:** Prisma (PostgreSQL assumed; schema may evolve)
- **Auth:** NextAuth (placeholder initially, real providers later)
- **API:** Route handlers in `/app/api/*`
- **UI:** Reusable React components in `/components`
- **Utilities:** Shared helpers in `/lib`
- **Env config:** `.env.local` (runtime) + `.env.example` (template)

Agents: do **not** introduce alternative stacks (e.g., Redux, tRPC, Nest, etc.) without explicit prompt.

---

## 3. Repository Layout

Expected top-level structure:

```text
/app
  /(site)
    /dashboard
    /auth
    /settings
  /api
    /auth
    /users
    /analytics
/components
/lib
/styles
/types
/prisma
/public
/scripts
.env.example
package.json
AGENTS.md
README.md

### Key Directories

- **app/** — App Router pages, layouts, and core application logic  
- **app/api/** — Route handlers for auth, user mgmt, analytics, etc.  
- **components/** — Reusable UI components  
- **lib/** — Utility functions (db, auth, helpers)  
- **styles/** — Global and shared styles  
- **prisma/** — ORM schema + potential seed scripts  
- **types/** — Global TypeScript types  
- **public/** — Static assets (favicon, logos)  

---

## 🧪 Scripts

Use the following commands during development:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build app
npm run build

# Start production server
npm start

# Lint
npm run lint

# (Optional) Seed database
npm run seed