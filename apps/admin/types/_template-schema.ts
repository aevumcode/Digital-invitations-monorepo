// lib/invite/types.ts
export type LayoutName =
  | "card.classic"
  | "gallery.mosaic"
  | "gallery.masonry"
  | "location.embed"
  | "rsvp.default";

export type AnimationName = "none" | "fadeUp" | "slideLeft" | "slideRight" | "scaleIn";

export type Theme = {
  accent: string; // e.g. "#7c3aed"
  text: string; // body text color
  paper?: string; // background (invitation paper)
  radius?: string; // css radius token (e.g. "16px")
  displayFont?: string; // CSS font-family for headlines
  bodyFont?: string; // CSS font-family for body
};

export type BaseSection = {
  id?: string;
  show?: boolean;
  className?: string;
  animation?: AnimationName;
};

export type CardSection = BaseSection & {
  kind: "card";
  layout?: Extract<LayoutName, "card.classic">;
  flowerImgUrl?: string; // optional overlays
  text: {
    groom: string;
    bride: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    footer?: string;
  };
};

export type LocationSection = BaseSection & {
  kind: "location";
  layout?: Extract<LayoutName, "location.embed">;
  mapSrc: string; // full google maps embed src
  caption?: string;
  height?: number; // px
};

export type GallerySection = BaseSection & {
  kind: "gallery";
  layout?: Extract<LayoutName, "gallery.mosaic" | "gallery.masonry">;
  images: string[];
};

export type RsvpSection = BaseSection & {
  kind: "rsvp";
  layout?: Extract<LayoutName, "rsvp.default">;
  publicSlug: string;
  title?: string;
};

export type Section = CardSection | LocationSection | GallerySection | RsvpSection;

export type EnvelopeIntroSettings = {
  enabled?: boolean;
  waxText?: string; // initials on the seal
  animation?: "envelope.classic"; // room to add more later
};

export type InvitationConfig = {
  theme: Theme;
  envelope?: EnvelopeIntroSettings;
  sections: Section[];
  pageBg?: string; // page gradient or color
};
