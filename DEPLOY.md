# Deploy to Vercel (step-by-step)

This project is a Vite React SPA. If you see `404` when opening client-side routes like `/admin` after deploy, make sure the deployment rewrites unknown routes to `index.html` (so BrowserRouter works).

Files added to help deploy:
- `vercel.json` — config that tells Vercel to build with `@vercel/static-build` and rewrite all routes to `index.html`.

Recommended deploy steps
1. Do not commit `.env.local` with keys. Instead add it to `.gitignore`:

```powershell
echo ".env.local" >> .gitignore
git rm --cached .env.local || true
git add .gitignore
git commit -m "Ignore local env file"
```

2. Commit your changes (including `vercel.json` and the Supabase migration SQL):

```powershell
git add .
git commit -m "Prepare Vercel deploy: vercel.json + Supabase migration"
```

3. Push to GitHub and connect the repo in Vercel (or use `vercel` CLI):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# then on Vercel: Import Project -> select your repo
```

4. Set environment variables in Vercel project settings (Production & Preview):
- `VITE_SUPABASE_URL` (your Supabase URL)
- `VITE_SUPABASE_ANON_KEY` (anon/public key)

5. Apply the Supabase migration (to enable admin policies) via Supabase SQL Editor:

 - Open Supabase Dashboard → SQL Editor → paste `supabase/migrations/20251211091500_enable_admin_delete.sql` and run.

6. Trigger a deploy on Vercel (push or redeploy from dashboard). After deploy completes, visit your site and test `/admin`.

If you still get 404 on `/admin`:
- Open DevTools → Network and check the request for `/admin` — if server returns 404 rather than serving `index.html`, Vercel did not apply the rewrite. Ensure `vercel.json` is present in the repo root and redeploy.

Security notes
- Do NOT store `service_role` keys in client-side env. If you need server-side deletes, use an Edge Function with the service role stored as a protected secret.
