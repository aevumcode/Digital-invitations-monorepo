"use client";
import SectionReveal from "../animations/section-reveal";
import type { AnimationPreset, LocationProps } from "../types";
import { SectionTitle } from "../section-title";

export default function LocationSection({
  data,
  animation = "fadeIn",
  titleAlign = "center",
  description,
}: {
  data: LocationProps & { events?: { time: string; title: string; address: string }[] };
  animation?: AnimationPreset;
  titleAlign?: "left" | "center" | "right";
  description?: string;
}) {
  const height = data.height ?? 360;

  const alignmentClass =
    titleAlign === "left" ? "text-left" : titleAlign === "right" ? "text-right" : "text-center";

  return (
    <SectionReveal animation={animation} className="px-4 py-12 sm:px-8 lg:px-12">
      {/* Title */}
      <SectionTitle titleAlign={titleAlign}>{data.title ?? "Location"}</SectionTitle>

      {/* Optional description */}
      {description && (
        <p
          className={`mb-10 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto ${alignmentClass}`}
        >
          {description}
        </p>
      )}

      {/* Timeline events */}
      {data.events && (
        <div className="relative pl-8 sm:pl-10 mb-12 my-8 md:my-20">
          {/* vertical line */}
          <div className="absolute top-0 left-3 sm:left-4 h-full border-l-2 border-gray-200"></div>

          <div className="space-y-10">
            {data.events.map((event, index) => (
              <SectionReveal key={index} animation={animation}>
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  {/* dot */}
                  {/* <span className="absolute -left-[7px] sm:-left-[9px] top-1 w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow"></span> */}

                  {/* time */}
                  <div className="text-purple-700 font-semibold min-w-[70px] sm:text-right sm:pr-4">
                    {event.time}
                  </div>

                  {/* details */}
                  <div>
                    <p className="text-lg font-medium text-gray-900">{event.title}</p>
                    <p className="text-gray-500 text-sm sm:text-base">{event.address}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="overflow-hidden border border-gray-200 bg-white shadow rounded-xl">
        <iframe
          title="Map"
          src={`https://www.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&output=embed`}
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Label under map */}
      {data.placeLabel && (
        <p className="mt-4 text-center text-sm text-gray-600">{data.placeLabel}</p>
      )}
    </SectionReveal>
  );
}
