# JA Event Production

A static, quote-first website for Justin Abrahams Event Production. The site helps North Georgia customers compare sound and lighting rental packages, understand available support options, and request availability without displaying fixed pricing.

## Start here

### For the business owner

- [Preview and review the website on Windows](docs/OWNER_TESTING.md)
- [See an example of useful website feedback](docs/FEEDBACK_EXAMPLE.md)
- [Complete the repository ownership handoff](docs/OWNERSHIP_HANDOFF.md)

Website changes should be requested through the repository's **Issues** tab. Choose the **Website change or feedback** form so the developer receives the page, requested result, screenshot, and acceptance criteria in one place.

### For developers

This project uses Next.js, React, TypeScript, and Tailwind CSS. It exports to static files and does not require a database or application server.

```powershell
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000). For a complete Windows setup and repeatable update workflow, use the [owner testing guide](docs/OWNER_TESTING.md).

## Public configuration

Copy `.env.example` to `.env.local` before local testing:

```powershell
Copy-Item .env.example .env.local
```

| Setting | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Displays the public email address and enables a prefilled email fallback. |
| `NEXT_PUBLIC_QUOTE_FORM_ENDPOINT` | Sends the quote form to a hosted form service when configured. |
| `NEXT_PUBLIC_SITE_URL` | Sets the production website URL for social-sharing metadata. |

These values are embedded in the generated site and must not contain passwords, API keys, or other secrets. `.env.local` is ignored by Git and must remain uncommitted.

If only the contact email is configured, submitting the quote form opens the visitor's email application with a prepared message. If a form endpoint is configured, the form submits to that service. If neither is configured, the site explains that quote requests are temporarily unavailable.

Restart the development server after changing environment settings.

## Development checks

Before opening a pull request or merging a change:

```powershell
npm.cmd run lint
npm.cmd run build
```

The production build generates:

- `out/` — portable static website files.
- `dist/` — the hosting adapter and staged static files used by the current hosting workflow.

Both folders are generated and intentionally excluded from Git.

## Change workflow

1. The owner records requested changes in a GitHub Issue.
2. The developer creates a short-lived branch, implements the issue, and opens a pull request.
3. The owner reviews the wording and visual result.
4. The developer addresses feedback and merges the approved pull request into `main`.

Avoid making unreviewed changes directly on `main`.
