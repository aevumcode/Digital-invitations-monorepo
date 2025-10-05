import HeroCard from "./hero-card"; // default fallback
import HeroCocktail from "../hero-sections/events/hero-cocktail"; // cocktail template

// wedding templates
import HeroWeddingClassic from "../hero-sections/weddings/hero-classic-wedding";
import HeroWeddingElegant from "../hero-sections/weddings/hero-elegant-wedding";
import HeroWeddingFloral from "../hero-sections/weddings/hero-floral-wedding";
import HeroWeddingBranch from "../hero-sections/weddings/hero-branch-wedding";
import HeroEventPoster from "../hero-sections/events/hero-poster-event";
import HeroCocktailEvent2 from "../hero-sections/events/hero-cocktail-event-2";
import HeroEventRed from "../hero-sections/events/hero-red-event";
import HeroBirthdayThirty from "@/components/template-pages/hero-sections/birthdays/hero-birthday-thirty";
import HeroBirthdayCake from "../hero-sections/birthdays/hero-birthday-cake";
import HeroBirthdayArcane from "../hero-sections/birthdays/hero-birthday-arcane";
import HeroBirthdayFifa from "../hero-sections/birthdays/hero-birthday-fifa";
import HeroBirthdayFortnite from "../hero-sections/birthdays/hero-birthday-fortnite";

// import HeroBirthday from "../hero-sections/hero-birthday";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const heroRegistry: Record<string, React.ComponentType<any>> = {
  default: HeroCard,
  cocktail: HeroCocktail,

  // events
  "event:cocktail": HeroCocktail,
  "event:cocktail-2": HeroCocktailEvent2,
  "event:poster": HeroEventPoster,
  "event:retro": HeroEventRed,
  // "event:modern": HeroModernEvent,

  // wedding
  "wedding:classic": HeroWeddingClassic,
  "wedding:elegant": HeroWeddingElegant,
  "wedding:floral": HeroWeddingFloral,
  "wedding:branch": HeroWeddingBranch,

  // birthday
  "birthday:thirty": HeroBirthdayThirty,
  "birthday:cake": HeroBirthdayCake,
  "birthday:arcane": HeroBirthdayArcane,
  "birthday:fifa": HeroBirthdayFifa,
  "birthday:fortnite": HeroBirthdayFortnite,

  // birthday: HeroBirthday,
};
