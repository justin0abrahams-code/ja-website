# Owner Guide: Previewing and Reviewing the Website

This guide is for reviewing website changes on a Windows computer. You do not need to edit code or understand how the website is built.

## What you need once

Install these two applications:

1. [GitHub Desktop](https://desktop.github.com/download/) for downloading website updates.
2. The **LTS** version of [Node.js](https://nodejs.org/en/download) for running the website on your computer.

After installing Node.js, close and reopen GitHub Desktop and any PowerShell windows.

## First-time setup

### 1. Clone the repository

1. Open GitHub Desktop and sign in to the GitHub account that owns the repository.
2. Select **File > Clone repository**.
3. Select the **GitHub.com** tab.
4. Choose `ja-event-production`.
5. Choose a local folder that is easy to find.
6. Select **Clone**.

### 2. Open PowerShell in the project folder

1. In GitHub Desktop, select **Repository > Show in Explorer**.
2. Click the address bar at the top of File Explorer.
3. Type `powershell` and press Enter.

A blue or black PowerShell window should open in the project folder. Keep this window open while previewing the site.

### 3. Check Node.js

Run:

```powershell
node --version
npm.cmd --version
```

The Node.js version must be `20.9.0` or newer. If either command says it is not recognized, restart the computer. If it still fails, reinstall the LTS version of Node.js.

### 4. Create the local settings file

Run:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Enter the public business settings provided for the website:

```text
NEXT_PUBLIC_CONTACT_EMAIL=owner@example.com
NEXT_PUBLIC_QUOTE_FORM_ENDPOINT=
NEXT_PUBLIC_SITE_URL=
```

Replace `owner@example.com` with the real public contact email. Leave the form endpoint blank unless the developer has provided the hosted form URL. The production site URL may stay blank during local review.

Save the file and close Notepad.

Important:

- Do not paste passwords or API keys into this file.
- Do not upload or commit `.env.local` to GitHub.
- The quote form opens a prepared email when only the contact email is configured.
- The quote form sends data to the external service when a form endpoint is configured.

### 5. Install and start the website

Run:

```powershell
npm.cmd install
npm.cmd run dev
```

Wait until PowerShell displays a local address, normally:

```text
http://localhost:3000
```

Open that address in Chrome, Edge, or Firefox. Keep PowerShell open while reviewing.

### 6. Stop the website

Return to PowerShell and press:

```text
Ctrl+C
```

If PowerShell asks whether to terminate the job, type `Y` and press Enter.

## Preview future updates

Use these steps whenever the developer says an update is ready:

1. Open GitHub Desktop.
2. Make sure `ja-event-production` is the current repository.
3. Select the `main` branch from **Current branch**.
4. Select **Fetch origin**, then **Pull origin** if that button appears.
5. Select **Repository > Show in Explorer**.
6. Open PowerShell in the folder by typing `powershell` in the File Explorer address bar.
7. Run:

```powershell
npm.cmd install
npm.cmd run dev
```

8. Open the local address printed in PowerShell.

Running `npm.cmd install` again is safe. It makes sure the correct website packages are present after an update.

## Preview a proposed branch

The developer may ask you to review a change before it is merged:

1. In GitHub Desktop, select **Fetch origin**.
2. Open **Current branch**.
3. Search for and select the branch name supplied by the developer, such as `codex/update-homepage-copy`.
4. Start the website using the normal commands.
5. Submit feedback through the linked GitHub Issue or pull request.
6. When finished, stop the website and select `main` again from **Current branch**.

## Website review checklist

### Content and appearance

- [ ] The homepage clearly explains what the business rents and the North Georgia service area.
- [ ] Package names, descriptions, included equipment, and upgrades are accurate.
- [ ] No prices, dollar amounts, or “starting at” language appear anywhere.
- [ ] Business name, public email, spelling, capitalization, and punctuation are correct.
- [ ] Event photos are appropriate, clear, and cropped well.
- [ ] Text is readable and buttons are easy to recognize.

### Navigation and package flow

- [ ] Header and footer links work.
- [ ] Home, Packages, About, FAQ, and Quote pages open without an error.
- [ ] Each package card opens the correct package details.
- [ ] Selecting **Check Availability** from a package carries that package into the quote form.
- [ ] Back, refresh, and direct page links work normally.

### Quote form

- [ ] Required fields prevent an empty submission.
- [ ] Email addresses, dates, and guest counts accept sensible values.
- [ ] The selected package is correct.
- [ ] With email fallback configured, submitting opens a prepared email and does not send automatically.
- [ ] With a hosted endpoint configured, a clearly labeled test request reaches the correct destination.
- [ ] Test entries do not contain real customer information.

### Mobile review

- [ ] Narrow the browser window to roughly the width of a phone.
- [ ] Navigation remains usable.
- [ ] Text does not run off the screen.
- [ ] Package cards and form fields fit without horizontal scrolling.
- [ ] Buttons are easy to tap and important content is not hidden.

## Submit useful feedback

1. Open the repository on GitHub.
2. Select **Issues > New issue**.
3. Choose **Website change or feedback**.
4. Complete every field.
5. Drag a screenshot into the screenshot field when possible.
6. Submit the issue.

Use one issue for each distinct change. See [the completed feedback example](FEEDBACK_EXAMPLE.md) for the right level of detail.

Do not include customer contact information, passwords, API keys, or other private information in an issue.

## Troubleshooting

### `node` or `npm.cmd` is not recognized

Restart Windows after installing Node.js. If the problem remains, reinstall the LTS version from the official Node.js website.

### PowerShell says scripts are disabled

Use `npm.cmd` exactly as shown in this guide instead of `npm`.

### Port 3000 is already in use

The website may display another address such as `http://localhost:3001`. Open the exact address shown in PowerShell. Close older website PowerShell windows if they are no longer needed.

### The page did not update

Confirm GitHub Desktop shows **Last fetched just now**, pull any available changes, and restart `npm.cmd run dev`. In the browser, press `Ctrl+F5` for a full refresh.

### The quote button is disabled

Confirm `NEXT_PUBLIC_CONTACT_EMAIL` or `NEXT_PUBLIC_QUOTE_FORM_ENDPOINT` has a value in `.env.local`, then stop and restart the website.

### Installation or startup still fails

Take a screenshot of the full PowerShell window and open a GitHub Issue. Include the command you ran and what happened.
