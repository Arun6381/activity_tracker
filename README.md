# Activity Tracker App (Next.js + Supabase)

Admin-built form templates -> public form with preview -> save to Supabase -> admin records with search -> export to Excel.

## Run it
1. `npm install`
2. Supabase -> SQL Editor -> paste `supabase.sql`, uncomment the last `insert` with your admin email and password -> Run
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SESSION_SECRET`
4. `npm run dev` and open http://localhost:3000

## Pages
- `/` choose a form (anyone) and `/f/<url-name>` fill in a form (anyone)
- `/login` admin sign in
- `/records` view, search and export entries per template (admin)
- `/admin/templates` create and edit templates (admin)

## Notes
- Login compares plain text for now. Before going live, re-enable bcrypt in `app/api/login/route.ts` and store hashes.
- A field's key is locked after it is created; removing a field hides it but keeps old answers in the database.
