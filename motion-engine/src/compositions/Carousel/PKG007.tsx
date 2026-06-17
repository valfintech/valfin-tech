import type { FC } from "react";
import { Carousel } from "../../components/carousel/Slide";
import type { SlideProps } from "../../components/carousel/Slide";
import { Eyebrow, Checklist, CTAFooter } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";

const SLIDES: SlideProps[] = [
  {
    index: 1,
    background: "photo",
    photoSrc: "carousel/PKG-007/cover.png",
    scrim: "heavy",
    align: "bottom",
    eyebrow: <Eyebrow text="MYTH" color={colors.error} />,
    headline: `"I need more leads."`,
    headlineSize: 72,
    footerNote: "Swipe →",
  },
  {
    index: 2,
    eyebrow: <Eyebrow text="REALITY" color={colors.success} />,
    headline: "Most owners don't. They need to stop losing the leads they already have.",
    highlight: ["losing"],
    headlineSize: 52,
  },
  {
    index: 3,
    eyebrow: <Eyebrow text="GUT CHECK" />,
    headline: "How many leads from last month did you follow up with more than once?",
  },
  {
    index: 4,
    headline: "If you're like most of us: called once, heard nothing, moved on.",
    highlight: ["once", "nothing"],
  },
  {
    index: 5,
    headline: "Most people don't book on the first try.",
    highlight: ["first", "try"],
    headlineSize: 72,
  },
  {
    index: 6,
    eyebrow: <Eyebrow text="THE GAP" />,
    headline: "The jobs are sitting in the follow-up nobody does.",
    headlineSize: 52,
    visual: <Checklist items={["Second text", "Day-3 check-in", '"Still want that quote?"']} />,
  },
  {
    index: 7,
    headline: "Keep the leads you've got before you spend a dime buying more.",
    highlight: ["Keep"],
    headlineSize: 56,
  },
  {
    index: 8,
    headline: "See your number.",
    sub: "Link in bio.",
    cta: <CTAFooter label="Link in bio" />,
  },
];

export const PKG007: FC = () => <Carousel slides={SLIDES} />;
