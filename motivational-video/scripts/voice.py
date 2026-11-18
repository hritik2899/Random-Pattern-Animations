#!/usr/bin/env python3
"""Generate narration, with an offline fallback for unavailable online TTS."""
import asyncio
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE_DIR = ROOT / "public" / "voice"
MAX_SECONDS = 48.0

def command(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

def duration(path):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)], text=True).strip())

async def edge_voice(text, path):
    import edge_tts
    speech = edge_tts.Communicate(text, "en-US-GuyNeural", rate="-16%")
    await asyncio.wait_for(speech.save(str(path)), timeout=50)

def offline_voice(text, path):
    wav = path.with_suffix(".wav")
    command(["espeak-ng", "-v", "en-us", "-s", "140", "-w", str(wav), text])
    command(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
             "-codec:a", "libmp3lame", "-q:a", "3", str(path)])
    wav.unlink(missing_ok=True)

async def main():
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    story = json.loads((ROOT / "story.json").read_text())
    for idx, chapter in enumerate(story["chapters"], start=1):
        path = VOICE_DIR / f"chapter-{idx:02}.mp3"
        try:
            await edge_voice(chapter["narration"], path)
            print(f"Chapter {idx}: neural voice generated")
        except Exception as exc:
            print(f"Chapter {idx}: online voice unavailable ({exc}); using offline narrator")
            path.unlink(missing_ok=True)
            offline_voice(chapter["narration"], path)

        seconds = duration(path)
        if seconds > MAX_SECONDS:
            temp = path.with_name(path.stem + "-fast.mp3")
            command(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path),
                     "-af", f"atempo={seconds/MAX_SECONDS:.5f}", "-codec:a", "libmp3lame",
                     "-q:a", "3", str(temp)])
            temp.replace(path)
            seconds = duration(path)
        print(f"Chapter {idx}: {seconds:.1f} seconds")
    print(f"Generated {len(story['chapters'])} narrated chapters.")

if __name__ == "__main__":
    asyncio.run(main())
