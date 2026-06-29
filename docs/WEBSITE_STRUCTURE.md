# Website Structure

## Public Website

- `/[locale]` - home page with hero, features, dashboard visual, Docker/TrueNAS, discovery, Telegram alerts, pricing preview, and FAQ CTA.
- `/[locale]/features` - feature overview.
- `/[locale]/pricing` - Free, Medium, and Professional package comparison.
- `/[locale]/about` - product purpose and vision.
- `/[locale]/contact` - contact form.
- `/[locale]/support` - support hub.
- `/[locale]/docs` and `/[locale]/docs/[slug]` - documentation landing and article placeholders.
- `/[locale]/faq` - FAQ.
- `/[locale]/blog` - news placeholder.

## Customer Portal

- `/[locale]/register` - online registration.
- `/[locale]/login` - login.
- `/[locale]/logout` - session logout.
- `/[locale]/account` - profile and next actions.
- `/[locale]/account/licenses` - customer license requests.
- `/[locale]/license/request` - license request form.
- `/[locale]/license/activate-info` - post-request success and activation information.
- `/[locale]/support/tickets` - customer tickets.
- `/[locale]/support/tickets/new` - create ticket.
- `/[locale]/support/tickets/[id]` - ticket messages and replies.
- `/[locale]/discussions` - public discussion questions and replies.

## Admin

- `/[locale]/admin` - admin dashboard.
- `/[locale]/admin/users`
- `/[locale]/admin/license-requests`
- `/[locale]/admin/contact-messages`
- `/[locale]/admin/tickets`
- `/[locale]/admin/discussions`
- `/[locale]/admin/settings`

Admin routes require a user with `role = ADMIN`.
