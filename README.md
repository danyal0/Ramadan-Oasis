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
- Deterministic curation mode that pins approved images per section
- Dynamic semantic color palette generated from selected section imagery
- Mobile-first responsive typography and spacing system
- Secure registration endpoint with server-side validation and extensible provider seam
- Implemented routes: `/resources`, `/recordings`, `/login`, `/offerings`
- Lightweight content admin at `/admin/content` for JSON editing without code changes

## Extensibility Notes

- Upload photos into `public/photos` (any nested structure, random filenames supported).
- `src/lib/photos.ts` handles image discovery, orientation scoring, and section-level selection.
- Copy and editable datasets are stored in `src/content/site-content.json`.
- Admin editing is exposed via `src/app/api/admin/content/route.ts` and `/admin/content`.
- `src/lib/palette.ts` + `src/components/palette-provider.tsx` provide dynamic, accessible design tokens based on image sampling.
- `src/config/site.ts` centralizes editable brand/offering content and schedule/outline data.
- `src/lib/registration.ts` isolates orchestration logic so providers can be replaced without changing UI.
- `src/app/api/register/route.ts` enforces schema validation and clean error handling for secure form processing.
- Additional offerings can be represented as data models in a future DB/CMS and mapped to reusable page components.

## Content Editing and Curation

- Set `ADMIN_EDIT_TOKEN` in `.env.local`.
- Visit `/admin/content`, load content, edit JSON, and save.
- Toggle `curation.enabled` to `true` and populate `pinnedBySection` arrays with photo paths (e.g. `"/photos/my-image.jpg"`).
- When curation mode is enabled, pinned images are shown first in your exact order, then remaining eligible images continue in rotation.

## Phase 2 Implementation (MVP)

1. **Multi-offering architecture**
   - Implemented dynamic offering routes at `/offerings/[slug]` with shared rendering templates.
   - Added offering repository abstraction with local JSON (`src/content/offerings.json`) and optional CMS source via `OFFERINGS_CMS_URL`.

2. **Accounts and access control**
   - Implemented cookie-based auth APIs: `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`.
   - Added seeded roles and offering enrollment checks (`src/content/enrollments.json`) used by protected pages and APIs.

3. **Community and engagement**
   - Added authenticated community feed at `/community` with discussions/reflections and API endpoints at `/api/community/posts`.
   - Added background-job seam for reminders/digests at `/api/jobs/digest` (ready for cron/Trigger.dev/Inngest wiring).

4. **Media library and recordings**
   - Added recordings metadata store (`src/content/recordings.json`) with storage keys and Mux playback IDs.
   - Implemented enrollment-gated recordings UI at `/recordings`.

5. **Commercial flexibility**
   - Added contribution tiers to offering models and mock payment-intent API at `/api/payments/intents`.
   - Added auditable transaction logging in `src/content/transactions.json`, including scholarship and sponsorship fields.

6. **Operational maturity**
   - Added structured logging/error capture utilities (`src/lib/observability.ts`) and analytics ingestion endpoint (`/api/analytics/track`).
   - Added admin operations page (`/admin/operations`) and integration tests for registration and auth-protected routes (`tests/integration`).
