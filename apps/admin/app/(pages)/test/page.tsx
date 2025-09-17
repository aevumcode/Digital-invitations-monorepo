import InvitationMain from "@/components/template-pages/invitation-main";
import type { InvitationConfig } from "@/components/template-pages/types";

const gallery = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
];

export default function TemplateTestPage({ params }: { params: { slug: string } }) {
  const cfg: InvitationConfig = {
    theme: {
      accentColor: "#6d28d9",
      headlineFont: "'Great Vibes', cursive",
      bodyFont: "Inter, ui-sans-serif, system-ui",
      rounded: "rounded-xl",
      titleAlign: "left", // global default title alignment
    },
    entrance: {
      type: "envelope",
      props: { sealText: "OA", primary: "#7c3aed", secondary: "#5b21b6" },
    },
    sections: [
      {
        type: "hero:cocktail",
        animation: "slideUp",
        props: {
          title: "Cocktail Party",
          subtitle: "You are Invited",
          date: "Feb 14, 2023",
          time: "7:00 PM",
          meetingLink: "https://example.com",
        },
      },
      {
        type: "location",
        animation: "fadeIn",
        background: { color: "#ffffff" },
        props: {
          title: "Our Day",
          description: "Here’s how the celebration will unfold",
          mapQuery: "Villa Dalmacija Split",
          placeLabel: "Villa Dalmacija, Split, Croatia",
          events: [
            { time: "17:00", title: "Catering", address: "Venue Garden, Main Street 12" },
            { time: "18:00", title: "Ceremony", address: "St. Mark's Church, Old Town" },
            { time: "20:00", title: "Reception", address: "Grand Ballroom, City Hotel" },
          ],
        },
      },

      {
        type: "gallery",
        animation: "zoomIn",
        background: { image: "/textures/gallery-bg.png", opacity: 0.9 },
        titleAlign: "left",
        props: {
          images: gallery,
          layout: "GridOne",
          description: "Jonathan & Juliana – join us for unforgettable moments by the sea ",
        },
      },
      {
        type: "rsvp",
        animation: "slideUp",
        background: { color: "#f9fafb" },
        props: { publicSlug: params.slug },
      },
    ],
  };

  return <InvitationMain config={cfg} />;
}
