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
5. Open `/dashboard.html`, authenticate with the admin token, and import a Wedding Planner JSON backup with `data.guests`, or CSV with columns `id,name,phone,party_size`. It preserves planner IDs and re-imports preserve personal tokens.
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

## Cartoon animation edition (v2)

The invitation now includes **seven self-contained, illustrated SVG character scenes** rather than generic animated cards. Characters and decorations are drawn directly as vector shapes; no third-party video, external stock art, paid service, animation player, or remote dependency is required. The illustrations intentionally use a colorful storybook/cartoon treatment, not likenesses of real family members.

| Scene | Illustrated action |
|---|---|
| Shri Ganesh opening | A respectful cartoon Shri Ganesh raises a blessing hand, swings his trunk, and floats in a glowing temple setting while petals move across the screen. |
| Couple introduction | Cartoon Pankaj and Neetu sway, wave and appear under a decorated arch with an animated heart. |
| Tilak | A family elder reaches toward the groom's forehead, the groom bows and the tilak appears. |
| Haldi | A family member applies haldi to the groom; turmeric splashes appear and the groom laughs. |
| Mehndi | An artist moves her hand across a henna pattern that draws itself, with festive details in the background. |
| Matkor | Women dance around a decorated kalash and soil motif, with pouring-water animation. |
| Shubh Vivah | Cartoon bride and groom move around the sacred fire beneath a decorated mandap, with flames and flower petals. |

All character and particle animation is suspended in inactive scenes and paused when the film playback is paused. The animations honor `prefers-reduced-motion`. Mobile and desktop screenshots were checked with headless Chromium (412×915 and 1280×850). The RSVP backend and private guest dashboard are unchanged; this visual enhancement does not activate or change Supabase credentials or Wedding Planner data synchronization.


## Daylight scene treatment (v3)

The film now defaults to an ivory/champagne/soft-blush daylight theme with nuanced 2.5D illustrated character animation, event-specific choreographed gestures, blinking, gentle breathing, ceremonial props, foreground flower drift, and pointer-responsive camera parallax. These are illustrated animations, **not photorealistic recorded footage**. `/light-realism.css` contains theme and choreography overrides; `/motion.js` adds a 4px limited, accessibility-aware pointer camera effect. `index.html` contains the staged SVG artwork. No remote animation library or paid tier is needed. The existing RSVP backend, Supabase migration and guest dashboard are unchanged; server-side environment variables are still required before live persistence works.
