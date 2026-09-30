# Activity Tracker App (Next.js + Supabase)

Daily activity entry -> preview -> save to Supabase (PostgreSQL) -> search -> export to Excel.

## Run it
1. `npm install`
2. In Supabase: SQL Editor -> paste `supabase.sql` -> Run (creates the entries and admins tables)
3. Add an admin: run the `insert into public.admins ...` statement at the bottom of `supabase.sql` with your own email and password
4. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and `SESSION_SECRET`
5. `npm run dev` and open http://localhost:3000

## Access
- Anyone can submit the form on `/`
- `/records`, `GET /api/users` and `/api/export` need an admin login (email + password from the `admins` table)
- Passwords are stored as bcrypt hashes; login is a signed, httpOnly cookie valid for 7 days

## Structure
- `app/page.tsx` form and preview step
- `app/login/page.tsx`, `app/api/login`, `app/api/logout` admin login
- `app/records/page.tsx` search list and Excel export button
- `app/api/users/route.ts` save (POST) and list/search (GET)
- `app/api/export/route.ts` builds the .xlsx with ExcelJS
- `lib/schema.ts` Zod schema, field list and row mapping (edit to add or change fields)
- `lib/supabase.ts`, `lib/session.ts`, `lib/auth.ts` database client and login session
- `supabase.sql` table definitions
