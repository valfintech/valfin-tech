import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

/** Body/UI font — mirrors the site's `--font-sans` (Inter). */
export const { fontFamily: sansFont } = loadInter();

/** Display/heading font — mirrors the site's `--font-heading` (Space Grotesk). */
export const { fontFamily: headingFont } = loadSpaceGrotesk();
