"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Product } from "@/lib/shopify/types";
import { Badge } from "@/components/ui/badge";
import { useProductImages, useSelectedVariant } from "@/components/products/variant-selector";

interface MobileGallerySliderProps {
  product: Product;
}

export function MobileGallerySlider({ product }: MobileGallerySliderProps) {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    loop: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onInit = useCallback(() => {}, []);
  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-full">
      {/* Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${image.selectedOptions?.map((o) => `${o.name},${o.value}`).join("-")}`}
              className="flex-shrink-0 w-full h-full relative"
            >
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <Image
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                  src={image.url}
                  alt={image.altText}
                  width={image.width}
                  height={image.height}
                  className="w-full h-full object-cover"
                  quality={100}
                  priority={index === 0}
                />
                {/* Stalni "Preview" label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  Preview
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Counter Badge */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline-secondary">
            {selectedIndex + 1}/{images.length}
          </Badge>
        </div>
      )}
    </div>
  );
}
