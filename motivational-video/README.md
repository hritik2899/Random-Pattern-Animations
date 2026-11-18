# The One-Hour Promise — motivational story video

An original **10-minute narrated motivational story** generated using Remotion and GitHub Actions. Output: 1280×720, 24 FPS, H.264 MP4.

## Story
Tara repairs electronics near a railway station. She dreams of building inexpensive solar study lamps for children affected by power cuts. Her first prototype fails, but she commits to one hour of progress every day, learns through setbacks, and eventually helps her community.

## GitHub Actions
Open the repository's **Actions** tab, select **Render motivational story video**, and run the workflow from the default branch after merging this PR. Alternatively, view the push-triggered run on the feature branch. After the run succeeds, download the `the-one-hour-promise-10min` artifact from the run page and unzip the MP4.

## Local rendering
Prerequisites: Node 22+, Python 3.11+, FFmpeg, espeak-ng, and a compatible Chromium installation.

```sh
cd motivational-video
npm install
python -m pip install edge-tts
python scripts/voice.py
npx remotion browser ensure
npm run render
```

Edit `story.json` to customize narration, chapter headings, colors, and beats. There are twelve chapters, each exactly fifty seconds on the timeline. The video uses programmatic SVG landscapes and motion typography. There are no paid media/API keys. TTS uses an online neural voice when reachable and offline espeak-ng as fallback. The narration ends before each chapter finishes, leaving room for reflection; this is an intentionally paced visual story, not fully acted character animation.
