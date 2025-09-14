// app/shop/page.tsx
import ProductList from "./components/product-list";
import { Metadata } from "next";
import { Suspense } from "react";
import ResultsControls from "./components/results-controls";
import { ProductGrid } from "./components/product-grid";
import { ProductCardSkeleton } from "./components/product-card-skeleton";

export const metadata: Metadata = {
  title: "Digital invitations",
  description: "Digital invitations, Split, your one-stop shop for invitations for all your needs.",
};

export default async function Shop(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const defaultCollection = "all";

  return (
    <>
      <Suspense
        fallback={
          <>
            <ResultsControls className="max-md:hidden" collections={[]} products={[]} />
            <ProductGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </ProductGrid>
          </>
        }
      >
        <ProductList collection={defaultCollection} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
