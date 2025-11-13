"use client";
import SectionReveal from "../animations/section-reveal";
import type { AnimationPreset, RsvpProps } from "../types";
import { useInvitationTheme } from "../theme";
import RsvpForm from "@/components/rsvp-form";
import { SectionTitle } from "../section-title";

export default function RsvpSection({
  data,
  animation = "slideUp",
  titleAlign = "center",
  mode,
}: {
  data: RsvpProps;
  animation?: AnimationPreset;
  titleAlign?: "left" | "center" | "right";
  mode?: "live" | "preview";
}) {
  const theme = useInvitationTheme();
  const alignmentClass =
    titleAlign === "left" ? "text-left" : titleAlign === "right" ? "text-right" : "text-center";

  return (
    <SectionReveal
      animation={animation}
      className={`px-4 pb-12 pt-16 sm:px-6 lg:px-8 ${alignmentClass}`}
    >
      <SectionTitle titleAlign={titleAlign}>{data.title ?? "Attendance"}</SectionTitle>
      {/* you can leave your existing <RsvpForm/> as-is; it will pick up global fonts.
          If you want the button to reflect the accentColor, add a tiny override: */}
      <div className="rsvp-accent">
        <RsvpForm mode={mode} publicSlug={data.publicSlug} />
      </div>
    </SectionReveal>
  );
}
