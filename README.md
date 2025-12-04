Esoteros Analytics

A Next.js 14 Platform for AI-Driven Life Insights, Recovery Support, and Personal Transformation

Esoteros Analytics is a modern SaaS platform built to help individuals—especially those rebuilding after rehab or major life transitions—gain clarity, structure, and momentum. By revealing hidden patterns across behavior, habits, finances, and daily rhythms, Esoteros empowers users to take control of their future through AI-driven insights and intuitive dashboards.


---

The Vision

Esoteros Analytics is designed to evolve into a full Life Operating System (Life-OS). It enables users to:

• Track habits, mood, energy, and behavior
• Discover correlations and hidden patterns across their data
• Build routines and structure during recovery
• Receive personalized AI insights and recommendations
• Map out goals, timelines, and life plans

The platform blends analytics, AI, and compassionate design to support meaningful personal transformation.


---

Technology Stack

• Next.js 14 (App Router)
• TypeScript
• TailwindCSS
• Prisma ORM
• NextAuth (authentication scaffolding)
• React Server Components
• AI integrations (OpenAI and future providers)

Each tool is selected for scalability, performance, and the ability to evolve into a full SaaS ecosystem.


---

Project Structure

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
AGENTS.md
README.md
package.json

Directory Summary

app/: Core application pages and layouts
app/api/: Route handlers for auth, users, and analytics
components/: Reusable UI building blocks
lib/: Utility functions and shared helpers
styles/: Global CSS and Tailwind configurations
types/: Shared TypeScript types
prisma/: ORM schema and database scripts
public/: Static assets
scripts/: Automation and internal scripts


---

Development Commands

npm install — Install dependencies
npm run dev — Start local development server
npm run build — Build for production
npm start — Run production build
npm run lint — Lint project
npm run seed — Optional database seeding


---

Environment Variables

Create .env.local based on .env.example and fill in:

DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
OPENAI_API_KEY=""

Additional OAuth credentials may be added as the platform expands.


---

Platform Goals

• Enable rapid MVP iteration
• Maintain a clean, scalable architecture
• Support multi-tenant SaaS functionality
• Leverage AI for life insights and recovery analytics
• Protect user privacy above all
• Surface hidden meaning within personal data
• Help individuals build structure, purpose, and a new identity


---

Product Roadmap

MVP 1 — Core Foundation

• User authentication
• Initial dashboard layout
• Basic analytics API
• CSV ingestion workflow
• Simple insight generation

MVP 2 — Recovery & Personal Insights

• Habit and mood tracking
• Recovery progress dashboards
• AI-powered pattern recognition
• User settings and customization

MVP 3 — SaaS Expansion

• Subscription billing (Stripe)
• Integrations with devices, apps, and services
• Advanced analytics and correlation engine
• Life timeline visualization tools


---

Security & Privacy

Because Esoteros Analytics may process sensitive personal and recovery data, the platform follows strict security principles:

• No unnecessary PII storage
• Protected API layers
• Secure session management
• No logging of sensitive fields
• Data minimization by default

Trust and safety remain core priorities.


---

Contributing

Although currently a single-founder initiative, contributions may open in the future.

Contributors should follow these principles:

• Write clear, maintainable code
• Keep changes small and focused
• Follow TypeScript and Next.js best practices
• Maintain modular, extensible architecture
• Align all work with Esoteros’ mission
• Review AGENTS.md for repo conventions


---

Philosophy

“Esoteros” derives from Greek meaning inner or hidden.
The goal of this platform is to illuminate the unseen:

• patterns
• habits
• triggers
• behaviors
• growth markers

Esoteros exists to help individuals rebuild their lives with insight, structure, and intention—transforming complexity into clarity.


---

License

MIT License (or update if changed later)


---

If you need a landing page, logo design, system architecture docs, or Issue templates for GitHub, I can create them next.


---

If you'd like an even more marketing-heavy version, or a more technical developer-facing version, tell me the tone you prefer.