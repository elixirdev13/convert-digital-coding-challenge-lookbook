# Setup Guide

End-to-end steps to run the lookbook feature on a Shopify development store.

## 1. Prerequisites

- Node.js 18+ and npm
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (`npm i -g @shopify/cli @shopify/theme`)
- A Shopify development store on an Online Store 2.0 theme (this project uses a
  **Dawn-based** theme; the sections work on any OS 2.0 theme)

## 2. Configure markets (AUD + JPY)

1. Admin → **Settings → Markets**.
2. Create/confirm two markets, e.g. **Australia** (AUD) and **Japan** (JPY).
3. Under each market's **Products and pricing**, set price and **compare-at**
   overrides for the products you want to demo. This is what the storefront
   proves via `@inContext(country:)`.

## 3. Create the Lookbook metaobject

Follow [`metaobject-schema.md`](./metaobject-schema.md). Ensure **Storefront
access** is enabled on the definition, then create a few lookbook entries and
note their handles.

## 4. Create a public Storefront API token

1. Admin → **Settings → Apps and sales channels → Develop apps → Create an app**.
2. Under **Configuration → Storefront API**, enable at least:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory` (optional)
3. **Install** the app and copy the **Storefront API access token** (public).

> This token is public by design and safe to expose on the storefront. It is
> hardcoded in `theme/snippets/lookbook-mount.liquid` (not surfaced as a theme
> setting, so a merchant can't accidentally clear it). If you use a different
> store, replace the value there.

## 5. Build the React app

```bash
npm install
npm run build      # outputs theme/assets/lookbook.bundle.js + .css
# or, while developing:
npm run dev        # rebuilds on change
```

## 6. Push the theme and configure sections

```bash
npm run theme:dev  # shopify theme dev --path theme
```

In the theme editor:

- **Theme settings → Lookbook:** set the shared styling once (columns, show
  description, image aspect ratio, and typography). These apply to both the home
  page and product pages.
- **Home page:** add the **Lookbook** section and pick a lookbook from the native
  **Lookbook** metaobject picker.
- **Product page:** add the **Lookbook (product)** section. No lookbook picker —
  it auto-detects any lookbook the product belongs to.

## 7. Verify

- Home page renders the selected lookbook, with product prices in the active
  market's currency.
- Switch market/country (via the store's country selector) and confirm prices +
  compare-at values update (AUD ↔ JPY).
- A product that belongs to a lookbook shows it on the product page; a product in
  3+ lookbooks shows only 2.
