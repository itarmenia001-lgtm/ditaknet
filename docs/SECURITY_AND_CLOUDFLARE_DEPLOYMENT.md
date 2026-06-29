# DitakNet deployment and security checklist

Այս ֆայլը նախատեսված է `ditaknet.com` production deploy-ի համար։ Կոդը պահվում է միայն `WebStile`-ում, իսկ monitoring server-ի remote վերահսկումը պետք է արվի Cloudflare Tunnel/Access-ով, ոչ թե բաց public port-ով կամ remote shell-ով։

## Required environment variables

Website:

```env
DATABASE_URL="file:/var/lib/ditaknet/ditaknet.db"
NEXTAUTH_SECRET="generate-a-long-random-secret-at-least-32-bytes"
NEXTAUTH_URL="https://ditaknet.com"
NEXT_PUBLIC_DEFAULT_LOCALE="hy"
PUBLIC_DOMAIN="ditaknet.com"
```

First admin account:

```env
ADMIN_EMAIL="admin@ditaknet.com"
ADMIN_PASSWORD="use-a-strong-unique-password"
ADMIN_NAME="DitakNet Admin"
```

Brand/support:

```env
APP_NAME="DitakNet"
APP_DISPLAY_NAME="DitakNet"
APP_BRAND_NAME="DitakNet"
APP_BRAND_NAME_HY="ԴիտակՆեթ"
APP_SUPPORT_EMAIL="support@ditaknet.com"
APP_SUPPORT_PHONE=""
APP_SUPPORT_TELEGRAM=""
APP_SUPPORT_URL="https://ditaknet.com/hy/contact"
APP_DOCUMENTATION_URL="https://ditaknet.com/hy/docs"
```

Optional SMTP:

```env
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="support@ditaknet.com"
```

Optional Cloudflare deployment metadata:

```env
CLOUDFLARE_TUNNEL_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ZONE_ID=""
```

## First production setup

Run these from the server inside `WebStile`:

```powershell
npm ci
npm run prisma:generate
npm run db:init:sqlite
npm run db:seed
npm run build
npm run start
```

For Linux service deployment, use the same commands but run the app under a service manager such as systemd or PM2. Keep the SQLite database path on persistent storage and back it up. If traffic grows, migrate the Prisma datasource to PostgreSQL before scaling to multiple app instances.

## What the admin panel now controls

- New registrations are visible as `PENDING`.
- Admin can change `role`: `USER` or `ADMIN`.
- Admin can change account status: `PENDING`, `APPROVED`, `SUSPENDED`.
- Admin can change purchase status: `NOT_PURCHASED`, `REQUESTED`, `PURCHASED`.
- Admin can change subscription status: `NONE`, `TRIAL`, `ACTIVE`, `EXPIRED`, `CANCELED`.
- Admin can set a subscription expiry date.
- Approving or completing a license request automatically marks the linked user as `APPROVED`, `PURCHASED`, and `ACTIVE`.
- Suspended users have their active sessions revoked.
- Admin sessions page shows active/recent sessions, IP, Cloudflare country/city headers, user agent, role, approval, purchase, and subscription status.

## Cloudflare checklist for ditaknet.com

- Point `ditaknet.com` DNS to the web server and keep the record proxied through Cloudflare.
- Use HTTPS only. Prefer Cloudflare SSL mode `Full (strict)` with a valid origin certificate.
- Restrict the origin server firewall so HTTP/HTTPS accepts traffic only from Cloudflare IP ranges.
- Add WAF/rate limiting rules for:
  - `/api/auth/*`
  - `/api/admin/*`
  - `/hy/admin/*`, `/en/admin/*`, `/ru/admin/*`
- Protect admin routes with the app login. For stronger protection, add Cloudflare Access in front of `/hy/admin/*`, `/en/admin/*`, `/ru/admin/*` and allow only admin emails.
- Keep `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`, SMTP secrets, and tunnel tokens only on the server.

## Remote monitoring control

Use this model:

- Monitoring server listens on private/local network only.
- Cloudflare Tunnel exposes only the intended HTTPS hostname, for example `monitor.ditaknet.com`.
- Cloudflare Access protects the monitoring hostname with admin identity checks.
- No SSH, database, or raw API port should be public.
- Do not add browser-triggered remote shell commands to the website admin panel. Remote control should be audited, role-limited, and handled by the monitoring server's own authenticated API.

## Prompt for server configuration work

```text
You are configuring the DitakNet production server for WebStile.
Work only inside the WebStile deployment and server configuration.
Use domain ditaknet.com behind Cloudflare proxy.
Configure env values: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SMTP, and optional Cloudflare tunnel metadata.
Run npm ci, prisma generate, db:init:sqlite, db:seed, build, and start.
Do not expose the origin server directly; restrict traffic to Cloudflare and keep admin routes protected.
For monitoring remote access, use Cloudflare Tunnel + Cloudflare Access. Do not create a remote shell/backdoor.
Verify /hy, /hy/login, /hy/account, /hy/admin, /hy/admin/users, and /hy/admin/sessions.
```

## Admin note

Գրանցված մարդը սկզբում պետք է մնա `PENDING`։ Եթե նա գնման հայտ է ուղարկում, admin-ում կերեւա `REQUESTED`։ Երբ հայտը հաստատում եք `APPROVED` կամ `COMPLETED`, user-ը դառնում է active subscriber։
