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
| Products    | `products`    | Product (list of references)  | Merchant picks products from the built-in searchable picker.          |

> The `products` field is a **list of product references** so the merchant picks
> products from the native admin picker instead of typing handles (fewer typos,
> better UX). The theme still works with **handles only**: `lookbook-mount.liquid`
> resolves each reference down to its `handle` before handing data to the React
> app. Product details (price, compare-at, image) are fetched at runtime via the
> Storefront API — nothing about the product is duplicated into the metaobject.

## Creating a lookbook entry

1. Admin → **Content → Metaobjects → Lookbook → Add entry**.
2. Fill in **Title** and **Description**.
3. Under **Products**, use the product picker to add each product to the list.
4. On the home page, add the **Lookbook** section and select this entry from the
   native **Lookbook** metaobject picker (no need to type the handle).

## How membership is resolved on product pages

The product-page section iterates every `lookbook` entry and checks whether the
current product is present in that entry's `products` reference list:

```liquid
{%- for lookbook in shop.metaobjects['lookbook'].values -%}
  {%- for lb_product in lookbook.products.value -%}
    {%- if lb_product.handle == product.handle -%}
      ...matched...
    {%- endif -%}
  {%- endfor -%}
{%- endfor -%}
```

If a product belongs to three or more lookbooks, only the first two matches are
rendered.
