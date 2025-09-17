"use client";
import Image from "next/image";
import SectionReveal from "../animations/section-reveal";
import type { AnimationPreset, GalleryProps } from "../types";
import { SectionTitle } from "../section-title";

export default function GallerySection({
  data,
  animation = "zoomIn",
  titleAlign = "center",
  description,
}: {
  data: GalleryProps;
  animation?: AnimationPreset;
  titleAlign?: "left" | "center" | "right";
  description?: string;
}) {
  return (
    <SectionReveal animation={animation} className="px-4 py-12 sm:px-8 lg:px-12">
      <SectionTitle titleAlign={titleAlign}>Moments & Details</SectionTitle>
      <p
        className={`mb-8 text-gray-600 text-base sm:text-lg ${titleAlign === "left" ? "text-left" : titleAlign === "right" ? "text-right" : "text-center"}`}
      >
        {description}
      </p>
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        style={{ gridAutoRows: "140px" }}
      >
        {" "}
        {/* feature tile 2x2 if available */}
        {data.images[0] && (
          <div className="col-span-2 row-span-2 overflow-hidden rounded-xl">
            <div className="relative h-full w-full">
              <Image
                src={data.images[0]}
                alt="Gallery feature"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}
        {data.images.slice(1).map((src, i) => (
          <div key={i} className={`overflow-hidden rounded-xl ${i === 2 ? "col-span-2" : ""}`}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`Gallery ${i + 2}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
