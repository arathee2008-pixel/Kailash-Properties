# Kailash Properties — setup guide

This is the first working website starter for Kailash Properties. It includes a public real-estate website, a private owner login, a property dashboard, image uploads and Supabase database integration.

## 1. Files
- `index.html` — public website
- `owner-login.html` — private owner sign-in
- `dashboard.html` — owner-only property manager
- `config.js` — public Supabase URL/key and WhatsApp number
- `supabase/schema.sql` — database, access policies and photo bucket
- `supabase/owner-accounts.sql` — username-to-owner-email mapping
- `supabase/functions/owner-login/index.ts` — secure username login helper

## 2. Create Supabase project
1. Create a project at https://supabase.com.
2. In Project Settings → API, copy the Project URL and anon/public key.
3. Paste them into `config.js`. Add the WhatsApp number in international format, digits only, e.g. `9198XXXXXXXX`.

## 3. Create database and photo storage
1. Open Supabase → SQL Editor.
2. Run all contents of `supabase/schema.sql`.
3. In Authentication → Users, create the one owner account with an email and a strong password.
4. Run `supabase/owner-accounts.sql` after replacing `CHOOSE_OWNER_USERNAME` and `owner@example.com` with the chosen username and the exact Auth email.

## 4. Deploy username login function
Install the Supabase CLI and link this folder to your Supabase project. Then set function secrets and deploy:
```bash
supabase secrets set OWNER_USERNAME=your_chosen_username SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase functions deploy owner-login
```
The project URL is supplied to deployed Edge Functions by Supabase. Do not paste the service role key into `config.js` or any browser-side file.
The login page accepts the owner username and password. The Edge Function resolves the configured username to the owner's Auth email, then the browser completes Supabase Auth password sign-in.

## 5. Run locally
A local web server is recommended (do not just double-click HTML files). In the project folder, run:
```bash
python -m http.server 5500
```
Then open `http://localhost:5500`.

## 6. Publish online
Deploy the folder to a static host such as Netlify, Vercel or Cloudflare Pages. Add your Supabase URL and anon key in `config.js`. Use HTTPS. Configure Supabase Auth URL settings with your deployed website URL.

## Security notes
- Only create one owner account. The SQL policy grants property management to authenticated accounts, so do not create other users.
- The owner dashboard redirects visitors who are not signed in. Database row-level security also protects write operations.
- The owner-login Edge Function returns the owner's Auth email only after the configured username matches. The password itself is checked by Supabase Auth and is never stored in this project.
- Add rate limiting / CAPTCHA to the login function before promoting the site publicly.
- The `property-photos` bucket is public for published listing images. Never upload private documents or identity proofs there.
- Replace demo images and placeholder WhatsApp number before launch.

## Current scope
The site is set up for Gurgaon and Delhi NCR, English language, all-in-one residential/commercial/plots, buy/sell/rent. It has no direct-call button. WhatsApp enquiry is the only contact CTA currently included.
