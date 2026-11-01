# Pankaj ♥ Neetu — Cinematic Wedding Invitation

A standalone, mobile-first, autoplay cinematic wedding invitation with a Shri Ganesh opening and separate Tilak, Haldi, Mehndi, Matkor and wedding scenes, ending in an RSVP form.

## Wedding events (confirmed)

| Event | Date | Place |
| --- | --- | --- |
| Tilak | 2 December 2026 | Bagauchha, Maharajganj, Siwan (groom's side) |
| Haldi | 3 December 2026 | Bagauchha, groom's home (groom only) |
| Mehndi | 3 December 2026 | Bagauchha, groom's home (groom only) |
| Matkor | 4 December 2026 | Bagauchha, Maharajganj, Siwan |
| Shubh Vivah | 5 December 2026 | Somvarsha, Gopalganj (bride's side) |

No Bahubhoj or Reception. No ceremony hours were invented; unconfirmed times are shown as *शुभ समयानुसार*.

## Frontend

A designed social-sharing image is included in the downloadable package as `og-cover.jpg`; linking it in the deployed Open Graph metadata is pending upload.

Plain HTML, CSS, JavaScript (no build or paid dependencies); uses animated 3D CSS temple doors, moving mandap fire, gold SVG strokes, mehndi vine drawing, procedural canvas petals, parallax/radial backgrounds, timed choreography, timeline seeking, keyboard navigation, responsive design and reduced-motion preference. Optional original synthesized ambient notes require a tap to start because browsers prohibit autoplaying sound.

## Deployment

1. Connect **kumarPint00/invitation-card-pankaj** to a **new** Vercel project. Do not reuse the Wedding Planner project.
2. Deploy the public page and test `/api/health`.
3. To activate RSVPs, use the **same Supabase project as the existing Wedding Planner**, run `sql/001_invitation_schema.sql` in Supabase SQL Editor, then configure **only in Vercel environment variables**:
   - `SUPABASE_URL` — the existing project URL (server-side).
   - `SUPABASE_SERVICE_ROLE_KEY` — existing project's service role key. Never place this in HTML, public JS or GitHub.
   - `ADMIN_DASHBOARD_TOKEN` — new, random secret >= 28 characters for `/dashboard.html`.
   - `RSVP_HASH_SECRET` — separate long random HMAC secret (recommended).
4. Redeploy to make env settings active. Test one RSVP; check the dashboard.
5. Open `/dashboard.html`, authenticate with the admin token, and import a Wedding Planner JSON backup with `data.guests`, or CSV with columns `id,name,phone,party_size`. It preserves planner IDs and re-imports preserve personal tokens. The dashboard also supports manually adding a guest and, when no guest records exist, explicitly opting into previewing planner contacts as possible invitees. It never sends all contacts without your review.
6. Share personal URLs copied from the dashboard; generic URL supports a phone-number-identified RSVP.

### Relationship to Wedding Planner

The `kumarPint00/wedding-planner` repository is an **Android WebView wrapper**, not the source for the live planner site. The live Wedding Planner is a separate Vercel API-source deployment and does not expose its schema or server-side Supabase credentials through its project environment variables. This invitation's migration creates **new, isolated tables inside that same Supabase project**; it will not modify planner data.

**Important limitation:** The invitation has a functioning database integration once configured, and the private dashboard can import existing planner guests (preserving original IDs). However, **automatic synchronization into the live planner dashboard is not enabled**; that requires authorized access to the planner's current web source and its real guest storage/schema, then a safe patch to that separate deployment. Do not assume the planner's Android GitHub repository pushes will update the web app.

## Security

- All database access uses Vercel serverless functions and Supabase service role **server-side only**; frontend never receives admin/service keys.
- RLS enabled and no public table policies; public RSVP endpoint validates names, mobile numbers, party size, events, link tokens, origin and a honeypot.
- Postgres RPC rate-limits hashed client IPs to 10 attempts/hour (not a substitute for production WAF/CAPTCHA at high traffic).
- Admin uses a random server-side token and constant-time comparison. Do not share admin links with credentials in query strings.
- RSVP deduplicates by tokenized guest ID or HMAC of phone; no duplicate guest rows from a response.
- No wedding guest data embedded in public repository.

## Local preview & tests

Run `python3 -m http.server 8080` from this directory and open `http://localhost:8080`. This previews animation; the RSVP API requires Vercel or a compatible server. `npm test` checks core endpoint validation. For full backend verification, configure Supabase and deploy in Vercel, then test an RSVP end-to-end.
