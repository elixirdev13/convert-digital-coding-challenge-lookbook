# Lookbook Metaobject Schema

Lookbooks are modeled as a native Shopify **metaobject** so they can be managed
entirely from the Shopify admin with no third-party apps.

## Definition

- **Name:** Lookbook
- **Type (API id):** `lookbook`
- **Access:** Storefront **must** be enabled (Admin → Settings → Custom data →
  Metaobjects → Lookbook → *Storefront access*), so the entries and their fields
  are readable in Liquid and by the theme.

## Fields

| Field name  | API key       | Type                          | Notes                                                                 |
| ----------- | ------------- | ----------------------------- | --------------------------------------------------------------------- |
| Title       | `title`       | Single line text              | Display heading for the lookbook.                                     |
| Description | `description` | Multi-line text               | Optional supporting copy shown under the title.                       |
| Products    | `products`    | List of single line text      | **Product handles only.** One handle per list item (e.g. `linen-shirt`). |

> The spec requires the lookbook to "specify handles only". We deliberately store
> the `products` field as a **list of text handles** rather than product
> references. Product details (price, compare-at, image) are fetched at runtime
> via the Storefront API — nothing about the product is duplicated into the
> metaobject.

## Creating a lookbook entry

1. Admin → **Content → Metaobjects → Lookbook → Add entry**.
2. Fill in **Title** and **Description**.
3. Under **Products**, add one product **handle** per line.
4. Note the entry **handle** (e.g. `summer-2026`) — this is what the homepage
   section references.

## How membership is resolved on product pages

The product-page section iterates every `lookbook` entry and checks whether the
current product's handle is present in that entry's `products` list:

```liquid
{%- for lookbook in shop.metaobjects['lookbook'].values -%}
  {%- if lookbook.products.value contains product.handle -%}
    ...matched...
  {%- endif -%}
{%- endfor -%}
```

If a product belongs to three or more lookbooks, only the first two matches are
rendered.
