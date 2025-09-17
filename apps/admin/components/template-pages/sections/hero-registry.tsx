import HeroCard from "./hero-card"; // default
import HeroCocktail from "../hero-sections/hero-cocktail"; // new cocktail style
// later: import HeroWedding from "./hero-wedding";
// later: import HeroBirthday from "./hero-birthday";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const heroRegistry: Record<string, React.ComponentType<any>> = {
  default: HeroCard,
  cocktail: HeroCocktail,
  // wedding: HeroWedding,
  // birthday: HeroBirthday,
};
