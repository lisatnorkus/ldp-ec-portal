# Inbound email → portal

The portal accepts inbound email via a single webhook:

```
POST https://<portal-domain>/api/inbound-email
```

Email becomes a **note**, **task**, or **contact** in the sender's LD based
on the subject line.

## What senders can do

Sender must be an EC member (their email has to match a row in `ec_members.email`).
Anything from an unknown address is rejected.

| Subject starts with… | What happens |
| --- | --- |
| `#task <title>` | Creates an LD task in the sender's LD, assigned to the sender, auto-accepted. Description = email body. |
| `#contact First Last` | Creates a prospect in the sender's LD (pipeline stage `IDENTIFIED`). Notes = email body. |
| *anything else* | Creates an LD note. Subject is bolded at the top; body follows. |

Reply quoting (`On Mar 25, X wrote:`, `-----Original Message-----`, `>`)
is stripped so replies don't duplicate context into the note.

## Required env vars (Vercel)

- `INBOUND_EMAIL_SECRET` — shared secret the webhook checks. Generate any
  random string (`openssl rand -hex 32`). The email provider has to send
  this on every request.

## Provider setup

Any provider that can parse incoming email and POST a webhook will work.
The webhook expects this JSON shape:

```json
{
  "from": "lisatnorkus@gmail.com",   // or { "email": "..." }
  "subject": "#task Follow up with Beth",
  "text": "Email body here"
}
```

### Option A — Resend Inbound

1. Add an MX record on a subdomain (e.g., `inbox.louisvilledems.dev`)
   pointing at Resend's inbound servers per their docs.
2. In Resend, create an inbound route:
   - Address: `anything@inbox.louisvilledems.dev`
   - Forward to: `https://<portal-domain>/api/inbound-email?secret=<your-secret>`
3. Resend's default payload matches the expected shape — no mapping
   needed.

### Option B — Cloudflare Email Workers (free)

1. If the domain is on Cloudflare, enable Email Routing.
2. Create a Worker that:
   - Parses the incoming email (`message.raw` → text)
   - POSTs to `https://<portal-domain>/api/inbound-email` with
     `x-inbound-secret: <your-secret>` header
   - Body: `{ from, subject, text }`
3. Route `inbox@louisvilledems.app` (or whatever) to that worker.

### Option C — Postmark, SendGrid, Mailgun

All have inbound parse webhooks. Configure the forward URL to include
`?secret=<your-secret>` and map their payload to the normalized shape
via a tiny wrapper (or let the endpoint pattern-match — it already
tolerates `from` as a string or `{email}` object).

## Example: send a note from email

From: `lisatnorkus@gmail.com`
To: `inbox@<your-domain>`
Subject: `What Robert said in the meeting`
Body:

```
Robert confirmed he can push the Wendell Ford ticket-sale link
through Campaign Deputy this week. Loops Beth once the template
lands.
```

→ Appears on `/my-ld/41` as a new note, attributed to Lisa Tanner Norkus.

## Example: create a task

Subject: `#task Coordinate canvass shifts with Betsy Ruhe's MC21 team`
Body: `Aim for the first weekend in May.`

→ Creates an open task in LD41, assigned to Lisa, auto-accepted.

## Failure modes

- **Sender not in allowlist** → 403. Email silently dropped as far as
  the sender is concerned; the provider's logs will show the rejection.
- **Missing secret** → 401.
- **Sender has no LD set** → 400. Most EC members have an LD; a few
  officers / at-large members don't. Those senders can't use inbound
  yet — they'd need either the ability to route to a committee or an
  explicit `#ld 41` prefix, which isn't built.
- **Invalid JSON / missing fields** → 400.
