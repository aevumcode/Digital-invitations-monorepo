"use client";
import SectionReveal from "../animations/section-reveal";
import type { AnimationPreset, HeroProps } from "../types";
import { useInvitationTheme } from "../theme";

export default function HeroCard({
  data,
  animation = "fadeIn",
}: {
  data: HeroProps;
  animation?: AnimationPreset;
}) {
  const theme = useInvitationTheme();

  return (
    <SectionReveal animation={animation} className="px-4 sm:px-6 lg:px-8">
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('/textures/floral-only-transparent.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-6 max-w-2xl">
          {/* Names */}
          <h1
            className="text-5xl sm:text-6xl font-bold"
            style={{ fontFamily: theme.headlineFont, color: theme.accentColor }}
          >
            {data.groom}
          </h1>
          <p className="italic text-2xl text-gray-700">&</p>
          <h1
            className="text-5xl sm:text-6xl font-bold"
            style={{ fontFamily: theme.headlineFont, color: theme.accentColor }}
          >
            {data.bride}
          </h1>

          {/* Invitation line */}
          <p className="uppercase tracking-[0.25em] text-xs text-gray-600">
            Invite you to join in the celebration of their
          </p>

          {/* Wedding type */}
          <p className="text-3xl italic text-gray-800" style={{ fontFamily: theme.headlineFont }}>
            Wedding Party
          </p>

          {/* Date + Venue */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <p className="text-sm tracking-wider text-gray-700 uppercase">{data.venue}</p>
            <p className="text-lg font-semibold text-gray-900">{data.date}</p>
            <p className="text-lg font-semibold text-gray-900">{data.time}</p>
          </div>

          {/* Address */}
          <p className="text-sm text-gray-600">{data.address}</p>

          {/* Footer */}
          {data.footer && (
            <p
              className="mt-6 text-xl italic text-gray-700"
              style={{ fontFamily: theme.headlineFont }}
            >
              {data.footer}
            </p>
          )}
        </div>
      </section>
    </SectionReveal>
  );
}
