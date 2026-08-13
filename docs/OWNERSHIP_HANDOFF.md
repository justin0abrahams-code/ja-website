# Repository Ownership Handoff

The business owner should control the GitHub repository and the business accounts connected to the website. The developer should remain a collaborator who can create branches, open pull requests, and maintain the code.

## Before transferring the repository

The current repository owner should:

1. Finish or intentionally remove any uncommitted work.
2. Run:

   ```powershell
   npm.cmd run lint
   npm.cmd run build
   git status
   ```

3. Commit and push the approved static-site baseline.
4. Confirm the receiving GitHub account does not already have a repository named `ja-event-production`.
5. Record the accounts and responsibilities in the ownership table below.
6. Review GitHub's current [repository transfer documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository).

Do not transfer an unclear or partially pushed working state.

## Transfer the existing repository

Using a transfer preserves the commit history, issues, pull requests, and repository settings.

1. Open the repository on GitHub.
2. Select **Settings**.
3. On the **General** settings page, scroll to **Danger Zone**.
4. Select **Transfer ownership**.
5. Enter the owner's GitHub username as the new owner.
6. Enter `ja-event-production` when GitHub asks for confirmation.
7. Complete the transfer.
8. The new owner must accept GitHub's emailed invitation within 24 hours.

GitHub normally retains the original owner as a collaborator during a personal-account transfer. After acceptance, the new owner should still verify access under **Settings > Collaborators** and re-invite the developer if necessary.

Do not create a replacement repository at the old GitHub address. GitHub redirects the old address after a transfer, and recreating it can permanently remove that redirect.

## After the transfer

### Owner

1. Confirm the repository appears under the owner's account.
2. Confirm Issues and pull requests are available.
3. Confirm the developer is listed as a collaborator.
4. Clone the transferred repository by following the [owner testing guide](OWNER_TESTING.md).
5. Create a small test issue using the website feedback form.

### Developer

Update the existing local clone to use the new address:

```powershell
git remote set-url origin https://github.com/OWNER-USERNAME/ja-event-production.git
git remote -v
git fetch origin
```

Replace `OWNER-USERNAME` with the owner's actual GitHub username. Confirm fetch and push access before beginning another change.

## Ownership record

Complete this table during the handoff. Store passwords, recovery codes, API keys, and billing details in the owner's password manager—not in this repository.

| Asset | Account owner | Developer access | Where configuration lives | Handoff action |
| --- | --- | --- | --- | --- |
| GitHub repository | Owner GitHub: `__________` | Collaborator: `__________` | GitHub repository settings | Transfer and verify access |
| Website hosting | `__________` | `__________` | Hosting project settings | Confirm owner, billing, and deployment access |
| Domain and DNS | `__________` | `__________` | Domain registrar/DNS provider | Confirm renewal, recovery email, and DNS access |
| Public contact email | `__________` | Not required | `NEXT_PUBLIC_CONTACT_EMAIL` | Confirm address and response owner |
| Quote-form service | `__________` | `__________` | `NEXT_PUBLIC_QUOTE_FORM_ENDPOINT` | Confirm destination, spam controls, and notifications |
| Production site URL | `__________` | `__________` | `NEXT_PUBLIC_SITE_URL` | Confirm canonical HTTPS URL |

Repository transfer does not transfer ownership of hosting, the domain, email, or an external form service. Those accounts must be handed over separately.

## Normal change workflow

1. The owner creates a GitHub Issue describing one requested change.
2. The developer creates a branch such as `codex/update-package-copy`.
3. The developer implements the issue and runs lint and build checks.
4. The developer pushes the branch and opens a pull request linked to the issue.
5. The owner reviews the change locally or through an available preview.
6. The developer addresses feedback.
7. The approved pull request is merged into `main`.
8. The issue is closed after the production result is confirmed.

Changes should not be developed directly on `main`, and private customer information must not be placed in issues, commits, or pull requests.
