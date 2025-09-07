import { prisma } from "../../../packages/db/src/index";
import { adaptCategoryToCollection, adaptTemplateToProduct } from "@/mappers/mappers";
import type { Collection, Product } from "@/lib/shopify/types";

// Fetch all categories
export async function getCollections(): Promise<Collection[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories.map(adaptCategoryToCollection);
  } catch (err) {
    console.error("Error fetching collections:", err);
    return [];
  }
}

export async function getCollection(slug: string): Promise<Collection | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) return null;
    return adaptCategoryToCollection(category);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

// Fetch all templates (root catalog = all products)
export async function getProducts(params: {
  limit?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  try {
    const templates = await prisma.invitationTemplate.findMany({
      where: {
        isActive: true,
        ...(params.query
          ? {
              name: { contains: params.query, mode: "insensitive" },
            }
          : {}),
      },
      take: params.limit,
      orderBy: mapSortKeyToPrisma(params.sortKey, params.reverse),
    });
    return templates.map(adaptTemplateToProduct);
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

// Fetch products for one category
export async function getCollectionProducts(params: {
  collection: string;
  limit?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  try {
    const templates = await prisma.invitationTemplate.findMany({
      where: {
        isActive: true,
        category: { slug: params.collection },
        ...(params.query
          ? {
              name: { contains: params.query, mode: "insensitive" },
            }
          : {}),
      },
      take: params.limit,
      orderBy: mapSortKeyToPrisma(params.sortKey, params.reverse),
    });
    return templates.map(adaptTemplateToProduct);
  } catch (err) {
    console.error("Error fetching collection products:", err);
    return [];
  }
}

import type { Prisma } from "@prisma/client";

function mapSortKeyToPrisma(
  sortKey?: string,
  reverse?: boolean,
): Prisma.InvitationTemplateOrderByWithRelationInput {
  if (!sortKey) return { createdAt: "desc" };

  switch (sortKey) {
    case "price-asc":
      return { priceCents: "asc" };
    case "price-desc":
      return { priceCents: "desc" };
    case "newest":
      return { createdAt: reverse ? "asc" : "desc" };
    case "oldest":
      return { createdAt: reverse ? "desc" : "asc" };
    default:
      return { createdAt: "desc" };
  }
}
