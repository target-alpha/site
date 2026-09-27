# Target Alpha CMS editor guide

Team members can update the live website from the hosted Sanity Studio without editing GitHub files or running local commands.

Studio: https://target-alpha.github.io/site/studio/

## Edit the homepage

Open **Homepage** in the left sidebar.

The Homepage document has two parts:

- **Hero** controls the opening statement, button, and three hero images.
- **Homepage sections** controls every section below the hero.

### Add a section

1. Open **Homepage sections**.
2. Select **Add item**.
3. Choose a section type.
4. Complete the fields.
5. Select **Publish**.

### Reorder sections

Drag a section by its handle to a new position in the list, then publish. The website uses the exact order shown in Sanity.

### Hide or remove a section

Turn off **Show this section** to hide a section while keeping its content. This is the safest option for temporary announcements and seasonal content.

Delete an item only when its content is no longer needed. Sanity keeps document history, but hiding is faster to reverse.

### Homepage section types

- **Event announcement** - A linked event bulletin with type, status, date, and location.
- **Statistics strip** - Displays documents from the Homepage statistic collection with an editable summary.
- **About section** - Heading, body, link, and founding year treatment.
- **Events overview** - Displays documents from the Event collection with editable introduction copy.
- **Chapter call to action** - Chapter promotion with an image, background statistic, copy, and button.
- **Flexible content section** - A reusable text, image, and button section with off-white, forest green, or sage green styling.

Use a Flexible content section when the team needs a new campaign, announcement, update, or informational section without developer help.

## Edit shared site content

Open **Site settings and page copy** to manage:

- Organization name and logo
- Social links
- Contact email addresses
- Newsletter heading and note
- Footer tagline
- Desktop, mobile, and footer navigation
- Copy for existing internal pages

Navigation items can be reordered. An item can link directly to a site path or contain submenu items.

## Edit the Sponsors page

1. Open [Sanity Studio](https://target-alpha.github.io/site/studio/) and sign in with your invited team account.
2. Select **Site settings and page copy**, then expand **Sponsors page** (the first field).
3. Edit **Page heading** and **Introduction** for the opening text.
4. Under **Additional information sections**, select **Add item** to add a heading and text about sponsor relationships, support, or impact. Separate paragraphs with a blank line. Drag sections to reorder; turn off **Show this section** to hide one.
5. Optionally edit **Sponsorship inquiry text** and **Sponsorship email**. An empty email uses the shared Partnerships contact address.
6. Select **Publish**.

To describe a specific sponsor, select **Sponsors — logos and relationships** in the sidebar, open the sponsor, and fill in **Relationship with Target Alpha**. This text appears below that sponsor’s logo. You can also edit their name, website, logo, and **Display order** (lower numbers appear first). Publish each sponsor you change.

Refresh [the Sponsors page](https://target-alpha.github.io/site/sponsors/) to see published changes. Saving a draft alone does not update the website. You do not need to edit GitHub or redeploy for these routine content changes.

These controls require the website and Studio version containing this feature to be deployed once. Existing sponsor records need no migration or reimport; the new descriptions are optional. Do not rerun the initial import to enable them, because it replaces existing documents.

## Edit collections

Use the collection entries in the sidebar for repeatable content:

- **Team** - National and regional team years and members
- **Event** - Competition details and links
- **Judge** - Judge profiles
- **News item** - Media coverage
- **Homepage statistic** - Homepage numbers
- **Sponsors — logos and relationships** - Sponsor logos, websites, and relationship descriptions
- **Academic partner** - Partner profiles and websites

Use the Display order field when a collection provides one. Lower numbers appear first.

## Images

Upload an image directly whenever possible. Add a clear image description for accessibility. Existing image URLs remain available for migrated content but new uploads are easier for future editors to manage.

## Publishing and recovery

- Changes remain drafts until **Publish** is selected.
- The live site reads newly published content when the page is refreshed.
- Routine content edits do not require a GitHub commit or deployment.
- Sanity document history can restore an earlier published version.
- Hide a section before deleting it when testing a page change.

## What still requires a developer

Editors can create new pages of homepage content using Flexible content sections. A completely new visual section type or a new routed website page still requires a matching schema and frontend renderer so design, accessibility, and responsive behavior remain controlled.
