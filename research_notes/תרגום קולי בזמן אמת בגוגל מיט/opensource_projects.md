# Open-source end-to-end apps for real-time two-way voice-to-voice translation in video calls (Hebrew <-> English focus)

Research date: 2026-11-21. Repo star/fork/push/license numbers were pulled from the GitHub search API that day; READMEs were read from raw.githubusercontent.com. I could not reach these hosts from the research sandbox: developers.openai.com, ai.google.dev, blog.google, docs.cloud.google.com and support.google.com. Facts about the OpenAI and Gemini models therefore come from the OpenAI Cookbook on GitHub, project READMEs and search-result snippets, and each one is flagged as such.

## Q1. Which GitHub projects implement live bidirectional speech-to-speech translation for meeting apps, and what are their specs?

### Takeaway
Only one project is both mature and broadly used, cross-platform, and built for meetings: **Sokuji** (kizuna-ai-lab/sokuji, about 1.5k stars, AGPL-3.0, releases several times a week). Everything else in the "Meet voice translator" niche is a 0–100-star solo project from 2026. Almost all of these are thin wrappers around one cloud model, either OpenAI `gpt-realtime-translate` or Google `gemini-3.5-live-translate-preview`, plus a virtual audio cable (VB-CABLE on Windows, BlackHole on macOS). The well-known research and local projects (Hibiki, Seamless, StreamSpeech, RTranslator, WhisperLive) are not usable as Hebrew<->English call interpreters.

### Cited Findings

#### Tier A: mature, end-user meeting app

**Sokuji (kizuna-ai-lab/sokuji)** (https://github.com/kizuna-ai-lab/sokuji)
- Repo stats: 1,508 stars, 219 forks, 38 open issues, created 2025-04-14, last push 2026-11-21, AGPL-3.0, TypeScript — [GitHub](https://github.com/kizuna-ai-lab/sokuji)
- What it is: "Real-time two-way speech translation for bilingual meetings — auto-detects the spoken language and translates both directions, cloud or fully offline on-device" — [GitHub](https://github.com/kizuna-ai-lab/sokuji)
- Latest releases:
  - v0.51.1 (21 Nov 2026) and v0.51.0 (19 Nov 2026): session history with recording, meeting notes, post-session transcript editing — [Releases](https://github.com/kizuna-ai-lab/sokuji/releases)
  - v0.50.2–0.50.4 (11–16 Nov 2026): Soniox fixes, region selection — [Releases](https://github.com/kizuna-ai-lab/sokuji/releases)
  - package.json is at version 0.51.1 — [package.json](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/package.json)
- Platforms: desktop Electron app for Windows, macOS (Apple Silicon and Intel) and Linux (Debian/Ubuntu x64/ARM64). Also a Chrome/Edge extension that runs inside web meetings (Google Meet, Teams, Zoom, Discord, Slack, Whereby, Jitsi). Brave is "coming soon" — [README](https://github.com/kizuna-ai-lab/sokuji)
- Meet integration: the desktop app has a built-in "Virtual Microphone" that routes translated audio into Zoom/Meet/Teams. The extension works inside the web meeting page directly — [README](https://github.com/kizuna-ai-lab/sokuji)
- Backends: 8 providers, all bring-your-own-key — [README](https://github.com/kizuna-ai-lab/sokuji)
  - OpenAI
  - Google Gemini
  - Palabra.ai
  - Kizuna AI (key managed by their backend)
  - Doubao AST 2.0
  - Soniox
  - OpenAI-compatible endpoints (desktop only)
  - fully local "Local Inference": 44 ASR models, 75 MT models (Opus-MT, Qwen, Hunyuan-MT 1.5, TranslateGemma) and 137 TTS models (Piper, Coqui, MMS, …) via sherpa-onnx/Transformers.js on WASM/WebGPU
- Specific models in source code:
  - Gemini provider references `gemini-3.5-live-translate-preview` and `gemini-3.8-live` — [testing.ts](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/src/providers/gemini/testing.ts)
  - There is a separate `openai_translate` provider for `gpt-realtime-translate` alongside a general `openai` provider for gpt-realtime models — [code search: provider.ts](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/src/providers/openai_translate/provider.ts)
- Two-way: auto-detects which of the two set languages is being spoken. The README credits Soniox's two-way mode (60+ languages, 3,600+ pairs) and can capture mic and system audio in one session — [README](https://github.com/kizuna-ai-lab/sokuji)
- Hearing the other side as voice (not just subtitles):
  - Until #570 the "participant leg" was text-only for every provider — [Issue #619](https://github.com/kizuna-ai-lab/sokuji/issues/619)
  - Since #615 (Oct 2026), "Translation I hear" speaks the other side's translation for every provider — [Issue #619](https://github.com/kizuna-ai-lab/sokuji/issues/619)
  - Earlier, the participant-leg TTS request was "off by default", and one requester preferred subtitles because of latency — [Issue #511](https://github.com/kizuna-ai-lab/sokuji/issues/511)
- Hebrew in the code:
  - `'he'` is in the app's language list — [languages.ts](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/src/utils/languages.ts)
  - Hebrew ("עברית", `he`) is in the Soniox provider language plan — [Soniox plan](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/docs/superpowers/plans/2026-07-18-soniox-provider.md)
  - Hebrew is in the local sidecar translation backend — [translate_backend.py](https://github.com/kizuna-ai-lab/sokuji/blob/HEAD/sidecar/sokuji_sidecar/translate_backend.py)
  - The README itself never mentions Hebrew — [README](https://github.com/kizuna-ai-lab/sokuji)
- Echo: "built-in with modern Web Audio API", plus AI noise suppression — [README](https://github.com/kizuna-ai-lab/sokuji). A system-loopback AEC stage was added to cancel bleed from external app audio — [Issue #227](https://github.com/kizuna-ai-lab/sokuji/issues/227)
- Privacy caveat: anonymous PostHog analytics are sent even in local mode — [README](https://github.com/kizuna-ai-lab/sokuji)
- Setup: installer from Releases, or the extension from the Chrome Web Store / Edge Add-ons. Cloud providers need your own API key, stored locally — [README](https://github.com/kizuna-ai-lab/sokuji)
- Community: listed on Product Hunt with launches and reviews — [Product Hunt](https://www.producthunt.com/products/sokuji). A search found no Reddit or HN discussion threads.

#### Tier B: small 2026 single-author apps built specifically for Meet calls (two-way, voice out)

**carlosvictorodrigues/realtime-translate** (https://github.com/carlosvictorodrigues/realtime-translate)
- Stats: 6 stars, MIT, created and last pushed 2026-05-08 (no activity since) — GitHub search API
- Stack: Windows 10/11 only, Electron, OpenAI `gpt-realtime-translate` over WebSocket — [README](https://github.com/carlosvictorodrigues/realtime-translate)
- Routing: needs **VB-CABLE A+B**. Meet mic = CABLE-A Output, Meet speakers = CABLE-B Input — [README](https://github.com/carlosvictorodrigues/realtime-translate)
- Setup: 5-minute wizard; the v0.5.0 installer is unsigned — [README](https://github.com/carlosvictorodrigues/realtime-translate)
- Latency claim: "~200-500ms" round trip — [README](https://github.com/carlosvictorodrigues/realtime-translate)
- Cost: $0.034 per session-minute per direction, so a 1-hour bidirectional call is about $4.08. The README also says "~$2 per hour" elsewhere, which contradicts its own table — [README](https://github.com/carlosvictorodrigues/realtime-translate)
- Languages: claims "72 supported languages, any pair". The underlying model outputs only 13 languages, and Hebrew is not one of them (see Q2).

**mkdmit/live-voice-translator** (https://github.com/mkdmit/live-voice-translator)
- Stats: 5 stars, MIT, created 2026-07-21 — GitHub search API
- What it is: Chrome extension, v0.9.2 "release candidate". It captures the conference tab and **replaces Meet's outgoing WebRTC microphone track** with translated speech, so no virtual cable is needed — [README](https://github.com/mkdmit/live-voice-translator)
- Targets and requirements: Google Meet, Zoom Web, Yandex Telemost (desktop apps out of scope). Needs Chrome 116+, an OpenAI Realtime API key and headphones — [README](https://github.com/mkdmit/live-voice-translator)
- The README does not name the exact model. Hebrew is not mentioned — [README](https://github.com/mkdmit/live-voice-translator)
- Security caveat: the long-lived API key is used directly from extension code — [README](https://github.com/mkdmit/live-voice-translator)

**EduardNED/live-call-translator** (https://github.com/EduardNED/live-call-translator)
- Stats: 2 stars, MIT, created 2026-10-27 — GitHub search API
- Stack: macOS only, Python. Two independent `gemini-3.5-live-translate-preview` sessions (one per direction) on Vertex AI — [README](https://github.com/EduardNED/live-call-translator)
- Routing: BlackHole 2ch (Meet speaker → translator) and the "Microsoft Teams Audio" device (translator → Meet mic) — [README](https://github.com/EduardNED/live-call-translator)
- Sessions: source language auto-detected; each session is renewed about every 8 minutes — [README](https://github.com/EduardNED/live-call-translator)
- Field test: used for a 52-minute real Meet call with "12 session renewals, no dropouts" — [README](https://github.com/EduardNED/live-call-translator)
- Configured pairs today are only en→fr, en→ru and ru→fr, so Hebrew would need config/code changes — [README](https://github.com/EduardNED/live-call-translator)
- Cost: about US$4.4/hour for both directions — [README](https://github.com/EduardNED/live-call-translator)
- Setup: gcloud auth, Accessibility/Automation permissions — [README](https://github.com/EduardNED/live-call-translator)

**coinacci/spokked** (https://github.com/coinacci/spokked)
- Stats: 2 stars / 15 forks, MIT, created 2026-10-12 — GitHub search API
- Stack: macOS plus a Chrome extension. Outgoing path: ElevenLabs Scribe v2 Realtime STT → Claude Haiku translation → ElevenLabs v4 Turbo **in your cloned voice** → BlackHole 2ch → Meet mic — [README](https://github.com/coinacci/spokked)
- Incoming path: original voice plus live **subtitles only** (no translated voice) — [README](https://github.com/coinacci/spokked)
- Latency: about 1–1.5 s from end of sentence to first audio — [README](https://github.com/coinacci/spokked)
- Languages: Turkish⇄English by default, configurable by ISO code — [README](https://github.com/coinacci/spokked)
- Cost: needs a paid ElevenLabs plan (Creator; about 800–1,000 characters per minute of speech) plus an Anthropic key — [README](https://github.com/coinacci/spokked)

**LetovKai/call-translator** (https://github.com/LetovKai/call-translator)
- Stats: 51 stars / 15 forks, MIT. Created and last pushed the same day, 2026-04-04; 5 commits; no releases — GitHub search API; [README](https://github.com/LetovKai/call-translator)
- Stack: macOS 14+ only. Deepgram Nova-3 STT → Groq llama-3.3-70b → local Piper TTS. BlackHole 2ch/16ch routing; bidirectional — [README](https://github.com/LetovKai/call-translator)
- Languages: 29, **Hebrew not listed** — [README](https://github.com/LetovKai/call-translator)

**devamitra-bro/VoxBridge** (https://github.com/devamitra-bro/VoxBridge)
- Stats: 0 stars, MIT, created 2026-03-12 — GitHub search API
- Stack: macOS Tauri app, OpenAI Realtime API, BlackHole 2ch + 16ch, two-way voice — [README](https://github.com/devamitra-bro/VoxBridge)
- Languages: lists 55 languages including Hebrew ("the full OpenAI Realtime API set") — [README](https://github.com/devamitra-bro/VoxBridge)

**kvothesson/chasqui** (https://github.com/kvothesson/chasqui)
- Stats: 1 star, MIT, last push 2026-11-04 — GitHub search API
- Stack: Windows installer or `pip install chasqui-translate`. OpenAI key, VB-Audio Cable, two-way calls in any app, live cost meter — [README](https://github.com/kvothesson/chasqui)

**sypnose-cloud/traductor-live** (https://github.com/sypnose-cloud/traductor-live)
- Stats: 0 stars, MIT — GitHub search API
- Stack: Windows. `gpt-realtime-translate` → VB-CABLE for outgoing voice; the incoming side gets subtitles only — [README](https://github.com/sypnose-cloud/traductor-live)
- Delay: "3–5 seconds is normal"; advises speaking in 15–20 s turns — [README](https://github.com/sypnose-cloud/traductor-live)
- Cost: about $2/hour (one direction) — [README](https://github.com/sypnose-cloud/traductor-live)

**rusyander/voicebridge** (https://github.com/rusyander/voicebridge)
- Stats: 0 stars, no license — GitHub search API
- Stack: local pipeline with faster-whisper large-v3 → Ollama qwen3:32b (or GPT/Claude) → Kokoro/Piper TTS → VB-CABLE. Two-way, with the incoming translation in your headphones — [README](https://github.com/rusyander/voicebridge)

**roirude/LiveLingo** (https://github.com/roirude/LiveLingo)
- Stats: 6 stars, MIT — GitHub search API
- Stack: Windows, **one-way outgoing** only. Groq Whisper or local faster-whisper → Groq/Google translation → Edge TTS → VB-Cable as the Teams mic — [README](https://github.com/roirude/LiveLingo)

#### Tier C: adjacent tools (one direction, or not built to inject into a Meet mic)

**navidseyedain/ALAD** (https://github.com/navidseyedain/ALAD)
- Stats: 40 stars, MIT — GitHub search API
- What it is: Chrome extension that dubs **any tab's audio** live via Gemini 3.5 Live Translate. It auto-mutes the original tab audio — [README](https://github.com/navidseyedain/ALAD)
- Languages: 78, **Hebrew included** — [README](https://github.com/navidseyedain/ALAD)
- Listening-only; it does not translate your microphone.

**msmahdinejad/avorythm** (https://github.com/msmahdinejad/avorythm)
- Stats: 86 stars, MIT, last push 2026-11-04 — GitHub search API
- What it is: desktop app plus a Chrome Web Store extension for live dubbing and captions via Gemini — [README](https://github.com/msmahdinejad/avorythm)
- Languages: Hebrew is in the target-language catalog; UI has automatic RTL/LTR — [README](https://github.com/msmahdinejad/avorythm)
- Consumption-oriented (tabs, media); no outgoing mic injection.

**noSugarK/ReaLingo** (https://github.com/noSugarK/ReaLingo)
- Stats: 92 stars, MIT, last push 2026-11-20 — GitHub search API
- Stack: Tauri app for Windows/macOS/Linux/Android. Providers: Qwen LiveTranslate, OpenAI `gpt-realtime-translate`, Gemini Live Translate, Doubao — [README](https://github.com/noSugarK/ReaLingo)
- Output: subtitles plus read-aloud. It excludes its own TTS from system-audio capture — [README](https://github.com/noSugarK/ReaLingo)
- Chinese-centric; no virtual-mic output into calls is described.

**kapitalismho/PuriPuly-heart** (https://github.com/kapitalismho/PuriPuly-heart)
- Stats: 139 stars, AGPL-3.0, last push 2026-11-21 — GitHub search API
- What it is: Windows two-way voice translator for **VRChat** (subtitle overlay/OSC). About 1 s latency under optimal conditions — [README](https://github.com/kapitalismho/PuriPuly-heart)

**google-gemini/gemini-live-translate-livekit** (https://github.com/google-gemini/gemini-live-translate-livekit)
- Stats: 50 stars, Apache-2.0, official Google sample — GitHub search API
- What it is: **one-to-many broadcast** translation (organizer → listeners per language) over LiveKit, not Meet. Needs a paid-tier Gemini key; the free tier allows only about 3–5 concurrent WebSockets — [README](https://github.com/google-gemini/gemini-live-translate-livekit)

**igor-markin/hebrew-live** (https://github.com/igor-markin/hebrew-live)
- Stats: 5 stars, Apache-2.0, last push 2026-11-18 — GitHub search API
- What it is: local Hebrew **captions plus text translation** on Apple Silicon (macOS 27+). Uses ivrit.ai Whisper Turbo MLX + MiLMMT-46-4B (about 3.83 GB download) — [README](https://github.com/igor-markin/hebrew-live)
- Limits: no system-audio capture, and the README describes no TTS. Not speech-to-speech — [README](https://github.com/igor-markin/hebrew-live)

**joshchamo/English-to-Hebrew-Speech-to-Speech-translator** (https://github.com/joshchamo/English-to-Hebrew-Speech-to-Speech-translator)
- Stats: 0 stars — GitHub search API
- What it is: Gradio + Groq (Whisper Large V3 Turbo, Llama 3.3 70B) demo on a Hugging Face Space. A toy, not call-integrated — [README](https://github.com/joshchamo/English-to-Hebrew-Speech-to-Speech-translator)

**antor44/Audio-Transcription** (https://github.com/antor44/Audio-Transcription)
- Stats: 10 stars, GPL-3.0 — GitHub search API
- What it is: browser extension "live interpreter" that captures tab audio through a local WhisperLive server — [GitHub search description](https://github.com/antor44/Audio-Transcription)

#### Tier D: frameworks, models and research projects (not ready-to-use Meet interpreters)

**RTranslator (niedev/RTranslator)** (https://github.com/niedev/RTranslator)
- Stats: 10,704 stars, Apache-2.0, Android, last push 2026-11-19 — GitHub search API
- Design: an offline **in-person** translator (Conversation mode between phones and Bluetooth headsets, or WalkieTalkie mode on one phone). It is not a video-call tool — [README](https://github.com/niedev/RTranslator)
- Models: Whisper plus NLLB. Newer options are Bergamot, Madlad 400 3B and HY-MT 1.5 1.8B — [README](https://github.com/niedev/RTranslator)
- Hebrew: available only under "Support low quality languages" — [README](https://github.com/niedev/RTranslator)
- Voice: uses the phone's system TTS (Google TTS recommended) — [README](https://github.com/niedev/RTranslator)
- Funding: v3.0 is funded by NLnet NGI Mobifree — [README](https://github.com/niedev/RTranslator)

**Kyutai Hibiki (kyutai-labs/hibiki)** (https://github.com/kyutai-labs/hibiki)
- Stats: 1,540 stars, Apache-2.0 — GitHub search API
- Languages: "currently only supports French-to-English" — [README](https://github.com/kyutai-labs/hibiki)

**Hibiki-Zero (kyutai-labs/hibiki-zero)** (https://github.com/kyutai-labs/hibiki-zero)
- Stats: 282 stars, MIT, Feb 2026 — GitHub search API
- Languages: French, Spanish, Portuguese and German → English only, with voice transfer — [README](https://github.com/kyutai-labs/hibiki-zero)
- Hardware: 3B parameters, needs an NVIDIA GPU with 8–12 GB VRAM — [README](https://github.com/kyutai-labs/hibiki-zero)
- **No Hebrew.**

**Meta Seamless (facebookresearch/seamless_communication)** (https://github.com/facebookresearch/seamless_communication)
- Stats: 11,908 stars, 257 open issues, non-standard license — GitHub search API
- Hebrew (`heb`): speech and text as **source**, but **text-only as target**. No Hebrew speech output — [M4T language table](https://github.com/facebookresearch/seamless_communication/blob/main/docs/m4t/README.md)

**StreamSpeech (ictnlp/StreamSpeech)** (https://github.com/ictnlp/StreamSpeech)
- Stats: 1,293 stars, MIT, last push 2025-06-29 (stale) — GitHub search API
- Models: CVSS-trained X→English (e.g., Fr-En) — [README](https://github.com/ictnlp/StreamSpeech)
- **No Hebrew.**

**WhisperLive (collabora/WhisperLive)** (https://github.com/collabora/WhisperLive)
- Stats: 4,364 stars, MIT, active — GitHub search API
- What it is: STT only, with a `translate` (to English) option and an `enable_translation` any-to-any *text* thread. No TTS. Has transcription browser extensions — [README](https://github.com/collabora/WhisperLive)

**ufal/whisper_streaming** (https://github.com/ufal/whisper_streaming)
- Stats: 3,679 stars, MIT, last push 2025-11-12 — GitHub search API
- What it is: streaming STT and translation-to-English text building block — [GitHub](https://github.com/ufal/whisper_streaming)

**Voice-agent frameworks**
- LiveKit Agents: 15,298 stars, Apache-2.0 — [GitHub](https://github.com/livekit/agents)
- Pipecat: 17,368 stars, BSD-2 — [GitHub](https://github.com/pipecat-ai/pipecat)
- pipecat-examples includes a `daily-multi-translation` example for "multi-language conference calls" — [pipecat-examples README](https://github.com/pipecat-ai/pipecat-examples)
- livekit-examples/live-translated-captioning (24 stars) — [GitHub](https://github.com/livekit-examples/live-translated-captioning)
- OpenVidu agents (transcription, translation) on LiveKit — [GitHub](https://github.com/OpenVidu/openvidu-agents)
- These frameworks run in their own WebRTC rooms (Daily/LiveKit), not inside a Google Meet call.

### Inferences
- For "speak Hebrew, they hear English; they speak English, I hear Hebrew" inside Google Meet, **Sokuji is the only project with real maturity**: active releases, cross-platform, an extension plus a virtual mic, Hebrew in its language list, and incoming-voice TTS since Oct 2026. The best fit is its Gemini (3.5 Live Translate) or Soniox provider, *not* `gpt-realtime-translate` (see Q2).
- Every Tier B project is essentially "VB-CABLE/BlackHole + one cloud model + a small UI". Most have under 10 stars, no issues, and were created and last pushed within days. Treat them as reference implementations or fallback DIY, not supported products.
- A macOS user comfortable with Python could adapt EduardNED/live-call-translator (Gemini, field-tested 52-minute Meet call) to he↔en. A Windows user could use carlosvictorodrigues/realtime-translate for the Hebrew→English direction only.

### Gaps
- I did not test any app or verify that Sokuji's Gemini or Soniox provider produces usable Hebrew speech output in practice. Hebrew is only present in code lists; the README does not mention it.
- Sokuji's latency figures are not documented in its README.
- Whether Sokuji's two-way auto-detect ("Both") mode is available with the Gemini provider or only with Soniox: the README credits only Soniox explicitly.
- Exact models used by mkdmit/live-voice-translator, chasqui and VoxBridge (generic "OpenAI Realtime"). This determines whether Hebrew output is possible.
- Spokked (ElevenLabs), LiveLingo (Edge TTS) and voicebridge (Kokoro/Piper) Hebrew TTS support was not verified in their docs.

## Q2. Which backends actually support Hebrew both as input and as spoken output? (This decides which projects can work for Hebrew<->English)

### Takeaway
The decisive constraint is the model. **OpenAI `gpt-realtime-translate` accepts Hebrew input but cannot speak Hebrew** (13 output languages, Hebrew excluded). OpenAI-translate-based apps therefore only cover the Hebrew→English half. **Google `gemini-3.5-live-translate-preview` lists Hebrew** and is the strongest single-model choice for both directions. Soniox also claims Hebrew translation and TTS. Seamless, Hibiki and StreamSpeech cannot output Hebrew speech.

### Cited Findings
- **OpenAI `gpt-realtime-translate`**
  - Outputs: "currently supports 13 target output languages: Spanish, Portuguese, French, Japanese, Russian, Chinese, German, Korean, Hindi, Indonesian, Vietnamese, Italian, and English" — [OpenAI Cookbook realtime translation guide](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
  - Inputs: Hebrew **is** among the 70+ input languages — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
  - Same 13 outputs (Wiro, Livelingo) — [livelingo guide](https://www.livelingo.io/guides/gpt-live-translation). Some secondary sources list Arabic/Dutch instead — [Scrimba](https://scrimba.com/explain/guide0r9bllk13) (conflicting; the Cookbook is authoritative)
  - Behavior: "does not currently support custom prompting or voice selection". It uses "dynamic voice adaptation" (output follows the speaker's tone and pitch) and may stay silent for speech already in the output language — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
  - Pricing: $0.034 per minute of input audio — [ReaLingo README price table](https://github.com/noSugarK/ReaLingo); [realtime-translate README](https://github.com/carlosvictorodrigues/realtime-translate)
  - The general-purpose models (gpt-realtime-2) are recommended for voice agents rather than interpretation — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
- **Google `gemini-3.5-live-translate-preview`** (public preview via the Gemini Live API and AI Studio)
  - Hebrew (`he`) is in the Google Cloud supported-language table, and the model covers 70+ languages — search-result snippets of [Google Cloud docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-live-translate) and [Gemini API docs](https://ai.google.dev/gemini-api/docs/live-api/live-translate) (pages not directly fetchable from the sandbox)
  - ALAD's language table includes Hebrew for this model — [ALAD README](https://github.com/navidseyedain/ALAD)
  - ReaLingo describes the model as "54 languages", which conflicts with Google's "70+" — [ReaLingo README](https://github.com/noSugarK/ReaLingo)
  - ReaLingo also says OpenAI and Gemini can read aloud all of their target languages — [ReaLingo README](https://github.com/noSugarK/ReaLingo)
  - Pricing: audio in $3.50 per 1M tokens and audio out $21.00 per 1M tokens (preview), about $0.0368/min — [ReaLingo README](https://github.com/noSugarK/ReaLingo). About $4.4/hour for both directions on Vertex — [EduardNED README](https://github.com/EduardNED/live-call-translator)
  - Meet has a limited private preview of Gemini 3.5 Live translation for select Workspace customers — search snippet of [9to5Google](https://9to5google.com/2026/06/09/gemini-3-5-live-translate-meet/)
- **Soniox** (commercial API used by Sokuji): its marketing pages claim real-time Hebrew STT, translation between Hebrew and 60+ languages in both directions, and TTS in 60+ languages — [Soniox Hebrew translation](https://soniox.com/speech-translation/hebrew); [English→Hebrew](https://soniox.com/speech-translation/english/hebrew); [Soniox Hebrew platform](https://soniox.com/platform/hebrew). Not independently verified.
- **Meta Seamless**: Hebrew is supported as speech/text source but only as **text** target — [Seamless M4T docs](https://github.com/facebookresearch/seamless_communication/blob/main/docs/m4t/README.md)
- **Kyutai Hibiki / Hibiki-Zero**: Fr→En only and Fr/Es/Pt/De→En only — [Hibiki](https://github.com/kyutai-labs/hibiki); [Hibiki-Zero](https://github.com/kyutai-labs/hibiki-zero)
- **StreamSpeech**: X→En on CVSS (e.g., Fr-En) — [StreamSpeech](https://github.com/ictnlp/StreamSpeech)
- **RTranslator**: Hebrew only as a "low quality" language; voice depends on the phone's system TTS — [RTranslator](https://github.com/niedev/RTranslator)
- **Local Hebrew ASR**: ivrit.ai Whisper Turbo is used by hebrew-live — [hebrew-live](https://github.com/igor-markin/hebrew-live)

### Inferences
Hebrew suitability of the call-translator projects:

| Project | Model | Hebrew suitability |
|---|---|---|
| carlosvictorodrigues/realtime-translate | `gpt-realtime-translate` | Hebrew→English voice only; English→Hebrew voice is not possible |
| sypnose-cloud/traductor-live | `gpt-realtime-translate` | Hebrew→English voice only |
| Sokuji `openai_translate` provider | `gpt-realtime-translate` | Hebrew→English voice only |
| Sokuji with Gemini or Soniox | Gemini 3.5 Live Translate / Soniox | Plausible for both directions (Hebrew in the model list, not tested) |
| EduardNED/live-call-translator | Gemini 3.5 Live Translate | Plausible for both directions after reconfiguration (not tested) |
| ALAD | Gemini 3.5 Live Translate | Hebrew voice for the incoming leg only |

- Prompt-based general realtime models (gpt-realtime, gemini-3.x-live dialogue models) can be told to output Hebrew. However, the Cookbook warns that general models "may still answer questions or follow instructions rather than translate them" — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
- No fully local, open-weights end-to-end Hebrew↔English speech-to-speech model was found. A local cascade (ivrit.ai Whisper + MT LLM + a Hebrew-capable TTS) is possible in Sokuji's Local Inference, but Hebrew TTS quality there is unverified.

### Gaps
- I could not read Google's official Gemini 3.5 Live Translate page directly. Hebrew support, latency and session limits rest on search snippets and third-party READMEs.
- No published Hebrew-specific quality or latency evaluation was found for Gemini 3.5 Live Translate, Soniox or any local cascade.
- Which of Sokuji's 137 local TTS models covers Hebrew, and at what quality, was not determined.

## Q3. Which projects are mature and actually used, versus toy demos?

### Takeaway
By stars, release cadence and issue activity, the only mature *meeting* translator is Sokuji. RTranslator, Seamless, Hibiki, WhisperLive, LiveKit and Pipecat are mature, but they are either not for video calls or are building blocks. The Meet-specific voice translators found are new single-author projects, with no community discussion found.

### Cited Findings
- Sokuji activity:
  - 237 issues total in the tracker — [GitHub issue search](https://github.com/kizuna-ai-lab/sokuji/issues)
  - Five releases in 11–21 Nov 2026 — [Releases](https://github.com/kizuna-ai-lab/sokuji/releases)
  - Reported reliability problem: "半小时的会议断线五六次" (a half-hour meeting disconnected 5–6 times), issue #690 (closed) — [Issue #690](https://github.com/kizuna-ai-lab/sokuji/issues/690)
  - Follow-up feature: "Reconnect automatically after an unexpected disconnect" (#692, closed 2026-11-05) — [Issue #692](https://github.com/kizuna-ai-lab/sokuji/issues/692)
  - Companion repos: kizuna-ai-lab/sokuji-tsuyaku-api and sokuji-bridge — GitHub search API
- Sokuji community: Product Hunt launch pages and reviews exist — [Product Hunt](https://www.producthunt.com/products/sokuji). A web search found no Reddit or HN threads; results were promotional.
- RTranslator: 10.7k stars, 967 forks, NLnet-funded v3 — GitHub search API; [README](https://github.com/niedev/RTranslator)
- Tier B dormancy:
  - LetovKai/call-translator (51 stars): only 5 commits and no releases; created and last pushed on 2026-04-04 — [README/GitHub](https://github.com/LetovKai/call-translator)
  - carlosvictorodrigues/realtime-translate: created and last pushed 2026-05-08 — GitHub search API
- Field evidence: EduardNED/live-call-translator is the only Tier B project reporting a documented real-world call (52 minutes, 12 session renewals) — [README](https://github.com/EduardNED/live-call-translator)
- Commercial Chrome-Web-Store Meet translators (MeetVoice, Mashmelo, Live Meeting Interpreter, Botista Meet) appear in searches but are proprietary — [Chrome Web Store: MeetVoice](https://chromewebstore.google.com/detail/ahmdecnledffbnblohemfonphfapcifg); [Mashmelo](https://chromewebstore.google.com/detail/blkkkjcoeagckhpblljboibepfpikjoj)

### Inferences
- Star counts for the Tier B and C projects (0–92) and same-day create/push dates suggest weekend or AI-assisted builds. EduardNED openly states its code was written with Codex and Claude Code. Expect little support.
- Sokuji's commit and issue velocity is high (version 0.x), so occasional regressions are likely. The many "superpowers" plan/spec docs suggest heavy AI-assisted development, but this is an inference.

### Gaps
- No user reviews of Hebrew usage of any of these tools were found (Reddit r/Israel, HN or Product Hunt).
- Sokuji's download counts and Chrome Web Store user numbers were not retrieved.

## Q4. Known pitfalls (echo/feedback, Hebrew issues, voice cloning, interruptions, sessions, cost)

### Takeaway
The recurring pitfalls are:
- Acoustic and digital feedback loops: you need headphones, plus two separate virtual cables or WebRTC track replacement.
- Session time limits and disconnects on long calls.
- Translated speech drifting behind.
- Meet's own noise suppression degrading synthetic voice.
- Bluetooth headset quirks.
- Preview models mishearing names and numbers.
- API-key handling in extensions.
- Cost of about $4/hour for two-way cloud translation.

### Cited Findings
- **Feedback loop and why two cables**: speakers → mic → re-translation creates an "infinite scream". A single cable makes the two directions collide. VB-CABLE **A+B** (not basic VB-CABLE) is required on Windows — [realtime-translate README](https://github.com/carlosvictorodrigues/realtime-translate)
- **Headphones**: mkdmit says to use headphones or conference audio "can feed back into the microphone and be translated repeatedly" — [README](https://github.com/mkdmit/live-voice-translator). EduardNED rejects loudspeakers — [README](https://github.com/EduardNED/live-call-translator). Spokked mutes your mic while translation plays if you're on speakers — [README](https://github.com/coinacci/spokked)
- **Self-capture**: ReaLingo excludes its own TTS from system-audio capture on Windows, macOS and Android — [README](https://github.com/noSugarK/ReaLingo). Sokuji added system-loopback AEC — [Issue #227](https://github.com/kizuna-ai-lab/sokuji/issues/227)
- **Meet noise cancellation**: Spokked says turn it off because "it can clip synthetic speech" — [README](https://github.com/coinacci/spokked)
- **Session limits and reconnects**:
  - Gemini sessions renewed about every 8 minutes with overlapping handover — [EduardNED README](https://github.com/EduardNED/live-call-translator)
  - Sokuji disconnects in a 30-minute meeting (#690) and an auto-reconnect feature (#692) — [Issue #690](https://github.com/kizuna-ai-lab/sokuji/issues/690); [Issue #692](https://github.com/kizuna-ai-lab/sokuji/issues/692)
  - Gemini free tier limits concurrent WebSockets to about 3–5 — [gemini-live-translate-livekit README](https://github.com/google-gemini/gemini-live-translate-livekit)
- **Drift and latency accumulation**: spoken translations that are longer than the original fall further behind over time — [Sokuji Issue #694](https://github.com/kizuna-ai-lab/sokuji/issues/694). Spokked speeds TTS up to 1.2× to keep pace — [README](https://github.com/coinacci/spokked)
- **Interruptions and overlap**: "Interrupted" events from overlapping speakers are counted, not fatal; overlapping speakers are translated as one stream — [EduardNED README](https://github.com/EduardNED/live-call-translator)
- **Bluetooth**: when headphones switch Bluetooth mode, playback can go "into nothing"; the built-in mic was more stable than the headset mic — [EduardNED README](https://github.com/EduardNED/live-call-translator)
- **Accuracy**: the preview model "can mishear numbers, dates and names"; confirm key figures and keep sentences short — [EduardNED README](https://github.com/EduardNED/live-call-translator)
- **Same-language silence** (OpenAI): `gpt-realtime-translate` may not translate speech already in the target language, so a speaker switching languages may produce silence — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
- **Voice cloning**:
  - Spokked uses an ElevenLabs Instant Voice Clone. Record 2–3 minutes in your own language; reading English in a strong accent carries the accent over — [README](https://github.com/coinacci/spokked)
  - OpenAI translate adapts tone and pitch automatically but offers no voice selection — [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide.mdx)
  - EduardNED: "Translated speech uses a synthetic voice" — [README](https://github.com/EduardNED/live-call-translator)
- **API key security**: "Gemini API keys flagged as leaked by Google after use with Gemini Live" (Sokuji #540, open) — [Issue #540](https://github.com/kizuna-ai-lab/sokuji/issues/540). The mkdmit extension holds a long-lived OpenAI key in extension code — [README](https://github.com/mkdmit/live-voice-translator)
- **Unsigned binaries**: Windows SmartScreen and macOS Gatekeeper warnings for realtime-translate, chasqui, ReaLingo and hebrew-live — [realtime-translate](https://github.com/carlosvictorodrigues/realtime-translate); [chasqui](https://github.com/kvothesson/chasqui); [ReaLingo](https://github.com/noSugarK/ReaLingo); [hebrew-live](https://github.com/igor-markin/hebrew-live)
- **Cost benchmarks**:
  - OpenAI translate: about $0.034/min per direction, so a 1-hour two-way call is about $4.08 — [realtime-translate](https://github.com/carlosvictorodrigues/realtime-translate)
  - Gemini Live Translate: about $4.4/hour two-way — [EduardNED](https://github.com/EduardNED/live-call-translator)
  - Spokked: ElevenLabs Creator plan plus a few cents of Claude per meeting — [Spokked](https://github.com/coinacci/spokked)
- **Mic replacement scope**: WebRTC mic-track replacement (extension approach) works only for browser Meet, Zoom Web and Telemost, not native desktop apps — [mkdmit README](https://github.com/mkdmit/live-voice-translator)

### Inferences
- For a Hebrew speaker on Google Meet in Chrome, the least-friction architecture is an extension that replaces the WebRTC mic track (Sokuji extension, or mkdmit's approach) plus wired headphones. This avoids installing virtual cable drivers. The desktop virtual-mic route (Sokuji desktop, VB-CABLE A+B or BlackHole) is the fallback.
- Expect a 1–5 s delay per utterance across these tools (1–1.5 s for Spokked, about 1 s for PuriPuly, 3–5 s for traductor-live). Short sentences and turn-taking help. Hebrew-specific problems (RTL display, name transliteration) are not documented anywhere I found. Avorythm explicitly handles RTL/LTR text direction in captions — [README](https://github.com/msmahdinejad/avorythm)

### Gaps
- No Hebrew-specific bug reports (RTL subtitle rendering, nikud, gendered-verb errors, name handling) were found in any repo.
- No measured end-to-end latency for Gemini 3.5 Live Translate or Sokuji in a Meet call was found. The 200–500 ms figure for realtime-translate is self-reported.
- Google Meet's own speech-translation language list (including whether Hebrew is supported) could not be fetched because support.google.com was blocked. Another researcher covers commercial and built-in options.
