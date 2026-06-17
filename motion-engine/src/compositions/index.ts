import type { ComponentType } from "react";
import { FORMATS, VIDEO_FPS } from "../config/constants";
import { TOTAL_DURATION } from "./VLF001/constants";
import { TOTAL_DURATION as VLF002_DURATION } from "./VLF002/constants";
import { TOTAL_DURATION as VLF003_DURATION } from "./VLF003/constants";
import { TOTAL_DURATION as VLF004_DURATION } from "./VLF004/constants";
import { TOTAL_DURATION as VLF005_DURATION } from "./VLF005/constants";
import { VLF001 } from "./VLF001";
import { VLF002 } from "./VLF002";
import { VLF003 } from "./VLF003";
import { VLF004 } from "./VLF004";
import { VLF005 } from "./VLF005";
import { PKG005 } from "./Carousel/PKG005";
import { PKG007 } from "./Carousel/PKG007";
import { PKG008 } from "./Carousel/PKG008";
import { PKG013 } from "./Carousel/PKG013";
import { PKG015 } from "./Carousel/PKG015";
import { HOOK01, TOTAL_DURATION as HOOK01_DURATION } from "./HOOK01";
import { HOOK02, TOTAL_DURATION as HOOK02_DURATION } from "./HOOK02";
import { HOOK03, TOTAL_DURATION as HOOK03_DURATION } from "./HOOK03";
import { REEL01, TOTAL_DURATION as REEL01_DURATION } from "./REEL01";
import { REEL02, TOTAL_DURATION as REEL02_DURATION } from "./REEL02";
import { REEL03, TOTAL_DURATION as REEL03_DURATION } from "./REEL03";

/**
 * Registry of all video templates available to the Motion Engine.
 *
 * To add a new template:
 * 1. Create a folder under `src/compositions/<TemplateName>/` with an
 *    `index.tsx` exporting the React component.
 * 2. Import it below and add an entry to `compositions`.
 *
 * `Root.tsx` renders this list automatically — no other wiring needed.
 */
export type CompositionConfig = {
  id: string;
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps?: Record<string, unknown>;
};

export const compositions: CompositionConfig[] = [
  {
    id: "VLF-001",
    component: VLF001,
    durationInFrames: TOTAL_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "VLF-002",
    component: VLF002,
    durationInFrames: VLF002_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "VLF-003",
    component: VLF003,
    durationInFrames: VLF003_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "VLF-004",
    component: VLF004,
    durationInFrames: VLF004_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "VLF-005",
    component: VLF005,
    durationInFrames: VLF005_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "PKG-005",
    component: PKG005,
    durationInFrames: 8,
    fps: VIDEO_FPS,
    width: FORMATS.carousel.width,
    height: FORMATS.carousel.height,
  },
  {
    id: "PKG-007",
    component: PKG007,
    durationInFrames: 8,
    fps: VIDEO_FPS,
    width: FORMATS.carousel.width,
    height: FORMATS.carousel.height,
  },
  {
    id: "PKG-008",
    component: PKG008,
    durationInFrames: 8,
    fps: VIDEO_FPS,
    width: FORMATS.carousel.width,
    height: FORMATS.carousel.height,
  },
  {
    id: "PKG-013",
    component: PKG013,
    durationInFrames: 8,
    fps: VIDEO_FPS,
    width: FORMATS.carousel.width,
    height: FORMATS.carousel.height,
  },
  {
    id: "PKG-015",
    component: PKG015,
    durationInFrames: 8,
    fps: VIDEO_FPS,
    width: FORMATS.carousel.width,
    height: FORMATS.carousel.height,
  },
  {
    id: "HOOK-01",
    component: HOOK01,
    durationInFrames: HOOK01_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "HOOK-02",
    component: HOOK02,
    durationInFrames: HOOK02_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "HOOK-03",
    component: HOOK03,
    durationInFrames: HOOK03_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "REEL-01",
    component: REEL01,
    durationInFrames: REEL01_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "REEL-02",
    component: REEL02,
    durationInFrames: REEL02_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
  {
    id: "REEL-03",
    component: REEL03,
    durationInFrames: REEL03_DURATION,
    fps: VIDEO_FPS,
    width: FORMATS.vertical.width,
    height: FORMATS.vertical.height,
  },
];
