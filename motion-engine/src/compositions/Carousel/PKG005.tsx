import type { FC } from "react";
import { Carousel } from "../../components/carousel/Slide";
import type { SlideProps } from "../../components/carousel/Slide";
import { Eyebrow, IconRow, Timeline, IconCard, CTAFooter } from "../../components/carousel/visuals";
import { PhoneIcon, MessageIcon, FormIcon, ChatBubbleIcon, CalendarIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";

const SLIDES: SlideProps[] = [
  {
    index: 1,
    background: "photo",
    photoSrc: "carousel/PKG-005/cover.jpeg",
    scrim: "heavy",
    align: "bottom",
    headline: "What should happen in the 30 seconds after someone calls, even if you never touch your phone.",
    headlineSize: 56,
    footerNote: "Swipe →",
  },
  {
    index: 2,
    eyebrow: <Eyebrow text="THE GAP" color={colors.error} />,
    headline: `Most businesses' honest answer: "it depends on whether someone's free." That's where revenue leaks.`,
    highlight: ["revenue", "leaks"],
    headlineSize: 52,
  },
  {
    index: 3,
    eyebrow: <Eyebrow text="STEP 1" />,
    headline: "Caught. Call, text, or form. Nothing slips through.",
    highlight: ["Caught"],
    visual: (
      <IconRow
        items={[
          { icon: <PhoneIcon />, label: "Call" },
          { icon: <MessageIcon />, label: "Text" },
          { icon: <FormIcon />, label: "Form" },
        ]}
        toInbox
      />
    ),
  },
  {
    index: 4,
    eyebrow: <Eyebrow text="STEP 2" />,
    headline: "Replied. An automatic text goes out fast, so they hear back before they call the next business.",
    highlight: ["Replied"],
    visual: <IconCard icon={<ChatBubbleIcon size={80} />} />,
  },
  {
    index: 5,
    eyebrow: <Eyebrow text="STEP 3" />,
    headline: "Followed up. Day 1. Day 3. Day 7. Stops the moment they book or say no.",
    highlight: ["Followed"],
    visual: (
      <Timeline
        steps={[
          { label: "Day 1", active: true },
          { label: "Day 3" },
          { label: "Day 7" },
        ]}
      />
    ),
  },
  {
    index: 6,
    eyebrow: <Eyebrow text="STEP 4" />,
    headline: "Booked. The ready ones land on your calendar.",
    highlight: ["Booked"],
    visual: <IconCard icon={<CalendarIcon size={80} color={colors.success} />} />,
  },
  {
    index: 7,
    background: "photo",
    photoSrc: "carousel/PKG-005/slide7-support.png",
    scrim: "heavy",
    align: "bottom",
    headline: "All of it runs whether you're slammed or asleep.",
    headlineSize: 56,
  },
  {
    index: 8,
    headline: "See how it works.",
    sub: "Link in bio.",
    cta: <CTAFooter label="Link in bio" />,
  },
];

export const PKG005: FC = () => <Carousel slides={SLIDES} />;
