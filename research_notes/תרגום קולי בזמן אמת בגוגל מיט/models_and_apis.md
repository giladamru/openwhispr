# Engine Layer for Real-Time Hebrew <-> English Speech-to-Speech Translation (Models & APIs, as of Nov 2026)

> Method note: WebFetch was blocked for developers.openai.com, ai.google.dev and soniox.com in this research session (DNS not allowed), so every finding below comes from web-search result extracts of those pages plus secondary sources. Items marked "vendor claim" are not independently verified. Direction terms: **IN** = Hebrew accepted as speech input; **OUT** = Hebrew produced as speech output. The user's call needs BOTH directions: Hebrew IN -> English OUT (user speaks) and English IN -> Hebrew OUT (user listens). The second direction (Hebrew voice output) is where most engines fail.

## 1. End-to-end speech-to-speech models/APIs: which support Hebrew, in which direction, and how good are they?

### Takeaway
As of Nov 2026, only a few engines produce **Hebrew speech output** in real time: Google's Gemini 3.5 Live Translate (Hebrew listed in its language table, preview; Hebrew quality not independently reviewed), Palabra (S2S, vendor claims Hebrew), Soniox (two-way Hebrew text translation plus its own TTS for S2S; vendor claims), and general-purpose voice LLMs (OpenAI gpt-realtime-2/2.1, Gemini Live native audio) prompted to act as interpreters. OpenAI's dedicated `gpt-realtime-translate` handles **Hebrew IN only** (no Hebrew OUT). Meta SeamlessM4T v2 is Hebrew IN, text-only Hebrew out. Kyutai Hibiki/Hibiki-Zero has no Hebrew. Azure Live Interpreter lists Hebrew as a source only, Amazon has no Hebrew TTS, DeepL Voice has no Hebrew translated speech. So the most practical setup is one dedicated engine for Hebrew->English plus a separate engine (or a cascade ending in a good Hebrew TTS) for English->Hebrew.

### Cited Findings

**Summary matrix (details and sources below)**

| Engine | Hebrew IN (speech) | Hebrew OUT (speech) | Type | Price (listed) | Status |
|---|---|---|---|---|---|
| OpenAI `gpt-realtime-translate` | Yes | **No** (13 output langs, no Hebrew) | dedicated S2S translation | $0.034/min input audio | GA since May 7, 2026 |
| OpenAI `gpt-realtime-2` / `2.1` (prompted as interpreter) | Yes | Yes (general voice LLM; Hebrew in Azure Voice Live gpt-realtime list) | conversational S2S | $32/1M audio-in tokens, $64/1M audio-out tokens | GA |
| Google `gemini-3.5-live-translate-preview` | Yes | Listed ("he" in language table); quality unreviewed | dedicated S2S translation | ~$0.037/min (third-party calc) | Public preview (June 2026) |
| Google Meet built-in speech translation | Hebrew on Meet help list (unclear if in new 63-lang set) | same | in-product feature | Workspace plan | Rolling out (Oct 2026 expansion) |
| Meta SeamlessM4T v2 / SeamlessStreaming | Yes | **No** (Hebrew = text target only) | open weights S2S | free (self-host) | 2023 model, dated |
| Kyutai Hibiki / Hibiki-Zero | **No** | **No** (FR/ES/PT/DE -> EN only) | open weights S2S | free, non-commercial | Feb 2026 |
| Azure Live Interpreter | Yes (source) | **Not listed as target** | managed S2S | not retrievable | preview / Limited Access |
| Azure classic Speech Translation + he-IL TTS | Yes (he-IL STT) | via he-IL neural TTS (cascade inside Azure) | managed cascade | not retrievable | GA |
| Palabra | Yes (vendor) | Yes (vendor: "Hebrew-to-English ... 60+ languages") | managed S2S | $0.04/min S2S | GA |
| Soniox | Yes | Hebrew as translation *target* (text) + Soniox TTS for S2S (Hebrew TTS not confirmed) | STT+translation (+TTS) | ~$0.82–0.88/hr S2S (vendor) | GA (STT v6) |
| DeepL Voice API | Yes (transcription via partner) | **No** translated speech for Hebrew | STT+MT(+TTS) | n/a | Voice-to-Voice early access |
| Amazon (Transcribe / Polly / Nova Sonic) | Transcribe streaming he-IL yes | **No** Polly Hebrew voice; Nova Sonic no Hebrew | components | n/a | — |
| ElevenLabs | Scribe STT Hebrew yes | Eleven v3 TTS Hebrew yes; Flash v2.5 (low-latency) no | components | n/a | — |
| Deepgram Nova-3 | Yes (monolingual `he`, streaming) | No TTS for Hebrew found | STT only | n/a | Feb 2026 |
| Speechmatics | Yes (real-time + batch) | No | STT only | n/a | — |

**OpenAI**
- `gpt-realtime-translate` was released May 7, 2026 in the Realtime API; it streams translated audio + transcript while source audio is still arriving; priced at $0.034 per minute of input audio — [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-realtime-translate); [OpenAI community announcement](https://community.openai.com/t/new-realtime-voice-models-in-the-api/1380471)
- It accepts 70+ input languages but only 13 output languages: Spanish, Portuguese, French, Japanese, Russian, Chinese, German, Korean, Hindi, Indonesian, Vietnamese, Italian, English. **Hebrew is an input language but NOT an output language** — [OpenAI Cookbook: realtime translation guide](https://developers.openai.com/cookbook/examples/voice_solutions/realtime_translation_guide); list matches [Vantaige](https://vantaige.io/blog/gpt-realtime-translate-70-language-voice-agent-2026)
- OpenAI says the model was trained on thousands of hours of professional interpreter audio so it waits for enough context before speaking, and stays translation-only; it does not currently support custom prompting or voice selection — [OpenAI Cookbook](https://developers.openai.com/cookbook/examples/voice_solutions/realtime_translation_guide)
- It shipped with `gpt-realtime-2` (native speech-to-speech conversational) and `gpt-realtime-whisper` (streaming transcription, $0.017/min) — [Handy AI](https://handyai.substack.com/p/model-drop-gpt-realtime-2); [OpenAI community](https://community.openai.com/t/new-realtime-voice-models-in-the-api/1380471); [OpenAI announcement](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/)
- OpenAI's models page now also lists `gpt-realtime-2.1` and `gpt-realtime-2.1-mini` — [OpenAI models](https://developers.openai.com/api/docs/models); [gpt-realtime-2.1-mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)
- `gpt-realtime-2` pricing: audio input $32.00/1M tokens, cached audio input $0.40/1M, audio output $64.00/1M; text $4 in / $24 out per 1M — [OpenAI gpt-realtime-2 model page](https://developers.openai.com/api/docs/models/gpt-realtime-2); token-based billing noted by [The Next Web](https://thenextweb.com/news/openai-gpt-realtime-2-voice-models)
- Hebrew is in the language list for gpt-realtime in Azure's Voice Live API (i.e., the general realtime model handles Hebrew) — [Azure Voice Live language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live-language-support)
- User reports: older `tts-1`/`tts-1-hd` Hebrew has "an American accent" in all six voices — [OpenAI forum](https://community.openai.com/t/tts-1-and-tts-1-hd-in-hebrew-has-an-american-accent/500307); a later forum post says Hebrew sounds much better in the realtime voice system than in the older TTS — [OpenAI forum: realtime voices Hebrew](https://community.openai.com/t/real-time-voices-for-tts-api-specifically-hebrew-support/1064592); a separate thread is titled "Realtime api not working well in Hebrew" (2025, earlier model) — [OpenAI forum](https://community.openai.com/t/realtime-api-not-working-well-in-hebrew/1088205)
- Competitor claim (Soniox, vendor): OpenAI "struggles with real-world Hebrew – especially regional accents, fast speech, or noisy input" (ASR side) — [Soniox vs OpenAI Hebrew](https://soniox.com/compare-stt/soniox-vs-openai/hebrew)

**Google**
- Google offers a dedicated live speech translation model: `gemini-3.5-live-translate-preview` (Gemini Live API), released June 9, 2026, covering 70+ languages / 2,000+ combinations, also rolling into Google Meet and Google Translate — [MarkTechPost](https://www.marktechpost.com/2026/06/09/google-releases-gemini-3-5-live-translate-a-streaming-speech-to-speech-audio-model-covering-70-languages-across-meet-translate-and-the-live-api/); [9to5Google](https://9to5google.com/2026/06/09/gemini-3-5-live-translate-meet/)
- Google's live-translate docs include Hebrew (BCP-47 `he`) in the language table; target is set via `targetLanguageCode` (default `en`); input must be audio (no text input); one target language per session; source auto-detected — [Gemini API: Live translate](https://ai.google.dev/gemini-api/docs/live-api/live-translate); [ChatForest builder guide](https://chatforest.com/builders-log/gemini-3-5-live-translate-speech-to-speech-70-languages-live-api-builder-guide/)
- Audio format per third-party guide: 16 kHz PCM in, 24 kHz translated audio out, plus optional transcripts — [Agentpedia](https://agentpedia.codes/blog/gemini-3-5-live-translate-api-guide)
- Google's own docs warn voices may shift after long pauses, may assign the wrong gender based on how speech starts, and similar issues in rapid multi-speaker conversation; language detection can struggle with non-native accents and rapid switching — [Gemini API: Live translate](https://ai.google.dev/gemini-api/docs/live-api/live-translate)
- Google released no benchmark scores, per-language-pair results, or latency figures at launch — [AlphaSignal](https://alphasignal.ai/news/google-s-gemini-3-5-live-translate-brings-real-time-speech-translation-to-70)
- One review lists the best-supported tier as English, Spanish, French, German, Italian, Brazilian Portuguese, Japanese, Korean, Mandarin, Hindi, Arabic — Hebrew not in that tier — [xpert.digital review](https://xpert.digital/en/gemini-live-translate/)
- Hebrew-specific complaint (about Gemini Live assistant 3.8, not Live Translate): model misunderstood basic Hebrew input and switched languages mid-call — [Google AI Developers Forum](https://discuss.ai.google.dev/t/gemini-live-3-8-feels-like-a-regression-for-hebrew/185811)
- Live API capability guide lists 99 languages including Hebrew `he`; separate live transcription model `gemini-3.5-transcribe-live` lists `he-IL` — [Live API capabilities](https://ai.google.dev/gemini-api/docs/live-api/capabilities); [Live transcribe](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe)
- Google Meet: Oct 22, 2026 Workspace update says Meet speech translation now supports any combination of 63 languages with auto-detection on web/Android/iOS — [Workspace Updates](https://workspaceupdates.googleblog.com/2026/10/real-time-speech-translation-in-google-Meet-expands-to-63-languages-with-automatic-language-detection.html); Google has not published the full 63-language list per [Glitchwire](https://glitchwire.com/news/google-meet-speech-translation-expands-to-63-languages-dropping-the-one-pair-con/); Hebrew appears on the Meet speech-translation help page per search extract — [Meet Help: Speech Translation](https://support.google.com/meet/answer/16221730?hl=en); initial June rollout was "private preview for select business Google Workspace customers" — [9to5Google](https://9to5google.com/2026/06/09/gemini-3-5-live-translate-meet/)
- Meet speech translation is not available in live streams, recordings, client-side-encrypted meetings, dial-in or third-party interop calls, or with adaptive audio — [Meet Help](https://support.google.com/meet/answer/16221730?hl=en)

**Meta Seamless**
- SeamlessM4T v2 model card: Hebrew row `heb | Sp, Tx | Tx` — speech+text as **source**, **text only** as target. Speech output covers 35 languages; Hebrew is not one. Speech input covers 101 languages — [facebook/seamless-m4t-v2-large model card](https://huggingface.co/facebook/seamless-m4t-v2-large/blob/main/README.md?code=true)
- Maintainers acknowledge the model card can overstate speech-output support (e.g., `cmn_Hant`) — [HF discussion #17](https://huggingface.co/facebook/seamless-m4t-v2-large/discussions/17)

**Kyutai**
- Original Hibiki (Feb 2025): French -> English only — [Kyutai blog](https://kyutai.org/2025/02/10/hibiki.html)
- Hibiki-Zero (Feb 2026, ICML 2026): French, Spanish, Portuguese, German -> English; no Hebrew; CC BY-NC-SA 4.0 (non-commercial); paper says it can adapt to a new input language with <1000 h of data — [HF model card](https://huggingface.co/kyutai/hibiki-zero-3b-pytorch-bf16); [arXiv 2602.11072](https://arxiv.org/html/2602.11072)

**Microsoft Azure**
- Azure Speech supports he-IL for speech-to-text — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)
- Live Interpreter (LLM-based, announced Sept 2025, auto language identification, 76 input languages / 143 locales): Hebrew is ✅ as **source**, but the **target** column is blank for Hebrew — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support); [Microsoft Tech Community announcement](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/-/4453649)
- Live Interpreter is described as public preview in the announcement but "Limited Access" in the Foundry catalog — [Foundry catalog](https://ai.azure.com/catalog/models/Azure-Speech-Speech-Translation)
- he-IL is on the Personal Voice list; Live Interpreter supports prebuilt voices and personal voice for output (access application required) — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)
- Azure lists Hebrew neural TTS voices (he-IL) — [json2video Azure Hebrew voice list](https://json2video.com/ai-voices/azure/languages/hebrew/)
- Pricing structure (amounts not retrievable — page showed "$-" placeholders): real-time speech translation per audio hour (includes 1 audio in/out + up to 2 text targets); Live Interpreter priced separately per input audio hour, output text per 1M chars, output audio per hour; billed in 1-second increments; neural TTS per 1M characters with 0.5M free chars/month on F0 — [Azure Speech pricing](https://azure.microsoft.com/pricing/details/speech/)

**Amazon**
- Amazon Transcribe supports he-IL for batch and streaming — [Transcribe supported languages](https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html)
- No Hebrew Polly voice found; users have been requesting one on re:Post — [AWS re:Post "Request for Hebrew"](https://www.repost.aws/questions/QU0xlQcZ8ZQqSHvU3PqhMRnQ/request-for-hebrew); [Polly voices](https://docs.aws.amazon.com/polly/latest/dg/available-voices.html)
- Nova 2 Sonic polyglot voices: English, French, Italian, German, Spanish, Portuguese, Hindi — no Hebrew — [Nova 2 Sonic language support](https://docs.aws.amazon.com/nova/latest/nova2-userguide/sonic-language-support.html)

**DeepL**
- DeepL Voice API language table: Hebrew has transcription (via external partner) and translation, but a dash for **translated speech** — [DeepL Voice supported languages](https://developers.deepl.com/docs/voice/supported-voice-languages); DeepL spec says some STT is processed by Cantab Research (Speechmatics) — [DeepL Pro Service Specification](https://www.deepl.com/nl/pro-service-specifications)
- April 2026 press release on Voice-to-Voice names Hebrew among DeepL Voice languages; the Voice-to-Voice API is in an early-access programme — [DeepL press release](https://www.deepl.com/en/press-release/deepl-unveils-real-time-spoken-translation-breaking-the-next-language-barrier-with-voice-to-voice)

**Palabra (vendor claims)**
- Speech-to-speech $0.04/min, STT $0.002/min, TTS $0.009/1K chars, $50 free credits; "less than a second delay" claimed — [Palabra API](https://www.palabra.ai/api); [Palabra pricing](https://www.palabra.ai/pricing)
- Hebrew page: Hebrew-to-English and to 60+ languages, streaming API with Python/JS SDKs; claims "98% accuracy" on Hebrew–English pairs (unverified) — [Palabra blog: Hebrew to English](https://blog.palabra.ai/real-time-ai-translation-from-hebrew-to-english/); online-meetings solution page — [Palabra meetings](https://www.palabra.ai/solutions/online-meetings-translation)

**Soniox (vendor claims)**
- Hebrew supported as both source and target for real-time translation with 60+ languages (3,600 pairs); transcript + translation streamed word-by-word on one connection; handles mid-sentence Hebrew/English switching — [Soniox Hebrew speech translation](https://soniox.com/speech-translation/hebrew); [English->Hebrew page](https://soniox.com/speech-translation/english/hebrew)
- Soniox claims OpenAI, Google and Azure list Hebrew only as a *source* language for real-time translation and that it is the only one supporting two-way — [Soniox Hebrew speech translation](https://soniox.com/speech-translation/hebrew). Note: this is contradicted for Google by Google's live-translate language table listing `he` — [Gemini API Live translate](https://ai.google.dev/gemini-api/docs/live-api/live-translate) — but consistent with OpenAI's 13-output list and Azure's Live Interpreter table.
- Soniox's translation output is text; Soniox comparison pages cite full speech-to-speech "with Soniox Text-to-Speech" at ~$0.82–0.88/hr — [Soniox translation pricing comparison](https://soniox.com/compare/translate/pricing); [Soniox speech AI pricing](https://soniox.com/compare-speech-ai-pricing)

**ElevenLabs / Deepgram / Speechmatics**
- ElevenLabs Scribe supports Hebrew; ElevenLabs cites Scribe v1 at 15.2% WER on FLEURS Hebrew; Scribe v2 Realtime covers "90+ languages" (Hebrew not explicitly named) — [ElevenLabs Hebrew STT](https://elevenlabs.io/nl/speech-to-text/hebrew); [ElevenLabs models](https://elevenlabs.io/docs/overview/models)
- Deepgram Nova-3 added Hebrew (monolingual, `he`, streaming + batch, keyterm prompting) in Feb 2026; improved Hebrew models Sept 2026 — [Deepgram blog](https://deepgram.com/blog/speech-to-text-for-hebrew-persian-urdu-on-nova-3); [Deepgram changelog Sept 3, 2026](https://developers.deepgram.com/changelog/2026/9/3)
- Speechmatics: Hebrew real-time and batch STT, no published Hebrew benchmark — [Speechmatics Hebrew](https://www.speechmatics.com/speech-to-text/hebrew); Soniox claims Hebrew WER 1.25% vs Speechmatics 1.71% (vendor comparison, dataset unspecified) — [Soniox vs Speechmatics Hebrew](https://soniox.com/compare-stt/soniox-vs-speechmatics/hebrew)

### Inferences
- **Hebrew -> English direction (user speaks)**: well served. Best dedicated options: OpenAI `gpt-realtime-translate` (interpreter-trained, $0.034/min) or Gemini 3.5 Live Translate (target `en`). Both are purpose-built, so less prompt fiddling.
- **English -> Hebrew direction (user listens)**: the hard direction. Viable real-time options are (a) Gemini 3.5 Live Translate with `targetLanguageCode: "he"` (listed but untested for Hebrew quality; preview), (b) a general voice LLM (`gpt-realtime-2`/`2.1`) prompted as a strict interpreter that speaks Hebrew, (c) Palabra S2S, or (d) a cascade: fast English STT -> LLM/MT -> Hebrew TTS (Azure he-IL neural, Google Chirp 3 HD he-IL, ElevenLabs v3). OpenAI's dedicated translate model, Azure Live Interpreter, DeepL Voice, Amazon, Seamless and Hibiki cannot output Hebrew speech.
- A single-vendor setup that covers both directions natively appears to be: Gemini 3.5 Live Translate (two sessions: one target `en`, one target `he`), Palabra, or a gpt-realtime-2 prompted interpreter. A mixed setup (OpenAI translate for HE->EN + Gemini Live Translate or a cascade for EN->HE) is likely the most robust.
- Google Meet's built-in speech translation would be the zero-engineering option if Hebrew is actually available in the user's account — but it is a Workspace (business) feature with rollout limits, and Hebrew's inclusion in the 63-language set is unconfirmed.
- For a user with weak English, the listening direction (English -> Hebrew) matters most for comprehension; a text-subtitle fallback (Hebrew captions) is cheaper and more reliable than Hebrew voice, and many engines (Soniox, DeepL, Seamless, Azure) can do English speech -> Hebrew text even when they can't speak Hebrew.

### Gaps
- No independent listening test of Hebrew speech output quality for Gemini 3.5 Live Translate, gpt-realtime-2/2.1, or Palabra was found; all quality claims are vendor or anecdotal. A hands-on test is required.
- Could not confirm whether Hebrew is among Google Meet's 63 speech-translation languages (full list unpublished); Meet Help page extract mentions Hebrew but page date/version unclear.
- Could not confirm whether Soniox's own TTS supports Hebrew voice output (needed for Soniox S2S English -> Hebrew).
- Azure prices could not be retrieved (pricing page values masked); whether Azure's classic (non-LLM) speech translation can synthesize Hebrew output voice directly was not confirmed from docs (inferred from he-IL TTS availability).
- `gpt-realtime-translate` latency figures not found in official sources; `gpt-realtime-2.1` changes vs 2 not verified.
- Microsoft Teams/other interpreter features out of scope; not checked.

## 2. Cascaded pipeline components for Hebrew (ASR, MT, TTS)

### Takeaway
For Hebrew ASR, the ivrit.ai fine-tuned Whisper models (large-v3-turbo, ~5.5% WER on ivrit eval-d1) are the strongest open option and run locally via faster-whisper; commercial streaming Hebrew ASR is available from Soniox, Deepgram Nova-3, Speechmatics, ElevenLabs Scribe, Azure, Google and Amazon Transcribe. MT is a solved-enough problem (LLMs, DeepL and Google all support Hebrew). The weak link is **Hebrew TTS**: unvocalized Hebrew text makes pronunciation ambiguous; the best commercial choices are Azure he-IL neural voices, Google Chirp 3 HD he-IL, and ElevenLabs Eleven v3 (Hebrew supported, but not in the low-latency Flash v2.5); open-source has improved sharply via Phonikud (real-time G2P + Piper-style TTS).

### Cited Findings

**ASR (Hebrew speech -> text)**
- ivrit.ai maintains a Hebrew transcription leaderboard on HF scoring models by WER on ivrit-ai/eval-d1, saspeech, FLEURS-he, Common Voice 17 he, and later hebrew_speech_kan; Whisper-v3-turbo results added later — [ivrit.ai leaderboard Space](https://huggingface.co/spaces/ivrit-ai/hebrew-transcription-leaderboard/tree/737d82ae29c0d17614d368eda84ec26a561335d3); [leaderboard commit](https://huggingface.co/spaces/ivrit-ai/hebrew-transcription-leaderboard/commit/6400e0fe25649ea7b990e92b94e341447f9ade67)
- Earlier snapshot: ivrit-ai/whisper-large-v2-d4 at 6.3% WER on eval-d1 and 24.2% on FLEURS Hebrew — [leaderboard commit](https://huggingface.co/spaces/ivrit-ai/hebrew-transcription-leaderboard/commit/6400e0fe25649ea7b990e92b94e341447f9ade67)
- ivrit.ai turbo model (809M) at 5.5% WER on eval-d1, 6.1% on eval-whatsapp, 8.10% on hebrew_speech_kan; stock whisper-small 29.93% on eval-d1 (third-party harness that reproduces the leaderboard on 40/40 pairs) — [Ozen-v1 model card](https://huggingface.co/itayinbar/Ozen-v1)
- ivrit.ai publishes `whisper-large-v3-turbo-ct2` (faster-whisper/CTranslate2, Apache-2.0), plus ONNX and GGML builds and a newer `whisper-large-v3-turbo_20250403_rc0-ct2` — [ivrit-ai/whisper-large-v3-turbo-ct2](https://huggingface.co/ivrit-ai/whisper-large-v3-turbo-ct2); [ivrit-ai models](https://huggingface.co/ivrit-ai/models)
- Interspeech 2025 paper on Hebrew ASR (ivrit.ai-related) — [Marmor et al., Interspeech 2025](https://www.isca-archive.org/interspeech_2025/marmor25_interspeech.pdf); HebDB weakly supervised Hebrew dataset — [arXiv 2407.07566](https://arxiv.org/pdf/2407.07566)
- A community Hebrew/English code-switching Whisper fine-tune exists ("Whisper-Hebrish") — [HF danielrosehill/Whisper-Hebrish](https://huggingface.co/danielrosehill/Whisper-Hebrish)
- ElevenLabs Scribe v1: 15.2% WER on FLEURS Hebrew (vendor-reported) — [ElevenLabs Hebrew STT](https://elevenlabs.io/nl/speech-to-text/hebrew)
- Deepgram Nova-3 Hebrew streaming; Deepgram claims real-time Hebrew STT under 300 ms; monolingual model (code-switching not advertised) — [Deepgram Hebrew](https://deepgram.com/product/speech-to-text/hebrew); [Deepgram blog](https://deepgram.com/blog/speech-to-text-for-hebrew-persian-urdu-on-nova-3)
- Soniox: real-time Hebrew STT with mid-sentence Hebrew/English switching (vendor claim) — [Soniox Hebrew STT](https://soniox.com/speech-to-text/hebrew)
- Google: Gemini live transcription `gemini-3.5-transcribe-live` supports he-IL — [Gemini Live transcribe](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe); Google Cloud STT language list — [Cloud STT languages](https://cloud.google.com/speech-to-text/docs/languages)
- Amazon Transcribe streaming he-IL — [AWS Transcribe languages](https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html); Azure STT he-IL — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)

**MT (text translation)**
- DeepL added Hebrew (with Vietnamese and Thai) to text translation — [DeepL blog](https://www.deepl.com/uk/blog/vietnamese-thai-hebrew-launch)
- SeamlessM4T v2 does Hebrew text translation (96 text languages) — [Seamless model card](https://huggingface.co/facebook/seamless-m4t-v2-large/blob/main/README.md?code=true)
- Soniox translation is billed by tokens: real-time $2.00/1M input text tokens, $4.00/1M output — [Soniox pricing](https://soniox.com/pricing)

**TTS (Hebrew text -> speech)**
- Azure: he-IL neural voices and he-IL Personal Voice — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support); [json2video Azure Hebrew voices](https://json2video.com/ai-voices/azure/languages/hebrew/)
- Google Cloud TTS Chirp 3: HD voices support he-IL (streaming PCM/OGG_OPUS/MULAW) — [Google Chirp 3 HD docs](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)
- ElevenLabs: Eleven v3 (70+/74 languages) includes Hebrew; Flash v2.5 (32 languages, ~75 ms latency) does not include Hebrew per Vapi table and ElevenLabs model lists (one cheat sheet conflicts) — [Vapi ElevenLabs table](https://docs.vapi.ai/providers/voice/elevenlabs); [BeyondWords language list](https://docs.beyondwords.io/docs-and-guides/voices/supported-languages); [ElevenLabs models](https://elevenlabs.io/docs/overview/models); conflicting: [Webfuse cheat sheet](https://www.webfuse.com/elevenlabs-cheat-sheet)
- ElevenLabs Eleven v4 / v4 Turbo advertised at 90+ languages (Hebrew not verified) — [ElevenLabs TTS API](https://elevenlabs.io/text-to-speech-api)
- Eleven v3: 5,000-char limit per request; speed control and Speaker Boost not available — [ElevenLabs playground docs](https://elevenlabs.io/docs/creative-platform/playground/text-to-speech)
- OpenAI `tts-1`/`tts-1-hd`: Hebrew has American accent in all six voices — [OpenAI forum](https://community.openai.com/t/tts-1-and-tts-1-hd-in-hebrew-has-an-american-accent/500307)
- Amazon Polly: no Hebrew voice — [AWS re:Post](https://www.repost.aws/questions/QU0xlQcZ8ZQqSHvU3PqhMRnQ/request-for-hebrew)
- Open source: Phonikud (June 2025, arXiv 2506.12311) is a Hebrew G2P producing fully specified IPA including stress; designed for real-time TTS such as Piper; small local TTS models with Phonikud input "approach large proprietary systems"; ships ONNX models and `phonikud-tts`; code CC BY 4.0; releases ILSpeech corpus — [arXiv 2506.12311](https://arxiv.org/abs/2506.12311); [Phonikud site](https://phonikud.github.io/); [phonikud-tts PyPI](https://pypi.org/project/phonikud-tts/)
- Phonikud project page lists Hebrew models built on BlueTTS, Chatterbox, ZipVoice, StyleTTS2 and Zonos and cites a 17-model WER/CER benchmark — [Explore Phonikud](https://phonikud.github.io/explore.html)
- Older open baselines (MMS-TTS, Robo-Shaul trained on the 30-hour single-speaker SASPEECH corpus) "often produce wrong and unnatural content" because they rely on diacritic prediction from unvocalized text — [HebTTS (Hebrew University)](https://pages.cs.huji.ac.il/adiyoss-lab/HebTTS); [arXiv 2407.12206](https://www.arxiv.org/pdf/2407.12206); [LoTHM, arXiv 2410.21502](https://arxiv.org/html/2410.21502v1); [SASPEECH, Interspeech 2023](https://www.isca-archive.org/interspeech_2023/sharoni23_interspeech.pdf)
- An informal comparison rated Chatterbox Hebrew voice cloning "Poor" (generic-sounding) — [Hebrew-TTS-Providers (GitHub)](https://github.com/danielrosehill/Hebrew-TTS-Providers)

### Inferences
- Best-quality cascaded EN->HE chain (cloud): streaming English STT (any major vendor; English is easy) -> fast LLM translation (GPT/Gemini/Claude, or DeepL) -> Azure he-IL neural or Google Chirp 3 HD he-IL TTS (both support streaming and are native Hebrew voices). ElevenLabs v3 is likely more expressive but is not its low-latency model.
- Best-quality cascaded HE->EN chain: ivrit.ai Whisper turbo (local) or Soniox/Deepgram (cloud) Hebrew STT -> LLM translation -> any low-latency English TTS (ElevenLabs Flash, OpenAI, Azure, etc.).
- LLM-based MT is advantageous for this use case because it can be instructed to keep names/terms, handle Hebrew/English code-switching, and output text with niqqud or unambiguous spelling for the TTS step.

### Gaps
- No side-by-side Hebrew TTS listening benchmark across Azure / Google Chirp 3 / ElevenLabs v3 / OpenAI found (the Phonikud 17-model benchmark results were not retrieved).
- Current ivrit.ai leaderboard numbers for commercial APIs (Soniox, Deepgram, Google Chirp, Azure) were not retrievable; vendor WER claims use undisclosed datasets.
- Whether Whisper large-v3 (stock) vs ivrit turbo differ on FLEURS-he in the latest snapshot: not retrieved.

## 3. Typical end-to-end latency, and known Hebrew-specific issues

### Takeaway
Hard latency numbers are scarce: Google published none for Gemini 3.5 Live Translate (one third-party measurement ~3 s behind the speaker); OpenAI's translate model deliberately waits for context like a human interpreter (no official figure found); Palabra claims <1 s; component latencies (Deepgram Hebrew STT <300 ms, ElevenLabs Flash ~75 ms but no Hebrew) suggest a well-built cascade lands around 1.5–3 s. Hebrew-specific issues: TTS pronunciation ambiguity from missing niqqud and stress, American-accented Hebrew in older OpenAI TTS, ASR degradation on accents/noise, monolingual ASR models that don't handle Hebrew/English code-switching, and voice/gender drift in Gemini Live Translate.

### Cited Findings
- Gemini 3.5 Live Translate: Google released no latency figures; the main number (~3 s behind speaker) comes from a LiveLingo launch-day measurement as reported in third-party coverage; other "sub-second" claims look like marketing — [AlphaSignal](https://alphasignal.ai/news/google-s-gemini-3-5-live-translate-brings-real-time-speech-translation-to-70); [aireiter](https://aireiter.com/blog/gemini-3-5-live-translate)
- OpenAI `gpt-realtime-translate` waits for enough context before speaking (interpreter-style); streams translated audio while input is still arriving — [OpenAI Cookbook](https://developers.openai.com/cookbook/examples/voice_solutions/realtime_translation_guide); a low-quality site's "sub-300 ms" claim should be disregarded (unsourced) — [needhelp.icu](https://needhelp.icu/blogs/openai-real-time-translation-api/)
- Palabra claims S2S "less than a second delay" (vendor) — [Palabra API](https://www.palabra.ai/api)
- Deepgram claims real-time Hebrew STT under 300 ms (vendor) — [Deepgram Hebrew](https://deepgram.com/product/speech-to-text/hebrew)
- ElevenLabs Flash v2.5 ~75 ms TTS latency, but Hebrew not supported in Flash — [ElevenLabs models](https://elevenlabs.io/docs/overview/models); [Vapi table](https://docs.vapi.ai/providers/voice/elevenlabs)
- Hebrew TTS: Modern Hebrew is written without vowels; older systems that predict diacritics produce "wrong and unnatural content"; Phonikud adds stress + full IPA to fix this — [HebTTS](https://pages.cs.huji.ac.il/adiyoss-lab/HebTTS); [Phonikud arXiv](https://arxiv.org/abs/2506.12311)
- OpenAI older TTS Hebrew sounds American-accented — [OpenAI forum](https://community.openai.com/t/tts-1-and-tts-1-hd-in-hebrew-has-an-american-accent/500307)
- Gemini Live Translate: voice shifts after long pauses, wrong gender, issues in rapid multi-speaker talk, language detection struggles with non-native accents and rapid switching — [Gemini API Live translate](https://ai.google.dev/gemini-api/docs/live-api/live-translate)
- Gemini Live 3.8 assistant: user reports misunderstanding basic Hebrew and random language switching mid-call — [Google AI Developers Forum](https://discuss.ai.google.dev/t/gemini-live-3-8-feels-like-a-regression-for-hebrew/185811)
- Code-switching: Deepgram's Hebrew model is monolingual — [Deepgram blog](https://deepgram.com/blog/speech-to-text-for-hebrew-persian-urdu-on-nova-3); Soniox advertises mid-sentence Hebrew/English switching — [Soniox Hebrew STT](https://soniox.com/speech-to-text/hebrew); Soniox says Speechmatics requires preselecting one language per request (vendor claim) — [Soniox vs Speechmatics](https://soniox.com/compare-stt/soniox-vs-speechmatics/hebrew)
- FLEURS Hebrew is a hard set: 24.2% WER for ivrit whisper-large-v2-d4 in an early leaderboard snapshot vs 6.3% on ivrit eval-d1 — [leaderboard commit](https://huggingface.co/spaces/ivrit-ai/hebrew-transcription-leaderboard/commit/6400e0fe25649ea7b990e92b94e341447f9ade67)

### Inferences
- Expect ~2–4 s lag for dedicated S2S translators (interpreter-style buffering) and ~1.5–3 s for a tuned cascade (VAD end-of-utterance + STT final + LLM first tokens + TTS first audio). This is workable for turn-taking conversation but not for rapid back-and-forth; users should speak in short complete sentences and pause.
- Hebrew/English code-switching (English tech terms inside Hebrew speech) is common for Israeli speakers; prefer ASR that handles mixed language (Soniox, Gemini, OpenAI) or ivrit.ai Whisper (which sees mixed data) over monolingual models.
- Two simultaneous translation streams in a call create echo/feedback risk (translated voice re-captured by the other direction's input); audio routing (virtual cables, separate devices) matters as much as engine choice. This is an engineering inference, not sourced.

### Gaps
- No official latency numbers for gpt-realtime-translate, gpt-realtime-2, Azure Live Interpreter, or Soniox S2S.
- No measured end-to-end latency for any Hebrew-specific pipeline found.
- No quantitative Hebrew TTS mispronunciation rates for commercial voices.

## 4. Pricing for a ~1 hour two-way call

### Takeaway
Dedicated cloud S2S engines cost roughly **$2–2.50 per direction-hour**, so about **$4–5 for a 1-hour two-way call** if both streams are billed for the full hour (less if billing is only on speech). Soniox (vendor numbers) is cheapest at under $1 per direction-hour; general voice LLMs (gpt-realtime-2) are token-billed and likely more expensive. Local pipelines are free after hardware.

### Cited Findings
- OpenAI `gpt-realtime-translate`: $0.034/min input audio -> $2.04 per hour of input audio — [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-realtime-translate); [OpenAI community](https://community.openai.com/t/new-realtime-voice-models-in-the-api/1380471)
- OpenAI `gpt-realtime-whisper` (streaming STT): $0.017/min — [OpenAI community](https://community.openai.com/t/new-realtime-voice-models-in-the-api/1380471)
- OpenAI `gpt-realtime-2`: $32/1M audio input tokens, $64/1M audio output tokens (no per-minute figure published) — [OpenAI gpt-realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)
- Gemini 3.5 Live Translate: $3.50/1M input tokens, $21.00/1M output tokens at 25 tokens/s of audio ≈ $0.0053/min in + $0.0315/min out ≈ $0.037/min — [ai-cost-estimator](https://ai-cost-estimator.com/blog/gemini-3-5-live-translate-developer-pricing-api); [ChatForest](https://chatforest.com/builders-log/gemini-3-5-live-translate-speech-to-speech-70-languages-live-api-builder-guide/); a conflicting $0.023/min figure appears in [Enterprise DNA](https://enterprisedna.co/resources/news/google-gemini-35-live-translate-enterprise-multilingual-2026/) without explanation
- Palabra: $0.04/min S2S ($2.40/hr) — [Palabra pricing](https://www.palabra.ai/pricing)
- Soniox: real-time STT $0.12/hr; real-time speech-to-text translation ~$0.18/hr; S2S with Soniox TTS ~$0.82–0.88/hr (vendor comparison pages conflict slightly) — [Soniox pricing](https://soniox.com/pricing); [Soniox translate pricing comparison](https://soniox.com/compare/translate/pricing); [Soniox speech AI pricing](https://soniox.com/compare-speech-ai-pricing)
- Azure: billed per audio hour (speech translation, Live Interpreter) and per 1M characters (TTS); actual dollar values not retrievable; 0.5M free neural TTS characters per month on free tier — [Azure Speech pricing](https://azure.microsoft.com/pricing/details/speech/)

### Inferences
- 1-hour call, both directions billed for 60 min each: OpenAI translate (HE->EN only) ≈ $2.04 + an EN->HE engine; Gemini Live Translate ×2 ≈ $4.40 (output tokens only accrue while translated speech is produced, so realistic cost is likely lower); Palabra ×2 ≈ $4.80; Soniox S2S ×2 ≈ $1.65–1.76 (if Hebrew TTS available).
- A cascade of Deepgram/Soniox STT + an LLM (few thousand tokens) + Azure/Google Hebrew TTS (perhaps 30–40K characters of translated speech per hour) would plausibly cost on the order of $1–3 per hour; exact figure depends on Azure/Google TTS per-character rates not retrieved here.
- For a single 1-hour call, cost is negligible relative to setup effort; quality and latency should drive the choice.

### Gaps
- Azure and Google Cloud TTS per-character prices and Azure speech-translation hourly rates not retrieved (masked pricing pages).
- gpt-realtime-2 per-minute audio cost not computable without an official tokens-per-minute figure.
- Whether streams are billed during silence (continuous WebSocket) varies by vendor; not confirmed.

## 5. Can anything run fully locally on a consumer PC/Mac with acceptable Hebrew quality?

### Takeaway
No single open-weights end-to-end model does Hebrew<->English speech-to-speech (Seamless lacks Hebrew speech output; Hibiki has no Hebrew). A fully local **cascade** is feasible: ivrit.ai Whisper large-v3-turbo (faster-whisper/GGML) for Hebrew ASR + stock Whisper for English ASR, a local LLM or NLLB/Seamless for translation, and Phonikud-based Piper-style TTS for Hebrew + any English local TTS. Quality would likely be below the cloud options (especially Hebrew TTS naturalness and translation fluency), and latency depends heavily on GPU/Apple Silicon.

### Cited Findings
- ivrit.ai Whisper turbo available as CTranslate2 (faster-whisper), ONNX and GGML builds, Apache-2.0; ~5.5% WER on ivrit eval-d1 — [ivrit-ai/whisper-large-v3-turbo-ct2](https://huggingface.co/ivrit-ai/whisper-large-v3-turbo-ct2); [ivrit-ai models](https://huggingface.co/ivrit-ai/models); [Ozen-v1 card](https://huggingface.co/itayinbar/Ozen-v1)
- Third-party CT2 conversion of an ivrit checkpoint (d4) claims "significantly faster inference" — [israelisraeli/ivrit-faster-whisper-turbo-d4](https://huggingface.co/israelisraeli/ivrit-faster-whisper-turbo-d4)
- Phonikud: real-time Hebrew G2P, ONNX models, works with Piper-style real-time TTS; small local models "approach large proprietary systems" (authors' claim) — [arXiv 2506.12311](https://arxiv.org/abs/2506.12311); [Phonikud site](https://phonikud.github.io/); [phonikud-tts](https://pypi.org/project/phonikud-tts/)
- SeamlessM4T v2 (local) can do Hebrew speech -> English speech and English speech -> Hebrew **text**, but not Hebrew speech output — [Seamless model card](https://huggingface.co/facebook/seamless-m4t-v2-large/blob/main/README.md?code=true)
- Hibiki-Zero (local, 3B) does not support Hebrew; non-commercial license — [Hibiki-Zero card](https://huggingface.co/kyutai/hibiki-zero-3b-pytorch-bf16)
- Older open Hebrew TTS (MMS, Robo-Shaul) frequently mispronounce due to diacritic issues — [HebTTS](https://pages.cs.huji.ac.il/adiyoss-lab/HebTTS)

### Inferences
- Realistic local stack (Apple Silicon M-series with 16GB+ or an NVIDIA GPU): VAD -> ivrit.ai Whisper turbo (Hebrew) / Whisper turbo (English) -> local LLM (e.g., a 7–12B instruct model) for translation -> Phonikud + Piper (Hebrew) / Piper or Kokoro (English). Expected end-to-end lag likely 2–5 s on good hardware; CPU-only machines would struggle to run two directions concurrently.
- Recommended framing for the report: local is viable for privacy/offline but is a hobbyist build with lower Hebrew voice quality; for an important live call the cloud options are more reliable.
- Overall recommendation for the engine layer: Hebrew->English via OpenAI `gpt-realtime-translate` or Gemini 3.5 Live Translate (target `en`); English->Hebrew via Gemini 3.5 Live Translate (target `he`) if its Hebrew voice tests well, otherwise a cascade ending in Azure he-IL or Google Chirp 3 HD he-IL TTS (or ElevenLabs v3), with Hebrew captions as a fallback. Test Palabra as a single-vendor alternative. Check first whether the user's Google Meet account already offers built-in Hebrew speech translation (zero engineering).

### Gaps
- No measured local end-to-end latency/quality numbers for a Hebrew<->English local pipeline found.
- Seamless license and streaming (SeamlessStreaming) Hebrew input behavior not verified in this session.
- Whether NLLB/Seamless text MT or a local LLM gives better Hebrew<->English quality was not benchmarked here.
