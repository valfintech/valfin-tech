import type { FC } from "react";
import { Carousel } from "../../components/carousel/Slide";
import type { SlideProps } from "../../components/carousel/Slide";
import { Eyebrow, ComparisonBars, IconRow, Checklist, CTAFooter } from "../../components/carousel/visuals";
import { PhoneIcon, MessageIcon, CalendarIcon } from "../../components/carousel/icons";

const SLIDES: SlideProps[] = [
  {
    index: 1,
    background: "photo",
    photoSrc: "carousel/PKG-015/cover.png",
    scrim: "heavy",
    align: "bottom",
    headline: "Your customers can't tell how big you are.",
    headlineSize: 60,
    footerNote: "Swipe →",
  },
  {
    index: 2,
    headline: "They can only tell how fast and how organized you feel.",
    highlight: ["fast", "organized"],
    headlineSize: 56,
  },
  {
    index: 3,
    headline: "The 50-person company isn't better at the work than your 3-person crew.",
    headlineSize: 48,
    visual: (
      <ComparisonBars left={{ value: "50", label: "Big company" }} right={{ value: "3", label: "Your crew" }} />
    ),
  },
  {
    index: 4,
    eyebrow: <Eyebrow text="THE DIFFERENCE" />,
    headline: "They just have someone whose whole job is answering the phone and following up.",
    headlineSize: 48,
    visual: (
      <IconRow
        items={[
          { icon: <PhoneIcon />, label: "Answer" },
          { icon: <MessageIcon />, label: "Follow up" },
          { icon: <CalendarIcon />, label: "Confirm" },
        ]}
      />
    ),
  },
  {
    index: 5,
    headline: "What if you had that too, without hiring anyone?",
    highlight: ["without", "hiring", "anyone"],
    headlineSize: 56,
  },
  {
    index: 6,
    eyebrow: <Eyebrow text="AUTOMATICALLY" />,
    headline: "Every call answered. Every lead followed up. Every appointment confirmed.",
    headlineSize: 48,
    visual: <Checklist items={["Every call answered", "Every lead followed up", "Every appointment confirmed"]} />,
  },
  {
    index: 7,
    background: "photo",
    photoSrc: "carousel/PKG-015/slide7-support.png",
    scrim: "heavy",
    align: "bottom",
    headline: "You just show up and do great work.",
    sub: "Small crew. Big-company experience.",
    headlineSize: 56,
  },
  {
    index: 8,
    headline: "See how it works.",
    sub: "Link in bio.",
    cta: <CTAFooter label="Link in bio" />,
  },
];

export const PKG015: FC = () => <Carousel slides={SLIDES} />;
