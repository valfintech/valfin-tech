import type { FC } from "react";
import { Carousel } from "../../components/carousel/Slide";
import type { SlideProps } from "../../components/carousel/Slide";
import { Eyebrow, IconRow, IconCard, CTAFooter } from "../../components/carousel/visuals";
import { PhoneIcon, MessageIcon, FormIcon, ChatBubbleIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";

const SLIDES: SlideProps[] = [
  {
    index: 1,
    background: "photo",
    photoSrc: "carousel/PKG-013/cover.png",
    scrim: "heavy",
    align: "bottom",
    eyebrow: <Eyebrow text="MYTH" color={colors.error} />,
    headline: `"So... is this basically a chatbot?"`,
    headlineSize: 64,
    footerNote: "Swipe →",
  },
  {
    index: 2,
    eyebrow: <Eyebrow text="REALITY" color={colors.success} />,
    headline: "No. And the difference matters.",
    highlight: ["No"],
    headlineSize: 72,
  },
  {
    index: 3,
    eyebrow: <Eyebrow text="A CHATBOT" />,
    headline: "A little chat bubble on a website. It answers questions for people already on your page.",
    headlineSize: 52,
    visual: <IconCard icon={<ChatBubbleIcon size={80} />} />,
  },
  {
    index: 4,
    eyebrow: <Eyebrow text="THIS IS DIFFERENT" />,
    headline: "It catches phone calls.",
    highlight: ["phone", "calls"],
    headlineSize: 72,
    visual: <IconCard icon={<PhoneIcon size={80} />} />,
  },
  {
    index: 5,
    headline: "It catches texts. It catches form fills.",
    highlight: ["texts", "fills"],
    headlineSize: 64,
    visual: (
      <IconRow
        items={[
          { icon: <MessageIcon />, label: "Texts" },
          { icon: <FormIcon />, label: "Forms" },
        ]}
      />
    ),
  },
  {
    index: 6,
    eyebrow: <Eyebrow text="ALL CHANNELS" />,
    headline: "Even when nobody's near your website. It follows up for days, until they book or say no.",
    headlineSize: 48,
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
    index: 7,
    background: "photo",
    photoSrc: "carousel/PKG-013/slide7-support.png",
    scrim: "heavy",
    align: "bottom",
    headline: "It's not a chat bubble. It's your whole front desk.",
    highlight: ["front", "desk"],
    headlineSize: 56,
  },
  {
    index: 8,
    headline: "See how it works.",
    sub: "Link in bio.",
    cta: <CTAFooter label="Link in bio" />,
  },
];

export const PKG013: FC = () => <Carousel slides={SLIDES} />;
