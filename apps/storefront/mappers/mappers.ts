import { Category, InvitationTemplate } from "@prisma/client";
import type { Product, Collection, Image } from "@/lib/shopify/types";

export function adaptDbProductToShopify(product: any): Product {
  return {
    id: product.id,
    title: product.name,
    handle: product.slug,
    categoryId: product.categoryId || undefined,
    description: product.schemaJson?.description || product.description || "",
    descriptionHtml: product.schemaJson?.descriptionHtml || "",
    featuredImage: {
      url: product.previewUrl,
      altText: product.name,
      width: 800,
      height: 600,
    },
    currencyCode: "USD",
    priceRange: {
      minVariantPrice: {
        amount: (product.priceCents / 100).toFixed(2),
        currencyCode: "USD",
      },
      maxVariantPrice: {
        amount: (product.priceCents / 100).toFixed(2),
        currencyCode: "USD",
      },
    },
    compareAtPrice: undefined,
    seo: {
      title: product.name,
      description: product.schemaJson?.description || "",
    },
    options: [],
    tags: [],
    variants: [
      {
        id: product.id,
        title: product.name,
        availableForSale: true,
        selectedOptions: [],
        price: {
          amount: (product.priceCents / 100).toFixed(2),
          currencyCode: "USD",
        },
      },
    ],
    images: [
      {
        url: product.previewUrl,
        altText: product.name,
        width: 800,
        height: 600,
      },
    ],
    availableForSale: true,
  };
}

export function adaptTemplateToProduct(template: InvitationTemplate): Product {
  const image: Image = {
    url: template.previewUrl.startsWith("http")
      ? template.previewUrl
      : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${template.previewUrl}`,
    altText: template.name,
    height: 800,
    width: 800,
  };

  return {
    id: template.id,
    title: template.name,
    handle: template.slug,
    categoryId: template.categoryId || undefined,
    description: "",
    descriptionHtml: "",
    featuredImage: image,
    currencyCode: "USD",
    priceRange: {
      minVariantPrice: { amount: (template.priceCents / 100).toFixed(2), currencyCode: "USD" },
      maxVariantPrice: { amount: (template.priceCents / 100).toFixed(2), currencyCode: "USD" },
    },
    seo: { title: template.name, description: "" },
    options: [],
    tags: [],
    variants: [],
    images: [image],
    availableForSale: template.isActive,
  };
}

export function adaptCategoryToCollection(category: Category): Collection {
  return {
    handle: category.slug,
    title: category.name,
    description: category.description ?? "",
    seo: {
      title: category.name,
      description: category.description ?? "",
    },
    parentCategoryTree: [],
    updatedAt: category.updatedAt.toISOString(),
    path: `/categories/${category.slug}`,
  };
}
