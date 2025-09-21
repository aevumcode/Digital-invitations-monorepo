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
          <a
            href={image.url} // ili link na stranicu proizvoda
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-md overflow-hidden group"
          >
            <Image
              style={{
                aspectRatio: `${image.width} / ${image.height}`,
              }}
              src={image.url}
              alt={image.altText}
              width={image.width}
              height={image.height}
              className="object-contain max-h-[80vh] w-auto transition-transform duration-300 group-hover:scale-105"
              quality={100}
            />
            {/* Overlay s zatamnjenjem i tekstom */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-center justify-center text-white font-semibold text-lg group-hover:opacity-100">
              Preview
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
