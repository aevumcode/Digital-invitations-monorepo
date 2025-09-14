import { collections, products } from "@/constants/templates";
import type { Collection, Product } from "@/lib/shopify/types";

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const collection = collections.find((c) => c.handle === handle);
  return collection ?? null;
}

export async function getProducts(params: { limit?: number; query?: string }): Promise<Product[]> {
  let result = products;

  if (params.query) {
    result = result.filter((p: Product) =>
      p.title.toLowerCase().includes(params.query!.toLowerCase()),
    );
  }

  if (params.limit) {
    result = result.slice(0, params.limit);
  }

  return result;
}

export async function getCollectionProducts(params: {
  collection: string;
  limit?: number;
}): Promise<Product[]> {
  let result = products.filter((p) => p.categoryId === params.collection);

  if (params.limit) {
    result = result.slice(0, params.limit);
  }

  return result;
}
