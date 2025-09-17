"use client";
import * as React from "react";
import type { InvitationConfig, SectionConfig } from "./types";
import { InvitationThemeProvider } from "./theme";
import EnvelopeOpen from "./animations/envelope-open";
import LocationSection from "./sections/location-section";
import GallerySection from "./sections/gallery-section";
import RsvpSection from "./sections/rsvps-section";
import { heroRegistry } from "./sections/hero-registry";

type TitleAlign = "left" | "center" | "right";

type LocationSectionProps = React.ComponentProps<typeof LocationSection> & {
  titleAlign?: TitleAlign;
};

type GallerySectionProps = React.ComponentProps<typeof GallerySection> & {
  titleAlign?: TitleAlign;
};

type RsvpSectionProps = React.ComponentProps<typeof RsvpSection> & {
  titleAlign?: TitleAlign;
};

function withBackground(section: SectionConfig, content: React.ReactNode) {
  if (!section.background) return content;

  const { color, image, opacity = 1 } = section.background;

  const style: React.CSSProperties = {
    backgroundColor: color,
    backgroundImage: image ? `url(${image})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity,
  };

  return (
    <div style={style} className="w-full">
      {content}
    </div>
  );
}

function renderSection(section: SectionConfig, config: InvitationConfig) {
  if (section.enabled === false) return null;

  // Hero default
  if (section.type === "hero") {
    const HeroComponent = heroRegistry.default;
    return withBackground(
      section,
      <HeroComponent
        key={section.id ?? "hero"}
        data={section.props}
        animation={section.animation}
      />,
    );
  }

  // Hero:variant
  if (section.type.startsWith("hero:")) {
    const [, heroVariant] = section.type.split(":");
    const HeroComponent = heroRegistry[heroVariant] ?? heroRegistry.default;
    return withBackground(
      section,
      <HeroComponent key={section.id ?? section.type} {...section.props} />,
    );
  }

  // Other sections
  switch (section.type) {
    case "location":
      return withBackground(
        section,
        <LocationSection
          key={section.id ?? "location"}
          data={section.props}
          animation={section.animation}
          titleAlign={(section.titleAlign as TitleAlign) ?? config.theme.titleAlign}
        />,
      );
    case "gallery":
      return withBackground(
        section,
        <GallerySection
          key={section.id ?? "gallery"}
          data={section.props}
          description={section.props.description}
          animation={section.animation}
          titleAlign={(section.titleAlign as TitleAlign) ?? config.theme.titleAlign}
        />,
      );
    case "rsvp":
      return withBackground(
        section,
        <RsvpSection
          key={section.id ?? "rsvp"}
          data={section.props}
          animation={section.animation}
          titleAlign={(section.titleAlign as TitleAlign) ?? config.theme.titleAlign}
        />,
      );
    default:
      return null;
  }
}

export default function InvitationMain({ config }: { config: InvitationConfig }) {
  const [showContent, setShowContent] = React.useState(config.entrance?.type !== "envelope");

  return (
    <InvitationThemeProvider theme={config.theme}>
      <main className="min-h-screen w-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center">
        <div
          className={`mx-auto max-w-7xl lg:max-w-6xl xl:max-w-7xl ${
            showContent ? "py-6 sm:py-10" : "py-20"
          } px-4`}
        >
          {!showContent && config.entrance?.type === "envelope" && (
            <EnvelopeOpen
              onOpened={() => setShowContent(true)}
              sealText={config.entrance.props?.sealText}
              primary={config.entrance.props?.primary}
              secondary={config.entrance.props?.secondary}
            />
          )}
          {showContent && (
            <article
              className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg "
              style={{
                backgroundImage: "url('/textures/texture-paper.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                opacity: 0.95,
              }}
            >
              <div className="bg-transparent">
                {config.sections.map((section, index) => (
                  <div key={section.id ?? `${section.type}-${index}`}>
                    {renderSection(section, config)}
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      </main>
    </InvitationThemeProvider>
  );
}
