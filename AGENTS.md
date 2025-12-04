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