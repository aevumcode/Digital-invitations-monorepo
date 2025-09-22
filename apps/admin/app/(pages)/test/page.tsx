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
      titleAlign: "left",
    },
    entrance: {
      type: "envelope2",
      props: {
        sealText: "DI",
        primary: "#f5f1e9",
        secondary: "#e8e4d9",
      },
    },
    sections: [
      // {
      //   type: "hero:cocktail",
      //   animation: "slideUp",
      //   props: {
      //     title: "Cocktail Party",
      //     subtitle: "You are Invited",
      //     date: "Feb 14, 2023",
      //     time: "7:00 PM",
      //     meetingLink: "https://example.com",
      //   },
      // {
      //   type: "hero:wedding:classic",
      //   animation: "fadeIn",
      //   props: {
      //     groom: "Jonathan",
      //     bride: "Juliana",
      //     date: "30th November 2025",
      //     time: "3:00 PM",
      //     venue: "Borcelle Hotel & Ballroom",
      //     address: "123 Anywhere Street, Any City",
      //     footer: "Reception to Follow",
      //   },
      // },
      // {
      //   type: "hero:wedding:floral",
      //   animation: "fadeIn",
      //   props: {
      //     groom: "Olivia",
      //     bride: "Alexander",
      //     date: "August 20th",
      //     time: "5:00 PM",
      //     venue: "Villa Dalmacija, Split",
      //     address: "Obala kneza Branimira, Split, Croatia",
      //   },
      // },
      // {
      //   type: "hero:wedding:elegant",
      //   animation: "fadeIn",
      //   props: {
      //     groom: "Olivia",
      //     bride: "Wilson",
      //     date: "27th August 2024",
      //     time: "2:00 PM",
      //     venue: "Hotel Name",
      //     address: "123 Anywhere St",
      //   },
      // },

      {
        type: "hero:wedding:branch",
        animation: "fadeIn",
        props: {
          groom: "Amelia",
          bride: "Oliver",
          date: "Saturday 16th November",
          time: "2:00 PM",
          venue: "123 Anywhere St., Any City",
          address: "Hotel Name",
          footer: "Reception to follow",
          rsvp: "+123-456-7890",
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
