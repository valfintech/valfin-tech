# Valfin Motion Engine

Remotion + TypeScript foundation for programmatically generated video content
(social clips, ad creatives, branded templates).

## Setup

```bash
cd motion-engine
npm install
npm run studio
```

`npm run studio` opens the Remotion Studio preview in the browser.

## Folder structure

```
motion-engine/
├── src/
│   ├── index.ts            # Entry point — registers the root component
│   ├── Root.tsx             # Renders every composition from the registry
│   ├── compositions/        # One folder per video template
│   │   └── index.ts          # Registry — list every template here
│   ├── components/          # Shared visual building blocks (reused across templates)
│   └── config/
│       └── constants.ts      # Shared fps/format/dimension presets
├── public/                  # Static assets (fonts, images, audio) via staticFile()
├── out/                      # Rendered output (gitignored)
├── remotion.config.ts        # CLI/render defaults
└── tsconfig.json
```

## Rendering

Rendering uses Remotion's bundled renderer/Chromium — no system FFmpeg
required for the default codec.

```bash
# Preview & develop
npm run studio

# Render a composition to MP4
npm run render -- <composition-id> out/<name>.mp4

# Render a single still frame (e.g. thumbnail)
npm run still -- <composition-id> out/<name>.png
```

`<composition-id>` corresponds to the `id` field set when registering a
template in `src/compositions/index.ts`.

### Rendering VLF-001

```bash
npm run render -- VLF-001 out/vlf-001.mp4
```

32s @ 1080x1920 / 30fps.

## Templates

### VLF-001 — "They just call back faster"

`src/compositions/VLF001/` — motion-graphics Reel (no humans/avatars).
Six scenes, ~32s total at 1080x1920/30fps:

| Scene | File | Duration | Caption |
|---|---|---|---|
| 1. Hook | `Scene1Hook.tsx` | 5s | "They just call back faster." |
| 2. Lead drop | `Scene2LeadDrop.tsx` | 4s | "It wasn't your work." |
| 3. Phone UI | `Scene3PhoneUI.tsx` | 8s | "You meant to call back." |
| 4. Comparison | `Scene4Comparison.tsx` | 5s | "They booked the guy who answered." |
| 5. Recovery | `Scene5Recovery.tsx` | 6s | "Speed is fixable." |
| 6. End card | `Scene6EndCard.tsx` | 4s | "See what it's costing you" / valfintech.com/calculator |

Scene durations live in `src/compositions/VLF001/constants.ts`. Each scene
is wrapped in `<SceneFade>` for a soft crossfade-style cut between shots.

**Limitations / notes:**
- The recovered-revenue figure in Scene 5 is explicitly labeled
  "example: revenue recovered per month" — per the brand proof standard,
  this must stay a labeled hypothetical, not a claimed result, until real
  client numbers exist.
- Fonts (Inter, Space Grotesk) load via `@remotion/google-fonts`, which
  fetches from Google Fonts — an internet connection is required the
  first time Studio builds or a render runs.
- Not yet rendered to MP4 — Studio preview only. The host is on macOS 13,
  which Remotion flags as below the supported macOS 15 baseline for some
  rendering features; verify an actual render before relying on it.
- System FFmpeg is still missing (Homebrew install blocked earlier by a
  Bitbucket 503 on the `x265` dependency) — Remotion's bundled renderer
  should cover default MP4 rendering regardless.

## Adding a new template

1. Create `src/compositions/<TemplateName>/index.tsx` exporting a React
   component that renders the video.
2. Add an entry to the `compositions` array in `src/compositions/index.ts`
   with a unique `id`, the component, duration, fps, and dimensions
   (use the presets in `src/config/constants.ts` where possible).
3. The template automatically appears in Remotion Studio and becomes
   renderable via its `id` — no changes to `Root.tsx` are needed.

Shared pieces (text reveals, logo stings, lower thirds, color/theme tokens)
should live in `src/components/` so multiple templates can reuse them.
