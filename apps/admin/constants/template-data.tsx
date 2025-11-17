/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  InvitationConfig,
  SectionBase,
  LocationProps,
  GalleryProps,
  RsvpProps,
} from "@/components/template-pages/types";
import { capitalizeWords } from "@/utils/capitalize-words";

// If your file doesn't export per-section types, create local, compatible shapes:
type LocationSection = SectionBase<LocationProps> & {
  type: "location";
  background?: { color?: string };
};

type GallerySection = SectionBase<GalleryProps> & {
  type: "gallery";
  titleAlign?: "left" | "center" | "right";
  background?: { image?: string; opacity?: number };
};

type RsvpSection = SectionBase<RsvpProps> & {
  type: "rsvp";
  background?: { color?: string };
};

/** FE-only type for hardcoded templates (do NOT confuse with DB TemplateLite) */
export type TemplateMetaFE = {
  /** Must match Template.id in DB/seed */
  id: number;
  slug: string;
  name: string;
  previewUrl: string;
  /** Builds a full InvitationConfig from user-provided (or default) data */
  buildConfig: (data: Record<string, any>) => InvitationConfig;
};

const defaultGallery = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
];

/* ------------------------- Optional section helpers ------------------------ */

function maybeLocation(data: Record<string, unknown>): LocationSection[] {
  if (data.disableLocation) return [];
  return [
    {
      type: "location",
      animation: (data.locationAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      background: { color: String(data.locationBg ?? "#ffffff") },
      props: {
        title: String(data.locationTitle ?? "Our Day"),
        description: String(data.locationDesc ?? "Here’s how the celebration will unfold"),
        mapQuery: String(
          data.mapQuery ?? `${data.venue ?? "Villa Dalmacija"} ${data.city ?? "Split"}`,
        ),
        placeLabel: String(
          data.placeLabel ??
            `${capitalizeWords(data.venue as string) ?? "Villa Dalmacija"}, ${capitalizeWords(data.city as string) ?? "Split"}`,
        ),
        events: (data.events as Array<{ time: string; title: string; address: string }>) ?? [
          { time: "17:00", title: "Catering", address: "Venue Garden, Main Street 12" },
          { time: "18:00", title: "Ceremony", address: "St. Mark's Church, Old Town" },
          { time: "20:00", title: "Reception", address: "Grand Ballroom, City Hotel" },
        ],
      },
    },
  ];
}

function maybeGallery(data: Record<string, unknown>): GallerySection[] {
  if (data.disableGallery) return [];
  const opacity = typeof data.galleryBgOpacity === "number" ? data.galleryBgOpacity : 0.9;

  const titleAlign = (data.galleryTitleAlign as "left" | "center" | "right" | undefined) ?? "left";

  return [
    {
      type: "gallery",
      animation: (data.galleryAnimation ??
        "zoomIn") as InvitationConfig["sections"][number]["animation"],
      background: {
        image: String(data.galleryBgImage ?? "/textures/gallery-bg.png"),
        opacity,
      },
      titleAlign,
      props: {
        images: (data.images as string[]) ?? defaultGallery,
        layout: "GridOne" as const,
        description: String(data.galleryDesc ?? "Join us for unforgettable moments by the sea"),
      },
    },
  ];
}

function rsvpSection(data: Record<string, unknown>): RsvpSection[] {
  return [
    {
      type: "rsvp",
      animation: (data.rsvpAnimation ??
        "slideUp") as InvitationConfig["sections"][number]["animation"],
      background: { color: String(data.rsvpBg ?? "#f9fafb") },
      // only rsvp supports publicSlug
      props: {
        publicSlug: String(data.publicKey ?? data.userTemplateKey ?? data.publicSlug ?? ""),
      },
    },
  ];
}

/* --------------------------------- Builders -------------------------------- */

const baseTheme = (
  data: Record<string, any>,
  overrides?: Partial<InvitationConfig["theme"]>,
): InvitationConfig["theme"] => ({
  accentColor: String(overrides?.accentColor ?? data.accentColor ?? "#6d28d9"),
  headlineFont: String(
    overrides?.headlineFont ?? data.headlineFont ?? "Inter, ui-sans-serif, system-ui",
  ),
  bodyFont: String(overrides?.bodyFont ?? data.bodyFont ?? "Inter, ui-sans-serif, system-ui"),
  rounded: String(overrides?.rounded ?? data.rounded ?? "rounded-xl"),
  titleAlign: (overrides?.titleAlign ?? data.titleAlign ?? "center") as "left" | "center" | "right",
});

const env2 = (seal = "DI", primary = "#f5f1e9", secondary = "#e8e4d9") => ({
  type: "envelope2" as const,
  props: { sealText: seal, primary, secondary },
});
const env1 = (seal = "EV", primary = "#111", secondary = "#222") => ({
  type: "envelope" as const,
  props: { sealText: seal, primary, secondary },
});

/* 1) hero:cocktail */
const buildCocktail = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data),
  entrance: data.entrance ?? env2("DI"),
  sections: [
    {
      type: "hero:cocktail",
      animation: (data.heroAnimation ??
        "slideUp") as InvitationConfig["sections"][number]["animation"],
      props: {
        title: String(data.title ?? "Cocktail Party"),
        subtitle: String(data.subtitle ?? "You are Invited"),
        date: String(data.date ?? "Feb 14, 2025"),
        time: String(data.time ?? "7:00 PM"),
        meetingLink: String(data.meetingLink ?? "https://example.com"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 2) hero:wedding:classic */
const buildWeddingClassic = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { headlineFont: "'Great Vibes', cursive" }),
  entrance: data.entrance ?? env2("DI"),
  sections: [
    {
      type: "hero:wedding:classic",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        groom: String(capitalizeWords(data.groomName) ?? "Jonathan"),
        bride: String(capitalizeWords(data.brideName) ?? "Juliana"),
        date: String(data.date ?? "30th November 2025"),
        time: String(data.time ?? "3:00 PM"),
        venue: String(data.venue ?? "Borcelle Hotel & Ballroom"),
        address: String(data.address ?? data.city ?? "123 Anywhere St, Any City"),
        footer: String(data.footer ?? "Reception to Follow"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 3) hero:wedding:floral */
const buildWeddingFloral = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { headlineFont: "'Great Vibes', cursive" }),
  entrance: data.entrance ?? env2("DI"),
  sections: [
    {
      type: "hero:wedding:floral",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        groom: String(capitalizeWords(data.groomName) ?? "Olivia"),
        bride: String(capitalizeWords(data.brideName) ?? "Alexander"),
        date: String(data.date ?? "August 20th"),
        time: String(data.time ?? "5:00 PM"),
        venue: String(data.venue ?? "Villa Dalmacija, Split"),
        address: String(data.address ?? "Obala kneza Branimira, Split, Croatia"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 4) hero:wedding:elegant */
const buildWeddingElegant = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, {
    accentColor: "#5b5b5b",
    headlineFont: "Playfair Display, serif",
    rounded: "rounded-lg",
  }),
  entrance: data.entrance ?? env1("WE", "#f3f3f3", "#e8e8e8"),
  sections: [
    {
      type: "hero:wedding:elegant",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        groom: String(capitalizeWords(data.groomName) ?? "Olivia"),
        bride: String(capitalizeWords(data.brideName) ?? "Wilson"),
        date: String(data.date ?? "27th August 2025"),
        time: String(data.time ?? "2:00 PM"),
        venue: String(data.venue ?? "Hotel Name"),
        address: String(data.address ?? "123 Anywhere St"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 5) hero:wedding:branch */
const buildWeddingBranch = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#2e7d32", headlineFont: "'Great Vibes', cursive" }),
  entrance: data.entrance ?? env2("WB", "#eef3e9", "#dfe8d6"),
  sections: [
    {
      type: "hero:wedding:branch",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        groom: String(capitalizeWords(data.groomName) ?? "Amelia"),
        bride: String(capitalizeWords(data.brideName) ?? "Oliver"),
        date: String(data.date ?? "Saturday 16th November"),
        time: String(data.time ?? "2:00 PM"),
        venue: String(data.venue ?? "123 Anywhere St., Any City"),
        address: String(data.address ?? "Hotel Name"),
        footer: String(data.footer ?? "Reception to follow"),
        rsvp: String(data.rsvp ?? "+123-456-7890"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 6) hero:event:poster */
const buildEventPoster = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#111827", headlineFont: "Oswald, sans-serif" }),
  entrance: data.entrance ?? env1("EV"),
  sections: [
    {
      type: "hero:event:poster",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        title: String(data.title ?? "GIGGLING PLATYPUS"),
        dateParts: data.dateParts ?? { month: "MAY", day: "18", year: "2025" },
        aboutTitle: String(data.aboutTitle ?? "ABOUT EVENT"),
        aboutText: String(
          data.aboutText ??
            "Sip on expertly crafted drinks, enjoy delightful company, and immerse yourself in an atmosphere of elegance and fun.",
        ),
        infoText: String(data.infoText ?? "FOR MORE INFORMATION: WWW.REALLYGREATSITE.COM"),
        illustration: String(data.illustration ?? "/events/poster/event-poster-bg-1.png"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 7) hero:event:cocktail-2 */
const buildEventCocktail2 = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#A855F7" }),
  entrance: data.entrance ?? env2("CP", "#141414", "#262626"),
  sections: [
    {
      type: "hero:event:cocktail-2",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        titleTop: String(data.titleTop ?? "COCKTAIL"),
        titleBottom: String(data.titleBottom ?? "PARTY"),
        date: String(data.date ?? "10/11"),
        time: String(data.time ?? "STARTING AT 9PM"),
        address: String(data.address ?? "123 ANYWHERE ST., ANY CITY, ST 12345"),
        background: String(data.background ?? "/events/background-images/event-bg-2.png"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 8) hero:event:retro */
const buildEventRetro = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, {
    accentColor: "#EAB308",
    headlineFont: "Bebas Neue, sans-serif",
    rounded: "rounded-md",
  }),
  entrance: data.entrance ?? env1("RT"),
  sections: [
    {
      type: "hero:event:retro",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        background: String(data.background ?? "/events/background-images/event-bg-3.png"),
        rsvpLine: String(data.rsvpLine ?? "RSVP TO +123-456-7890"),
        dateLine: String(data.dateLine ?? "25 OCTOBER 2025"),
        invitedLine: String(data.invitedLine ?? "(you are invited to)"),
        bigTitle: String(data.bigTitle ?? "COCKTAIL PARTY"),
        addressLine: String(data.addressLine ?? "123 Anywhere St., Any City, ST 12345"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 9) hero:birthday:thirty */
const buildBirthdayThirty = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#d946ef" }),
  entrance: data.entrance ?? env2("30", "#0f0f0f", "#1a1a1a"),
  sections: [
    {
      type: "hero:birthday:thirty",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        background: String(data.background ?? "/birthdays/birthday-bg-1.png"),
        subtitle: String(data.subtitle ?? "LET’S DRINK TO OLIVIA’S 30TH"),
        dateTime: String(data.dateTime ?? "MAY 25, 2028 AT 9:30 PM"),
        address: String(data.address ?? "123 ANYWHERE ST., ANY CITY"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 10) hero:birthday:cake */
const buildBirthdayCake = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#f97316" }),
  entrance: data.entrance ?? env1("CA", "#fff7ed", "#ffedd5"),
  sections: [
    {
      type: "hero:birthday:cake",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        background: String(data.background ?? "/birthdays/birthday-bg-cake-1.png"),
        name: String(data.name ?? "Harper Russo"),
        age: Number.isFinite(data.age) ? Number(data.age) : 18,
        subtitle: String(
          data.subtitle ?? "PLEASE JOIN US IN CELEBRATION OF HARPER’S 18TH BIRTHDAY",
        ),
        date: String(data.date ?? "01.30.2030"),
        address: String(data.address ?? "123 Anywhere St., Any City"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 11) hero:birthday:arcane */
const buildBirthdayArcane = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#a58324", headlineFont: "'Cinzel', serif" }),
  entrance: data.entrance ?? env1("BD"),
  sections: [
    {
      type: "hero:birthday:arcane",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        title: String(data.title ?? "Arcane Birthday"),
        subtitle: String(data.subtitle ?? "You are invited"),
        date: String(data.date ?? "Oct 25, 2025"),
        time: String(data.time ?? "9:30 PM"),
        venue: String(data.venue ?? "Zaun Lounge"),
        address: String(data.address ?? "123 Piltover Ave, Any City"),
        rsvp: String(data.rsvp ?? "RSVP: +123-456-7890"),
        videoSrc: String(data.videoSrc ?? "/videos/arcane-animation.mp4"),
        poster: String(data.poster ?? "/videos/birthday-image.webp"),
        duration: String(data.duration ?? "0:24"),
        ctaText: String(data.ctaText ?? "RSVP"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 12) hero:birthday:fifa */
const buildBirthdayFifa = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#22c55e" }),
  entrance: data.entrance ?? env2("EA", "#0b0b0b", "#1f2937"),
  sections: [
    {
      type: "hero:birthday:fifa",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        title: String(data.title ?? "EA Sports Birthday"),
        subtitle: String(data.subtitle ?? "Game On – You're Invited!"),
        date: String(data.date ?? "Nov 15, 2025"),
        time: String(data.time ?? "7:00 PM"),
        venue: String(data.venue ?? "Stadium Lounge"),
        address: String(data.address ?? "99 Goal Street, Any City"),
        rsvp: String(data.rsvp ?? "RSVP: +123-456-7890"),
        videoSrc: String(data.videoSrc ?? "/videos/fifa-edited-intro.mp4"),
        poster: String(data.poster ?? "/videos/fifa-birthday-poster.webp"),
        duration: String(data.duration ?? "0:45"),
        ctaText: String(data.ctaText ?? "Join the Match"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* 13) hero:birthday:fortnite */
const buildBirthdayFortnite = (data: Record<string, any>): InvitationConfig => ({
  theme: baseTheme(data, { accentColor: "#60a5fa" }),
  entrance: data.entrance ?? env2("FN", "#0b1020", "#101a33"),
  sections: [
    {
      type: "hero:birthday:fortnite",
      animation: (data.heroAnimation ??
        "fadeIn") as InvitationConfig["sections"][number]["animation"],
      props: {
        title: String(data.title ?? "Fortnite Birthday Royale"),
        subtitle: String(data.subtitle ?? "Drop In – You're Invited!"),
        date: String(data.date ?? "Dec 3, 2025"),
        time: String(data.time ?? "8:00 PM"),
        venue: String(data.venue ?? "Battle Bus Lounge"),
        address: String(data.address ?? "Victory Lane, Any City"),
        rsvp: String(data.rsvp ?? "RSVP: +123-456-7890"),
        videoSrc: String(data.videoSrc ?? "/videos/fortnite-edited-intro.mp4"),
        poster: String(data.poster ?? "/videos/fortnite-birthday.webp"),
        duration: String(data.duration ?? "0:35"),
        ctaText: String(data.ctaText ?? "Drop In"),
      },
    },
    ...maybeLocation(data),
    ...maybeGallery(data),
    ...rsvpSection(data),
  ],
});

/* --------------------------------- Registry -------------------------------- */

export const TEMPLATE_REGISTRY: TemplateMetaFE[] = [
  {
    id: 1,
    slug: "cocktail",
    name: "Cocktail Party",
    previewUrl: "/events/background-images/event-bg-2.png",
    buildConfig: buildCocktail,
  },
  {
    id: 2,
    slug: "wedding-classic",
    name: "Wedding Classic",
    previewUrl: "/templates/weddings/wedding-inv-1.png",
    buildConfig: buildWeddingClassic,
  },
  {
    id: 3,
    slug: "wedding-floral",
    name: "Wedding Floral",
    previewUrl: "/templates/weddings/wedding-inv-2.png",
    buildConfig: buildWeddingFloral,
  },
  {
    id: 4,
    slug: "wedding-elegant",
    name: "Wedding Elegant",
    previewUrl: "/templates/weddings/wedding-inv-3.png",
    buildConfig: buildWeddingElegant,
  },
  {
    id: 5,
    slug: "wedding-branch",
    name: "Wedding Branch",
    previewUrl: "/templates/weddings/wedding-inv-4.png",
    buildConfig: buildWeddingBranch,
  },
  {
    id: 6,
    slug: "event-poster",
    name: "Event Poster",
    previewUrl: "/events/poster/event-poster-bg-1.png",
    buildConfig: buildEventPoster,
  },
  {
    id: 7,
    slug: "event-cocktail-2",
    name: "Event Cocktail 2",
    previewUrl: "/events/background-images/event-bg-2.png",
    buildConfig: buildEventCocktail2,
  },
  {
    id: 8,
    slug: "event-retro",
    name: "Event Retro",
    previewUrl: "/events/background-images/event-bg-3.png",
    buildConfig: buildEventRetro,
  },
  {
    id: 9,
    slug: "birthday-thirty",
    name: "Birthday Thirty",
    previewUrl: "/birthdays/birthday-bg-1.png",
    buildConfig: buildBirthdayThirty,
  },
  {
    id: 10,
    slug: "birthday-cake",
    name: "Birthday Cake",
    previewUrl: "/birthdays/birthday-bg-cake-1.png",
    buildConfig: buildBirthdayCake,
  },
  {
    id: 11,
    slug: "birthday-arcane",
    name: "Birthday Arcane",
    previewUrl: "/videos/birthday-image.webp",
    buildConfig: buildBirthdayArcane,
  },
  {
    id: 12,
    slug: "birthday-fifa",
    name: "Birthday FIFA",
    previewUrl: "/videos/fifa-birthday-poster.webp",
    buildConfig: buildBirthdayFifa,
  },
  {
    id: 13,
    slug: "birthday-fortnite",
    name: "Birthday Fortnite",
    previewUrl: "/videos/fortnite-birthday.webp",
    buildConfig: buildBirthdayFortnite,
  },
];

export function getTemplateById(id: number): TemplateMetaFE | null {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) ?? null;
}
