import HeroCard from "./hero-card"; // default fallback
import HeroCocktail from "../hero-sections/hero-cocktail"; // cocktail template

// wedding templates
import HeroWeddingClassic from "../hero-sections/weddings/hero-classic-wedding";
import HeroWeddingElegant from "../hero-sections/weddings/hero-elegant-wedding";
import HeroWeddingFloral from "../hero-sections/weddings/hero-floral-wedding";
import HeroWeddingBranch from "../hero-sections/weddings/hero-branch-wedding";

// birthday templates (kasnije možeš dodati ovdje)
// import HeroBirthday from "../hero-sections/hero-birthday";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const heroRegistry: Record<string, React.ComponentType<any>> = {
  default: HeroCard,
  cocktail: HeroCocktail,

  // wedding
  "wedding:classic": HeroWeddingClassic,
  "wedding:elegant": HeroWeddingElegant,
  "wedding:floral": HeroWeddingFloral,
  "wedding:branch": HeroWeddingBranch,

  // birthday
  // birthday: HeroBirthday,
};
