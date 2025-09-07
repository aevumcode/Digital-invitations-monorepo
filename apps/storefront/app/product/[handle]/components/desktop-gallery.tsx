"use client";

import { useProductImages, useSelectedVariant } from "@/components/products/variant-selector";
import { Product } from "@/lib/shopify/types";
import Image from "next/image";

export const DesktopGallery = ({ product }: { product: Product }) => {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  return (
    <div className="flex flex-col gap-6 p-sides pb-sides">
      {images.map((image) => (
        <div
          key={`${image.url}-${image.selectedOptions?.map((o) => `${o.name},${o.value}`).join("-")}`}
          className="bg-muted rounded-lg p-4 flex items-center justify-center"
        >
          <Image
            style={{
              aspectRatio: `${image.width} / ${image.height}`,
            }}
            src={image.url}
            alt={image.altText}
            width={image.width}
            height={image.height}
            className="object-contain max-h-[80vh] w-auto rounded-md"
            quality={100}
          />
        </div>
      ))}
    </div>
  );
};
