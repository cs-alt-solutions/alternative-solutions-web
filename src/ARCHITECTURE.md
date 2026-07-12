# LOCAL WIRING - FOUNDATION COMMAND (Next.js)

**GLOBAL LAWS:**
All development in this repository strictly adheres to the Alternative Solutions Master Protocol. 
➔ [Refer to MASTER_ARCHITECTURE.md in the root directory]

**LOCAL PROJECT RULES (Exceptions & Specifics):**
1. **Framework:** This specific project utilizes Next.js App Router (`src/app/`).
2. **Routing:** All Stripe Webhooks must be routed through `src/app/api/webhooks/stripe/route.ts`.
3. **Database:** Supabase is utilized via `@supabase/ssr` for server-side component fetching.
4. **Route Registry Pattern (No Hardcoded URLs):** 
   - **The Rule:** Never use hardcoded URL strings (e.g., `href="/dashboard/settings"`) inside components, buttons, or server actions. 
   - **The Execution:** All internal navigation MUST utilize the `ROUTES` object imported from the central registry (`src/utils/glossary.ts`).
   - **The Why:** Decoupling the URL path from the UI component ensures the platform's routing structure can be refactored or rebranded from a single configuration file without causing broken links across the ecosystem.
   - **Example:** Always use `<Link href={ROUTES.DASHBOARD.SETTINGS}>` instead of `<Link href="/dashboard/settings">`.