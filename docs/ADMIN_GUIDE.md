# Admin Guide

## Create First Admin

Set these values in `.env`:

```bash
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_NAME="DitakNet Admin"
```

Then run:

```bash
npm run db:seed
```

The seed script creates or updates the admin user.

## Admin Capabilities

- View registered users.
- View and update license request status and admin notes.
- View contact messages.
- View support tickets and update status or priority.
- Reply to tickets from the ticket detail page.
- View and answer discussions.
- Review environment-backed site settings.

## Status Values

License request status:

- `NEW`
- `IN_REVIEW`
- `APPROVED`
- `REJECTED`
- `COMPLETED`

Ticket status:

- `OPEN`
- `ANSWERED`
- `CLOSED`

## Security Notes

- Admin routes are protected by session and role checks.
- Password hashes are never selected into public UI.
- Do not store license signing keys in this website.
- SMTP is optional and must be configured through environment variables only.
