# Total Bellas GH

A Next.js storefront + admin panel for Total Bellas GH, a Ghanaian boutique selling curated
U.K. high street fashion (clothing, shoes, bags, fragrance).

- **Storefront**: browse by category, view product detail pages, add to cart, and place an
  order (name, phone/email, delivery address, items) — **no payment is collected on the site**.
- **Admin panel**: a single password-protected area where the business owner adds/edits/deletes
  products, uploads photos, and manages incoming orders. Stock ("in stock" / "out of stock") is
  always derived from the quantity field — there is no separate toggle that could drift out of sync.

## Why there's no payment step yet

Payments aren't being collected through the website yet — orders are captured here and the
business follows up with the customer manually to arrange payment and delivery. The codebase is
structured so that changes when a real gateway (e.g. Paystack or Stripe) is ready:

- `Order.status` (`PENDING`/`CONFIRMED`/`FULFILLED`/`CANCELLED`) and `Order.paymentStatus`
  (`UNPAID`/`PAID`/`REFUNDED`) are separate fields — payment status is not currently used to gate
  anything.
- Every order stores itemized line items with the **unit price at the time of order** (never a
  live re-read of the current product price), so a payment amount can always be calculated or
  charged retroactively if needed.
- **`lib/payments/processPayment.ts`** is the single insertion point for a real gateway. It's
  currently a synchronous no-op that always returns success. `actions/orders.ts` (`placeOrder`)
  calls it right after creating the order row. To add real payments later: swap the body of that
  one function (and wire up whatever redirect/webhook flow the gateway needs) — the checkout flow
  around it does not need to be restructured.

## Tech stack

- **Next.js 15** (App Router, TypeScript) for both the storefront and the admin panel
- **PostgreSQL** via **Prisma** (DigitalOcean Managed Database in production)
- **DigitalOcean Spaces** (S3-compatible) for product images, via presigned direct-to-storage
  uploads
- **Resend** for the order-notification and contact-message emails
- The existing hand-written CSS (`css/*.css`) is reused as-is (not rewritten in Tailwind) —
  colors, fonts, and every component's markup/classes carry over exactly from the original design.

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables** — copy `.env.example` to `.env` and fill in real values:
   ```bash
   cp .env.example .env
   ```
   See [Environment variables](#environment-variables) below for what each one is for.

   For local development you need a reachable PostgreSQL database. Easiest options:
   - A free instance from [Neon](https://neon.tech) or [Supabase](https://supabase.com) (a
     couple of minutes to set up, works immediately as a `DATABASE_URL`).
   - A local Postgres via Docker: `docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`.

   Product image uploads need a DigitalOcean Spaces bucket + access key (`SPACES_*` env vars).
   Until you set those up, the admin image uploader won't work, but the rest of the app
   (including the seeded product photos, which point at local files in `public/products/`) runs
   fine without it.

3. **Create the database schema**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the real product catalog** (the ~25 products currently sold, with placeholder starting
   quantities and descriptions — see [Post-launch checklist](#post-launch-checklist)):
   ```bash
   npm run db:seed
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin` for the
   admin panel (log in with your `ADMIN_PASSWORD`).

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled, used by the app at runtime) |
| `DIRECT_URL` | Non-pooled PostgreSQL connection string, used only by `prisma migrate` |
| `SPACES_KEY` / `SPACES_SECRET` | DigitalOcean Spaces access key/secret |
| `SPACES_BUCKET` | Spaces bucket name |
| `SPACES_REGION` | Spaces region, e.g. `nyc3` |
| `SPACES_ENDPOINT` | Spaces endpoint URL, e.g. `https://nyc3.digitaloceanspaces.com` |
| `SPACES_CDN_URL` | Optional — set if you enable a Spaces CDN endpoint |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `OWNER_NOTIFICATION_EMAIL` | Where new-order and contact-message emails are sent |
| `ADMIN_PASSWORD` | The single shared admin password |
| `SESSION_SECRET` | Long random string used to sign the admin session cookie (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for absolute links in emails |

`.env.example` lists all of these with placeholders. `.env`/`.env.local` are gitignored — never
commit real secrets.

## Migrating real product photos to DigitalOcean Spaces

The seed data currently points at the original product photos copied into `public/products/`
(fine for local development). Before going live, upload them to Spaces instead:

```bash
npm run db:migrate-images
```

This uploads every photo in `Website Images/Pictures for website/` and `Website Images/Bags/` to
your Spaces bucket (skipping a known duplicate file and 3 unused perfume photos) and prints a
filename → public URL map. You can either paste those URLs into `prisma/seed-data/*.ts` and
re-seed, or — often simpler for a ~25-item catalog — just re-upload each product's photos once
through the admin panel's own image uploader after deployment, using the exact same tool you'll
use going forward.

## Deploying to DigitalOcean App Platform

You'll need three DigitalOcean resources:
1. **A Managed PostgreSQL database** — copy its connection string into `DATABASE_URL`.
2. **A Spaces bucket** — create it, then generate a Spaces access key/secret for `SPACES_KEY`/`SPACES_SECRET`.
3. **An App Platform Web Service**, created from this GitHub repo:
   - Build command: `npm run build` (this runs `prisma generate && next build`)
   - Run command: `npm run start`
   - Add every variable from [Environment variables](#environment-variables) as an **encrypted**
     app-level environment variable (never commit them)

**Run migrations against the production database after every schema change** — this is a manual
step, not automated by the build:
```bash
DATABASE_URL="<production-url>" npx prisma migrate deploy
```
Do this once after the first deploy, and again any time `prisma/schema.prisma` changes.

## Post-launch checklist

The static site this replaced never tracked real inventory or wrote product descriptions, so the
seed data uses placeholders:
- **Quantities** are seeded at `5` for every product — go through Admin → Products and set real
  stock counts.
- **Descriptions** are short placeholder text — fill these in with real copy per product.
- **Product photos** — see the migration section above.

## What's static vs. database-backed

`About`, `Policies`, and `Social Code of Conduct` are plain static pages (not database-backed) —
they change a few times a year at most, so editing the `.tsx` file and redeploying is simpler
than building a CMS flow for them. If you later want the owner to edit this copy herself without
a developer, the lowest-effort upgrade is moving it into a simple admin-editable text field —
not built in this version.

Brand names (Zara, River Island, Asos, Aldo, Next, Mango) and business contact info (phone,
email, Instagram, hours) live in `lib/site-config.ts` for the same reason — a code change, not
an admin panel field.

## Project structure

```
app/(site)/        # public storefront — home, category pages, product detail, cart, checkout,
                    # order confirmation, about/policies/social-code-of-conduct, contact
app/admin/          # admin panel — login (unguarded) + a (protected) route group with the
                    # dashboard, orders, and product management, gated by lib/auth.ts
app/api/uploads/    # presigned-upload endpoint for the admin image uploader
actions/            # server actions — products, orders (checkout), contact, auth
lib/                # db client, auth, email, storage (Spaces), payments placeholder, cart
                    # context, validation, formatting, static site config
components/         # site chrome, product cards, cart, checkout, contact, admin UI
prisma/             # schema, seed script, seed data (the real ~25 products)
scripts/            # one-off image migration tool
css/                # the original hand-written stylesheets, imported globally — unchanged
```
