// components/invitations/types.ts

export type Theme = {
  accentColor: string;
  headlineFont: string;
  bodyFont: string;
  rounded?: string;
  titleAlign?: "left" | "center" | "right";
};

export type AnimationPreset = "none" | "fadeIn" | "slideUp" | "slideInLeft" | "zoomIn";
export type GalleryLayout = "GridOne" | "Masonry" | "Rows";

// ----- section props
export type HeroProps = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  footer?: string;
  flowerSrc?: string;
};

export type LocationProps = {
  title?: string;
  mapQuery: string;
  placeLabel?: string;
  height?: number;
  description?: string;
  events?: { time: string; title: string; address: string }[];
};

export type GalleryProps = {
  images: string[];
  layout?: GalleryLayout;
  description?: string;
};

export type RsvpProps = {
  publicSlug: string;
  title?: string;
};

// ----- base type
export type SectionBase<P> = {
  id?: string;
  enabled?: boolean;
  animation?: AnimationPreset;
  layout?: string;
  background?: {
    color?: string;
    image?: string;
    opacity?: number;
  };
  titleAlign?: "left" | "center" | "right";
  props: P;
};

// ----- Section Types
export type SectionType = "hero" | `hero:${string}` | "location" | "gallery" | "rsvp";

export type SectionConfig =
  | (SectionBase<Record<string, unknown>> & { type: "hero" | `hero:${string}` })
  | (SectionBase<LocationProps> & { type: "location" })
  | (SectionBase<GalleryProps> & { type: "gallery" })
  | (SectionBase<RsvpProps> & { type: "rsvp" });

// ----- Invitation Config
export interface InvitationConfig {
  theme: Theme;
  entrance?: EntranceAnimationConfig;
  sections: SectionConfig[];
}

export type EntranceAnimationConfig =
  | { type: "none" }
  | {
      type: "envelope" | "envelope2";
      props?: {
        sealText?: string;
        primary?: string;
        secondary?: string;
      };
    };
