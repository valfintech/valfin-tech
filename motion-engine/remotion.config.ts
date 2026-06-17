import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Remotion's bundled ffmpeg/ffprobe binaries require macOS 15+; this host is
// on an older macOS. `.remotion-bin/` mirrors the compositor package but
// swaps ffmpeg/ffprobe for the Homebrew-installed binaries.
Config.setBinariesDirectory(`${process.cwd()}/.remotion-bin`);

// Remotion's AAC path hardcodes libfdk_aac, which the Homebrew ffmpeg build
// doesn't include. Render with uncompressed PCM audio instead, then
// transcode the audio track to AAC in a separate ffmpeg pass.
Config.setAudioCodec("pcm-16");
