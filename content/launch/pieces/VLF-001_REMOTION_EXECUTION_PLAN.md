# VLF-001 — Remotion Execution Plan ("They Just Call Back Faster")

**Source:** [`LAUNCH-01_they-just-call-back-faster.md`](LAUNCH-01_they-just-call-back-faster.md) — copy, script, captions, CTA, hashtags, and posting time are unchanged from this source and from the original execution.
**Engine:** `motion-engine/` (Remotion), composition `VLF-001` at `motion-engine/src/compositions/VLF001/`.
**Status:** Rebuilt under the "Creative Direction Revision — Effective Immediately" (2026-06-13). Same script, structure, runtime (34s), and story order as the original build — **visual execution and pacing only** have changed.

---

## 0. What changed in this revision

Per the revised creative direction, this is a **motion-design-first** rebuild, not a new edit:

- **No AI-generated humans anywhere.** Both Higgsfield clips that previously showed people (a contractor on a rooftop, a business owner on a call) were replaced with **premium object/environment shots** — a smartphone lighting up with a notification, and a calm desk/calendar/notepad scene. No faces, no talking heads, no human avatars.
- **Remotion is now the dominant visual engine.** The emotional "turning point" beat — previously a full-bleed Higgsfield video of a person — is now a Remotion-built "Appointment booked" notification card (spring-animated success checkmark), mirroring Scene 2's "Missed" stamp. The Higgsfield desk clip is just a muted, scrim-darkened backdrop behind it.
- **Pacing tightened** across the board (global transitions, kinetic-type stagger, hook crossfade timing) without changing any `SCENE_DURATIONS` — runtime stays exactly 1020 frames / 34s, story order unchanged.
- **Premium instrumental music bed + UI sound design added** (no AI voiceover/narration) — riser, whooshes, notification dings, and confirm chimes synced to on-screen motion beats.
- Script, caption, hashtags, CTA, hook copy, posting recommendation, and launch sequencing are **all unchanged** from the original execution (Section 8 below is identical to the prior version).

## 1. Higgsfield scene allocation (revised — objects/environments only)

Higgsfield is still used in exactly two places, but both are now **object-based, people-free** shots:

| Slot | Scene | Frames | Time | Role |
|---|---|---|---|---|
| Open | Scene 1 — Hook | 0–35 (full opacity), crossfades out over 35–60 | 0:00–0:02 | Cinematic cold-open: a smartphone lighting up with a notification, fast push-in, dissolving early into the brand gradient + kinetic type for "They just call back faster." — the pattern-interrupt now lands inside the first 2 seconds |
| Turning point | `SceneTurningPoint` | 510–570 | 0:17–0:19 | A calm desk/calendar/notepad/phone environment shot sits as a darkened backdrop behind a Remotion "Appointment booked" notification card with a spring-animated checkmark — the success mirror of Scene 2's "Missed" stamp |

Both clips are muted, full-bleed background video with a dark ink scrim for legibility/contrast — same compositing approach as before, new source footage.

## 2. Exact Higgsfield prompts (as generated, this revision)

**Hook source still — `nano_banana_2`, 9:16:**
> Photorealistic vertical 9:16 photo of a smartphone lying on a dark surface lighting up with a notification glow, premium product-commercial aesthetic, no people, no text overlays, no logos.

**Hook video, `cinematic_studio_3_0`, 9:16, 4s:**
> Subtle cinematic push-in on a smartphone lighting up with a notification glow on a dark surface, soft light bloom, slow and confident motion, premium product-commercial aesthetic, no people, no text, no logos

**Turning-point source still — `nano_banana_2`, 9:16:**
> Photorealistic vertical 9:16 photo of a clean modern office desk with a calendar, notepad, and smartphone, soft natural light, premium product-commercial aesthetic, no people, no text overlays, no logos.

**Turning-point video, `cinematic_studio_video`, 9:16, 5s, sound=false:**
> Slow cinematic push-in over a clean modern office desk with a calendar, notepad, and smartphone, soft natural light shifting gently, calm and confident motion, premium product-commercial aesthetic, no people, no text, no logos

All four jobs completed successfully. Negative guidance applied throughout: no people, no robots, no glowing screens/holograms, no futuristic "AI" aesthetics, no neon, no on-image text/watermarks — consistent with `docs/CONTENT_BRAND_GUIDELINES.md` and the revised "no AI-generated humans" constraint.

The old human-based clips (`vlf001-hook.mp4`, `vlf001-turning-point.mp4`) were deleted from `public/higgsfield/` and replaced with `vlf001-hook-phone.mp4` and `vlf001-turning-point-desk.mp4`.

## 3. Model recommendations + actual costs (this revision)

| Asset | Model | Params | Cost |
|---|---|---|---|
| Hook source still | `nano_banana_2` (resolves to `nano_banana_flash`) | 9:16, 1k | 1 credit |
| Hook video | `cinematic_studio_3_0` | 9:16, duration 4s | 20 credits |
| Turning-point source still | `nano_banana_2` | 9:16, 1k | 1 credit |
| Turning-point video | `cinematic_studio_video` | 9:16, duration 5s, sound=false | 5 credits |
| Music bed | `sonilo_music` | 34s, premium/Apple-keynote style | 2 credits |
| SFX ×4 (notification, whoosh, riser, confirm) | `mirelo_text_to_audio` | ~1–2s each | 4 credits |
| **Total** | | | **33 credits** |

Both video models still output 768×1344 (~720p exact 9:16); Remotion upscales ~1.4× into the 1080×1920 timeline — unchanged from the prior approach, no `upscale_video` spend.

## 4. Remotion scene allocation (durations unchanged — pacing/visuals only)

`motion-engine/src/compositions/VLF001/constants.ts` — total runtime remains **1020 frames = 34s @ 30fps**, story order unchanged:

| Scene | Component | Duration | Time | Copy | What changed visually |
|---|---|---|---|---|---|
| 1 | `Scene1Hook` | 150f (5s) | 0:00–0:05 | "They just call back faster." | New object-based Higgsfield video (phone notification glow), hold compressed to 35f + 25f crossfade (was 90f+30f), push-in scale 1→1.12, kinetic-type delay tightened |
| 2 | `Scene2LeadDrop` | 120f (4s) | 0:05–0:09 | "It wasn't your work." | Unchanged animation; inherits global pacing/depth updates |
| 3 | `Scene3PhoneUI` | 240f (8s) | 0:09–0:17 | "You meant to call back." | Unchanged — remains the energy/sophistication reference point |
| 4 | `SceneTurningPoint` | 60f (2s) | 0:17–0:19 | "They booked the guy who answered." | **Rebuilt**: Higgsfield desk clip as a darkened backdrop behind a new Remotion "Appointment booked" card with spring-animated checkmark badge |
| 5 | `Scene4Comparison` | 150f (5s) | 0:19–0:24 | "They booked the guy who answered." | Unchanged; inherits global pacing/depth updates |
| 6 | `Scene5Recovery` | 180f (6s) | 0:24–0:30 | "Speed is fixable." | Unchanged; inherits global pacing/depth updates |
| 7 | `Scene6EndCard` | 120f (4s) | 0:30–0:34 | CTA — "See what it's costing you" / valfintech.com/calculator | Unchanged; inherits global pacing/depth updates |

### Shared component changes (apply across all scenes)

- **`SceneFade`** — crossfade window shortened from 12 → 8 frames for snappier cuts between scenes.
- **`KineticText`** — word-reveal `STAGGER` shortened from 4 → 3 frames; spring config tightened (`stiffness` 200 → 260, `mass` 0.6 → 0.5) for a snappier pop-in.
- **`GradientBackground`** — added layered parallax/depth: the background grid and accent glow now drift and scale at slightly different rates over the first 240 frames (grid 1→1.025×, glow 1→1.08× with a -16px drift), giving a subtle 3D dolly feel ("elegant depth") with no change to color or layout.

## 5. Final assembly sequence

`motion-engine/src/compositions/VLF001/index.tsx` maps `SCENE_DURATIONS` to `<Sequence>` blocks in order (unchanged order), each wrapped in `SceneFade` (now 8-frame in/out):

```
Scene1Hook → Scene2LeadDrop → Scene3PhoneUI → SceneTurningPoint → Scene4Comparison → Scene5Recovery → Scene6EndCard
```

- **Scene1Hook** composites `public/higgsfield/vlf001-hook-phone.mp4` full-bleed, held at full opacity for 35 frames (~1.2s) with a fast push-in (scale 1→1.12), then crossfades to `GradientBackground` over the next 25 frames while the kinetic-type line "They just call back faster." reveals — the cinematic-object-to-kinetic-type pattern interrupt now completes inside the first 2 seconds.
- **SceneTurningPoint** composites `public/higgsfield/vlf001-turning-point-desk.mp4` full-bleed, muted, under a dark ink scrim, with a spring-scaled "Appointment booked" notification card (success-green checkmark badge, "Today · 2:14 PM") centered on top — the Remotion-built emotional payoff that mirrors Scene 2's "Missed" stamp. Retains the `Caption` "They booked the guy who answered."
- All other scenes remain unchanged Remotion typography/graphics (`GradientBackground`, `KineticText`, `ComparisonColumn`, `PipelineStages`, `RevenueCounter`, `Caption`), now inheriting the tightened `SceneFade`/`KineticText`/`GradientBackground` pacing.

## 6. Audio implementation (new this revision)

No AI voiceover or narration — the reel is scored entirely with a premium instrumental bed plus UI sound-design accents, added directly in `motion-engine/src/compositions/VLF001/index.tsx`:

- **Music bed** — `public/audio/music-bed.m4a` (34s, `sonilo_music`, Apple-keynote-style premium/confident instrumental). Plays under the full timeline via `<Audio>` with a volume envelope: fades in over the first 20 frames, holds at 0.45, fades out over the last 25 frames.
- **SFX accents** — four short clips from `mirelo_text_to_audio` (`sfx-riser.mp3`, `sfx-whoosh.mp3`, `sfx-notification.mp3`, `sfx-confirm.mp3`), each placed as its own `<Sequence>` + `<Audio>`:

| Frame | SFX | Beat |
|---|---|---|
| 0 (60f) | Riser | Builds across the hook's video hold into the pattern-interrupt cut |
| 33 (30f) | Whoosh | The hook's object-shot → kinetic-type cut |
| 208 (31f) | Notification (soft) | Scene 2's "Missed" stamp lands |
| 300, 365, 430 (31f each) | Notification | Each missed-call card arriving in Scene 3's phone UI |
| 510 (30f) | Whoosh | Transition into `SceneTurningPoint` |
| 518 (31f) | Confirm | "Appointment booked" checkmark badge pops in |
| 570 (30f) | Whoosh | Transition into Scene 4 (comparison) |
| 900 (30f) | Whoosh | Transition into the CTA end card |
| 916 (31f) | Confirm | CTA link reveal |

## 7. Render workflow (updated — audio codec resolved, Instagram-compatible)

From `motion-engine/`:

```bash
# 1. Higgsfield + audio assets already in place:
#    public/higgsfield/vlf001-hook-phone.mp4
#    public/higgsfield/vlf001-turning-point-desk.mp4
#    public/audio/music-bed.m4a, sfx-riser.mp3, sfx-whoosh.mp3,
#                  sfx-notification.mp3, sfx-confirm.mp3

# 2. Render the full video (with audio)
npx remotion render VLF-001 out/vlf-001-raw.mp4 --binaries-directory="$(pwd)/.remotion-bin" --audio-codec=mp3

# 3. Re-encode audio to AAC for broad playback/Instagram compatibility
#    (video stream is copied untouched — no visual re-render)
ffmpeg -i out/vlf-001-raw.mp4 -c:v copy -c:a aac -b:a 192k -movflags +faststart out/vlf-001.mp4

# 4. Render the cover still at frame 30 (NOT frame 0 — see note below)
npx remotion still VLF-001 out/vlf-001-cover.png --frame=30 --binaries-directory="$(pwd)/.remotion-bin"
```

**Environment note (macOS 13 compositor workaround, unchanged from prior build):**
1. `ffmpeg`/`ffprobe` installed via Homebrew (`brew install ffmpeg`), symlinked into `motion-engine/.remotion-bin/` alongside the bundled `remotion` compositor binary + `.dylib`s.
2. The composition carries an audio track, so `--muted` is not used. Remotion's default `aac` audio codec maps to `libfdk_aac`, which Homebrew ffmpeg doesn't ship — fails with `Unknown encoder 'libfdk_aac'`. Worked around by rendering with `--audio-codec=mp3` first.
3. **Final quality pass fix:** MP3 audio inside an MP4 container is non-standard and is silently dropped/muted by several players and by Instagram's ingest — this was the cause of "no audible sound" on the prior export, even though the MP3 audio stream itself was present and correctly mixed (music bed + all SFX, verified via `volumedetect`/`silencedetect`: mean -19dB, peak -3.2dB, zero silence gaps >0.5s). Fixed by re-encoding just the audio stream to **AAC** (native `aac` encoder, available in Homebrew ffmpeg 8.1.1 — `libfdk_aac` is not required for encoding, only Remotion's internal codec map insists on it) while copying the video stream bit-for-bit. No visual frames were re-rendered.

**Cover frame fix:** frame 0 of `Scene1Hook` rendered as solid black — the `<Video>` element's first decoded frame at `currentTime=0` is black before the notification-glow clip's first visible content. Replaced with **frame 30** (1.0s in), which shows the phone-notification object shot at full opacity with the kinetic-type hook line "They just call back faster." already animating in — communicates the hook, the premium object-based aesthetic, and the kinetic-typography identity in one frame.

**Confirmed final output:** `out/vlf-001.mp4` — H.264 video (1080×1920, 30fps, untouched) + AAC audio (48kHz stereo, 192kbps), 34.01s, 7.9 MB. `out/vlf-001-cover.png` — frame 30, phone notification + kinetic-type reveal, 1080×1920.

If rendering on a different machine (macOS 15+), `npx remotion render VLF-001 out/vlf-001.mp4` (default `aac` audio) should produce a directly-correct file, skipping step 3.

## 8. Final deliverables to publish (unchanged from original — script/caption/CTA untouched)

| Item | Value |
|---|---|
| **MP4** | `motion-engine/out/vlf-001.mp4` (1080×1920, 34s, 30fps, H.264 + AAC audio — music + SFX, verified audible) |
| **Cover** | `motion-engine/out/vlf-001-cover.png` (frame 30 — phone-notification hook shot with kinetic-type reveal already visible) |
| **Caption** | "Your competitors aren't better than you. They just call back faster.\n\nThink about the last job that slipped away. Odds are it had nothing to do with your work. Someone called while you were on a roof or driving to the next job, you meant to get back to them, and by the time you did they'd already booked whoever picked up first.\n\nThat's not a knock on your skill. It's a speed problem — and speed is the one part of this you can actually fix. Every call, text, and form answered in seconds, even when both your hands are full.\n\nWant to see what those missed callbacks are quietly costing you? It takes about a minute. Link in bio." |
| **Hashtags** | `#smallbusiness #localbusiness #homeservices #contractorlife #roofing #hvac #plumbing #smallbusinesstips` |
| **Pinned comment** | "Be honest — how long does it usually take you to call a new lead back? Drop a number 👇 (no judgment, we've all been the slow one)." |
| **CTA** | "I'll show you what that's costing you. Link's in the bio." → `valfintech.com/calculator` |
| **Recommended posting time** | Tuesday, 7:15 AM ET — pin as the account anchor post |

> Run [`CONTENT_APPROVAL_CHECKLIST.md`](../../checklists/CONTENT_APPROVAL_CHECKLIST.md) before publishing.

---

**Per the revised creative direction: this is a revised, publish-ready VLF-001. Awaiting approval before proceeding to VLF-002.**
