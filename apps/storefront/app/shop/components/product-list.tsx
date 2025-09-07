// app/shop/components/product-list.tsx
import { getCollectionProducts, getCollections, getProducts } from "@/data-access/invitations";
import type { Product } from "@/lib/shopify/types";
import { ProductListContent } from "./product-list-content";
import { mapSortKeys } from "@/lib/shopify/utils";

interface ProductListProps {
  collection: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductList({ collection, searchParams }: ProductListProps) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : undefined;

  const { sortKey, reverse } = mapSortKeys(sort, "product");

  let products: Product[] = [];

  try {
    if (collection === "all" || collection === "root") {
      // 👇 Fetch everything
      products = await getProducts({ sortKey, query, reverse });
    } else {
      products = await getCollectionProducts({ collection, sortKey, query, reverse });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  const collections = await getCollections();

  return <ProductListContent products={products} collections={collections} />;
}
