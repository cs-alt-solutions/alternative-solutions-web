# LOCAL WIRING - FOUNDATION COMMAND (Next.js)

**GLOBAL LAWS:**
All development in this repository strictly adheres to the Alternative Solutions Master Protocol. 
➔ [Refer to MASTER_ARCHITECTURE.md in the root directory]

**LOCAL PROJECT RULES (Exceptions & Specifics):**
1. **Framework:** This specific project utilizes Next.js App Router (`src/app/`).
2. **Routing:** All Stripe Webhooks must be routed through `src/app/api/webhooks/stripe/route.ts`.
3. **Database:** Supabase is utilized via `@supabase/ssr` for server-side component fetching.