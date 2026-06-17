import type { FC } from "react";
import { Carousel } from "../../components/carousel/Slide";
import type { SlideProps } from "../../components/carousel/Slide";
import { Eyebrow, DotGrid, BigStat, CTAFooter } from "../../components/carousel/visuals";

const SLIDES: SlideProps[] = [
  {
    index: 1,
    background: "photo",
    photoSrc: "carousel/PKG-008/cover.png",
    scrim: "heavy",
    align: "bottom",
    headline: "Quick, honest math.",
    sub: "(Just an example.)",
    headlineSize: 64,
    footerNote: "Swipe →",
  },
  {
    index: 2,
    eyebrow: <Eyebrow text="THE SETUP" />,
    headline: "Say you miss 10 calls a month. Not unusual for a busy crew.",
    highlight: ["10"],
    visual: <DotGrid total={10} highlighted={10} />,
  },
  {
    index: 3,
    headline: "Maybe 3 of those 10 would've become a job.",
    highlight: ["3"],
    visual: <DotGrid total={10} highlighted={3} />,
  },
  {
    index: 4,
    headline: "Say a job is worth $2,000 to you.",
    highlight: ["$2,000"],
    visual: <BigStat value="$2,000" label="Per job" />,
  },
  {
    index: 5,
    eyebrow: <Eyebrow text="THE MATH (EXAMPLE)" />,
    headline: "3 jobs × $2,000 each.",
    visual: <BigStat value="$6,000" sublabel="walking out the door, every month (example)" />,
  },
  {
    index: 6,
    headline: "And that's before follow-up: the leads who needed a second nudge.",
    highlight: ["follow-up"],
    headlineSize: 52,
  },
  {
    index: 7,
    headline: "The point isn't our number. It's yours.",
    highlight: ["yours"],
    headlineSize: 64,
  },
  {
    index: 8,
    headline: "Run your real numbers.",
    sub: "Link in bio.",
    cta: <CTAFooter label="Link in bio" />,
  },
];

export const PKG008: FC = () => <Carousel slides={SLIDES} />;
