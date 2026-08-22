# Sanity CMS setup

The website can read all published content from a Sanity project while retaining the repository content as a safe fallback. Once configured, editors use the hosted Studio and do not edit JavaScript or run local commands.

## 1. Create the Sanity project

Create a project at https://www.sanity.io/manage and create a public dataset named `production`. Record the project ID shown in the Sanity project settings.

The published dataset must be public for the GitHub Pages build to read it without exposing a private token. Draft content remains protected by Sanity authentication.

## 2. Configure GitHub

In the GitHub repository, open **Settings > Secrets and variables > Actions > Variables** and add:

- `SANITY_PROJECT_ID` - the Sanity project ID
- `SANITY_DATASET` - `production`

The next GitHub Pages build will read published Sanity content and publish the Studio at:

https://sqhil-a.github.io/target-alpha-example/studio/

In Sanity project settings, add `https://sqhil-a.github.io` as an allowed CORS origin with credentials enabled. This lets authorized editors sign into the hosted Studio.

## 3. Import the current website once

Create a Sanity API token with Editor permission. Run this once from a trusted computer:

```bash
SANITY_PROJECT_ID=your-project-id \
SANITY_DATASET=production \
SANITY_WRITE_TOKEN=your-editor-token \
npm run sanity:import
```

Do not save the write token in the repository. Delete or revoke the temporary token after the import if it is no longer needed.

The import preserves current team years, profile paths, ordering, copy, image URLs, sponsors, partners, events, judges, news, and site settings. It can safely be rerun because it updates stable document IDs.

## 4. Publish edits

Open the hosted Studio, select an item, make the change, and press **Publish**. The live site reads the latest published content when a visitor loads the page, so routine content changes do not require a GitHub commit, deployment, or local command.

The GitHub build also embeds the latest CMS snapshot as a fallback. Optionally, configure a Sanity webhook that sends a GitHub `repository_dispatch` event named `sanity-content-update` after publishing. The Pages workflow already accepts that event and will refresh the embedded snapshot.

## Local Studio development

Copy `studio/.env.example` to `studio/.env`, fill in the project ID, then run:

```bash
npm install --prefix studio
npm run studio
```

Local Studio development is optional. Editors should normally use the hosted Studio.

## Fallback behavior

If Sanity is not configured, unavailable, or a CMS collection has not been populated, the site continues using its existing `src/content` data. During configured GitHub deployments, a Sanity connection error stops the deployment so older live content remains safely online.
