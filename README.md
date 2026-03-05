# OumNur Platform

Production-ready Next.js platform for OumNur.com, featuring a refined home experience for Antonia Alberte and a dedicated Ramadan Oasis journey page.

## Recommended Stack

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend/API: Next.js Route Handlers with provider adapters
- Validation: Zod schemas at API boundaries
- Auth for Phase 2: Better Auth or Auth.js with PostgreSQL sessions
- Database for Phase 2: PostgreSQL + Prisma
- Background jobs/emails for Phase 2: Trigger.dev or Inngest + Resend
- Storage/streaming for recordings in Phase 2: Cloudflare R2 or S3 + Mux
- Hosting: Vercel (frontend + API), managed Postgres (Neon/Supabase), managed Redis (Upstash) as needed

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env variables:

   ```bash
   cp .env.example .env.local
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

## Current Capabilities

- Home page with narrative sections and restrained motion design
- Dedicated `/ramadan-oasis` page built as a journey, not a sales funnel
- Dynamic photo manifest from `public/photos` with landscape-first selection heuristics
- Dynamic semantic color palette generated from selected section imagery
- Mobile-first responsive typography and spacing system
- Secure registration endpoint with server-side validation and extensible provider seam
- Placeholder expansion routes: `/resources`, `/recordings`, `/login`, `/offerings`

## Extensibility Notes

- Upload photos into `public/photos` (any nested structure, random filenames supported).
- `src/lib/photos.ts` handles image discovery, orientation scoring, and section-level selection.
- `src/lib/palette.ts` + `src/components/palette-provider.tsx` provide dynamic, accessible design tokens based on image sampling.
- `src/config/site.ts` centralizes editable brand/offering content and schedule/outline data.
- `src/lib/registration.ts` isolates orchestration logic so providers can be replaced without changing UI.
- `src/app/api/register/route.ts` enforces schema validation and clean error handling for secure form processing.
- Additional offerings can be represented as data models in a future DB/CMS and mapped to reusable page components.

## Phase 2 Expansion Blueprint

1. **Multi-offering architecture**
   - Add route groups like `/offerings/[slug]` and shared offering templates.
   - Move offering content into a DB (PostgreSQL) or headless CMS.

2. **Accounts and access control**
   - Implement auth (Better Auth/Auth.js).
   - Add participant roles, offering enrollments, and permission checks per offering.

3. **Community and engagement**
   - Add authenticated community feed/discussion and reflections.
   - Introduce notifications, reminders, and digest emails via background jobs.

4. **Media library and recordings**
   - Upload recordings to object storage.
   - Stream through Mux (or equivalent), with gated playback by enrollment.

5. **Commercial flexibility**
   - Add payment intents + contribution tiers while preserving pay-what-you-can options.
   - Track scholarships/sponsorships and receipts with auditable transaction logs.

6. **Operational maturity**
   - Add observability (Sentry + logs), analytics, and admin tooling.
   - Add integration tests for registration flows and auth-protected routes.
