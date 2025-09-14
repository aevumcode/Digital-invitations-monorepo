import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { formatPrice, cn } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { PageLayout } from "@/components/layout/page-layout";
import { SidebarLinks } from "@/components/layout/sidebar/product-sidebar-links";
import { AddToCart, AddToCartButton } from "@/components/cart/add-to-cart";
import Prose from "@/components/prose";
import { VariantSelectorSlots } from "./components/variant-selector-slots";
import { MobileGallerySlider } from "./components/mobile-gallery-slider";
import { DesktopGallery } from "./components/desktop-gallery";

import { products, collections } from "@/constants/templates";

// --- Metadata (optional)
export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const product = products.find((p) => p.handle === handle);

  if (!product) {
    return {
      title: "Product not found",
      description: "This product does not exist",
    };
  }

  return {
    title: product.title,
    description: product.description || "Invitation template",
    openGraph: product.featuredImage ? { images: [{ url: product.featuredImage.url }] } : undefined,
  };
}

// --- Product page
export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params;

  const product = products.find((p) => p.handle === handle);

  if (!product) {
    return <div className="p-8">Product not found.</div>;
  }

  const category = collections.find((c) => c.handle === product.categoryId);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const hasVariants = product.variants.length > 1;
  const hasEvenOptions = product.options.length % 2 === 0;

  return (
    <PageLayout className="bg-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-sides min-h-max">
        {/* Mobile Gallery */}
        <div className="md:hidden col-span-full h-[60vh] min-h-[400px]">
          <Suspense fallback={null}>
            <MobileGallerySlider product={product} />
          </Suspense>
        </div>

        {/* Left: Product Info */}
        <div className="flex sticky top-0 flex-col col-span-5 2xl:col-span-4 max-md:col-span-full md:h-screen min-h-max max-md:p-sides md:pl-sides md:pt-top-spacing max-md:static">
          <Breadcrumb className="col-span-full mb-4 md:mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/shop" prefetch>
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/shop/${category.handle}`} prefetch>
                        {category.title}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col col-span-full gap-4 md:mb-10 max-md:order-2">
            <div className="flex flex-col grid-cols-2 px-3 py-2 rounded-md bg-popover md:grid md:gap-x-4 md:gap-y-10 place-items-baseline">
              <h1 className="text-lg font-semibold lg:text-xl 2xl:text-2xl text-balance max-md:mb-4">
                {product.title}
              </h1>
              <p className="text-sm font-medium">{product.description}</p>
              <p className="flex gap-3 items-center text-lg font-semibold lg:text-xl 2xl:text-2xl max-md:mt-8">
                {formatPrice(product.priceRange.minVariantPrice.amount, product.currencyCode)}
                {product.compareAtPrice && (
                  <span className="line-through opacity-30">
                    {formatPrice(
                      product.compareAtPrice.amount,
                      product.compareAtPrice.currencyCode,
                    )}
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Suspense fallback={<VariantSelectorSlots product={product} />}>
                <VariantSelectorSlots product={product} />
              </Suspense>

              <Suspense
                fallback={
                  <AddToCartButton
                    className={cn("w-full", {
                      "col-span-full": !hasVariants || hasEvenOptions,
                    })}
                    product={product}
                    size="lg"
                  />
                }
              >
                <AddToCart
                  product={product}
                  size="lg"
                  className={cn("w-full", {
                    "col-span-full": !hasVariants || hasEvenOptions,
                  })}
                />
              </Suspense>
            </div>
          </div>

          <Prose
            className="col-span-full mb-auto opacity-70 max-md:order-3 max-md:my-6"
            html={product.descriptionHtml}
          />

          <SidebarLinks className="flex-col-reverse max-md:hidden py-sides w-full max-w-[408px] pr-sides" />
        </div>

        {/* Right: Desktop Gallery */}
        <div className="hidden overflow-y-auto relative col-span-7 col-start-6 w-full md:block">
          <Suspense fallback={null}>
            <DesktopGallery product={product} />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
