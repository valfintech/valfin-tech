import type { FC } from "react";
import { colors } from "../../config/colors";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const base = ({ size = 48, color = colors.accent400, strokeWidth = 2 }: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: color,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const PhoneIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const MessageIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const FormIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const CalendarIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const CheckIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

export const ChatBubbleIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <rect x="3" y="4" width="14" height="10" rx="3" />
    <path d="M7 18l3-4" />
  </svg>
);

export const ArrowRightIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const InboxIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M3 12l3-8h12l3 8" />
    <path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
    <path d="M3 12h5l2 3h4l2-3h5" />
  </svg>
);

export const ClockIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const XIcon: FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);
