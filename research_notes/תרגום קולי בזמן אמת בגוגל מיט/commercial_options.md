# Commercial real-time voice-to-voice interpretation for a Hebrew <-> English Google Meet call (as of Nov 2026)

Research method note: WebFetch was blocked by this session's network allowlist (support.google.com, palabra.ai, chromeunboxed.com all failed to resolve), so every finding below comes from WebSearch result summaries of the cited pages, not from reading the full pages. Official language lists (Google Meet help, DeepL Voice languages, Palabra pricing) were seen only through those summaries. Treat exact numbers as "reported by the cited page", and re-check before paying.

## Q1. Google Meet's own speech translation: Hebrew support, plans, and common complaints

### Takeaway
Hebrew voice-to-voice translation in Google Meet is new: it arrived only with the Gemini 3.5 Live Translate expansion to 63 languages, rolling out from 22 Oct 2026 with a second rollout stage from 2 Nov 2026. Before that (May 2025 to Oct 2026), Meet speech translation covered only English paired with Spanish, French, German, Portuguese, Italian (and Hindi per some sources), so a user who tested earlier, or whose account had not yet received the staged rollout, would not have had Hebrew voice at all. Even with Hebrew, it needs a paid AI plan, has per-meeting time caps, a 1 to 3 second (sometimes much longer) lag, and inconsistent voice and accuracy.

### Cited Findings
**Timeline and language coverage**
- Announced at Google I/O May 2025; early coverage named English and Spanish as the launch languages. — [TechCrunch](https://techcrunch.com/2025/05/20/google-meet-is-getting-real-time-speech-translation); [9to5Google](https://9to5google.com/2025/05/20/google-meet-speech-translation/)
- Generally available to select Workspace business plans in late Jan / Feb 2026. The Feb 2026 post lists add-ons including Google AI Ultra for Business and Google AI Pro for Education. — [Google Workspace Updates, Feb 4 2026](https://workspaceupdates.googleblog.com/2026/02/speech-translation-meet-ga.html)
- Rolled out to mobile devices in April 2026. — [Google Workspace Updates, Apr 8 2026](https://workspaceupdates.googleblog.com/2026/04/speech-translation-in-google-meet-is-now-rolling-out-to-mobile-devices.html)
- Pre-expansion, translation was English-anchored and bidirectional with Spanish, French, German, Portuguese and Italian, one pair per meeting. Google's help page (older version) listed English with French, German, Hindi, Italian, Portuguese, Spanish. — [Intermind blog](https://intermind.com/blog/google-meet-live-translation); [Maestra summary of Google help page](https://maestra.ai/blogs/google-meet-real-time-speech-translation)
- October 2026: Workspace Updates post says Meet speech translation expanded to 63 languages with automatic language detection, and participants can translate between any combination of supported languages in the same meeting; listening is supported on web, Android, iOS and Meet hardware. — [Google Workspace Updates, Oct 2026](https://workspaceupdates.googleblog.com/2026/10/real-time-speech-translation-in-google-Meet-expands-to-63-languages-with-automatic-language-detection.html); [Android Headlines, Nov 2026](https://www.androidheadlines.com/2026/11/google-meet-speech-translation-expansion-63-languages.html)
- Hebrew: Geektime reports the 63-language, bidirectional feature (built on Gemini 3.5 Live Translate) includes Hebrew, and its testers found translation "fairly good". Headline: "Google Meet's translation feature finally supports Hebrew, and it's pretty crazy". — [Geektime](https://www.geektime.co.il/google-meet-live-translate-now-supports-hebrew/)
- News1: Google began rolling out Hebrew voice translation in Meet on 22 Oct 2026, with a further rollout stage starting 2 Nov 2026. Translation is heard in (an approximation of) the participant's own voice; the original speaker's volume is lowered and the translation plays after a delay of "a second or two"; works on desktop and Meet apps for Android/iPhone. — [News1](https://www.news1.co.il/Archive/001-D-526224-00.html)
- Google has not published the full list of 63 languages in the secondary sources; reporting names e.g. Arabic, Turkish, Swahili, Chinese, Japanese, Korean. — [Glitchwire](https://glitchwire.com/news/google-meet-speech-translation-expands-to-63-languages-dropping-the-one-pair-con/)
- The Hebrew-language Google help page for speech translation exists (support.google.com/meet/answer/16221730?hl=iw); a search summary reported Hebrew listed for speech translation there, but the page could not be opened directly. — [Google Meet Help (Hebrew)](https://support.google.com/meet/answer/16221730?hl=iw&authuser=5&ref_topic=14073938)
- Separate older feature: Hebrew live captions (transcription) in Meet were limited to Google One plans with 2TB+ when launched (article ~438 days old). Translated captions (text, not voice) cover roughly 65 to 90+ languages, depending on the source. — [Geektime (captions)](https://www.geektime.co.il/google-meet-adds-live-captions-in-hebrew/); [newey.ai](https://newey.ai/blog/google-meet-translated-captions); [Intermind](https://intermind.com/blog/google-meet-live-translation)

**Plans and limits**
- Eligibility after the expansion: consumers on Google AI Pro and AI Ultra, plus Google Workspace customers with "AI Expanded Access" or "AI Ultra Access" (and some education plans). — [NewsBytes](https://www.newsbytesapp.com/news/science/google-meet-expands-real-time-translation-to-63-languages/story); [Android Authority](https://www.androidauthority.com/google-meet-real-time-translation-3726963/)
- Time cap: base Workspace plans and Google AI Pro allow up to 90 minutes of translation per meeting; higher tiers (AI Ultra / AI Expanded Access) up to 8 hours. — [Android Authority](https://www.androidauthority.com/google-meet-real-time-translation-3726963/); [Intermind](https://intermind.com/blog/google-meet-live-translation)
- Not available in live streams, meeting recordings, client-side-encrypted meetings, dial-in or third-party interop calls, or with adaptive audio. Meeting-room hardware users can hear translations but cannot have their own speech translated. — [Glitchwire](https://glitchwire.com/news/google-meet-speech-translation-expands-to-63-languages-dropping-the-one-pair-con/); [Slator](https://slator.com/google-meet-live-translation/)
- Workspace admins must enable it (Admin console > Gemini settings > Speech translation). — [Google Workspace Admin Help](https://knowledge.workspace.google.com/admin/meet/turn-speech-translation-on-or-off-for-meet)

**Quality / latency complaints**
- Slator's informal test in the January 2026 beta measured a "noticeable ~10 seconds" latency; 53.9% of Slator readers polled said it is not ready for prime time. — [Slator](https://slator.com/google-meet-live-translation/)
- Google's own help page says translations are "a few seconds delayed for completeness"; Google engineers describe a target "sweet spot" of 2 to 3 seconds. — [Google blog: How AI made Meet's translation possible](https://blog.google/products-and-platforms/products/workspace/google-meet-langauge-translation-ai/); [Google Meet Help](https://support.google.com/meet/answer/16221730?hl=en)
- Google's help page warns the translated voice style may be inconsistent, especially when different people speak, and quality degrades on a weak internet connection. — [Google Meet Help (Hebrew)](https://support.google.com/meet/answer/16221730?hl=iw&authuser=5&ref_topic=14073938)
- A reviewer found translations often inaccurate compared with Google Translate. — [Medium review](https://oh-yeah-sarah.medium.com/a-review-of-google-meets-live-translation-tool-342c0d5af01c)
- A hands-on test found the translation arrives about half a beat after the sentence ends (i.e., it waits for sentence completion). — [Tinrec](https://tinrec.com/en/blog/13497)
- Overlapping speech causes problems; a guide advises waiting for the translation indicator above the speaker's tile to disappear before replying (attribution from search summary). — [JotMe guide](https://www.jotme.io/blog/auto-translate-google-meet)
- Geektime also ran an opinion piece titled roughly "Google's new voice translation will erase the advantage of English speakers, but there's a catch" (content not retrieved). — [Geektime](https://www.geektime.co.il/google-meet-ai-real-time-translation-economy/)

### Inferences
- The most likely reasons the user found Meet insufficient: (a) they tested before Hebrew voice existed (pre-22 Oct 2026) or before the staged rollout reached their account; (b) the inherent "wait for end of sentence, then speak" delay of 1 to 3+ seconds breaks natural back-and-forth; (c) synthetic voice/voice-match inconsistencies and occasional mistranslations; (d) plan friction (AI Pro/Ultra or Workspace AI add-on needed; 90-minute cap on lower tiers); (e) Hebrew is newly supported and likely less polished than the original English-Spanish pair.
- It is worth one re-test now (late Nov 2026), on a Google AI Pro/Ultra or eligible Workspace account, with turn-taking discipline (short sentences, pause for the translation), before paying for a third-party tool.

### Gaps
- Could not directly read Google's official 63-language list to confirm Hebrew independently of Geektime/News1 (support.google.com blocked).
- No independent Hebrew-specific accuracy or latency benchmark found.
- Unclear whether both participants need an eligible plan or only the one who turns translation on; not found in sources.
- Current price of Google AI Pro / Workspace AI add-ons in Israel not verified.

## Q2. Dedicated commercial products: Hebrew support, Meet integration, voice vs subtitles, latency, pricing

### Takeaway
Very few commercial tools combine all three requirements (Hebrew in both directions, synthesized voice output, and working inside Google Meet). The strongest documented match is Palabra.ai (Meet bot, Hebrew speech-to-speech, self-serve, per-minute pricing with free credits). DeepL Voice for Meetings supports Hebrew and Meet but Hebrew speech output was still beta. Timekettle W4/W4 Pro supports Hebrew online-only via hardware earbuds, with mixed reliability reports. Microsoft Teams Interpreter, Zoom voice translation, Apple Live Translation, Pixel Voice Translate, and Felo Translator do not support Hebrew; Samsung's list is unconfirmed for Hebrew. Wordly, KUDO, Interprefy, Maestra are event-oriented and Hebrew voice support was not verified.

### Cited Findings

#### Palabra.ai (best-documented Hebrew + Meet + voice fit)
- Meet integration: you add a Palabra agent (bot) to the Meet call; it translates speech both ways; participants install nothing; audio processed in memory and not stored (vendor claims). — [Palabra: Google Meet agent](https://www.palabra.ai/agent-google-meet); [Palabra: Google Meet solution](https://palabra.ai/solutions/google-meet)
- Hebrew: vendor page specifically for Hebrew-to-English real-time speech-to-speech and captions; claims 98% accuracy for Hebrew-English (unverified vendor claim); 60+ languages (another page says 1000+ language pairs). — [Palabra blog: Hebrew to English](https://blog.palabra.ai/real-time-ai-translation-from-hebrew-to-english/)
- Voice: automatic voice cloning to match the speaker (vendor claim). — [Palabra](https://www.palabra.ai/)
- Latency: vendor claims under 1 second. An independent developer benchmark of 30+ voice AI engines measured about 800 ms for Palabra (their own prototype ~870 ms to first audio), framed as "faster than Google Meet". — [Palabra](https://www.palabra.ai/agent-google-meet); [ai.gopubby benchmark](https://ai.gopubby.com/i-benchmarked-30-voice-ai-engines-and-built-a-real-time-translator-faster-than-google-meet-e6a160def969?gi=35a55d5ef86a)
- A Medium review warns the multi-stage pipeline (ASR, translation, TTS, network) has several failure points and urges testing under real network conditions before paying. — [Medium: Palabra.ai review 2026](https://medium.com/@trelvek/palabra-ai-review-2026-the-real-time-translation-caveats-id-test-before-paying-2dee99ce86ae)
- Pricing (official page per search summary): speech-to-speech $0.04/min; $50 free credits on sign-up; Starter subscription $45/month for 3 hours. — [Palabra pricing](https://www.palabra.ai/pricing)
- Conflicting third-party pricing: Meetings plans from $60/month and API $0.04/min ([MarkTechPost, Oct 2026](https://www.marktechpost.com/2026/10/12/top-12-ai-live-translation-tools-2026/)); 30-minute free trial, then $29 to $99/month, or $150/month with 7-day trial on other aggregators ([Capterra](https://www.capterra.com/p/10041210/Palabra-ai/); [GetApp](https://www.getapp.com/website-ecommerce-software/a/palabra-ai/); [aimojo](https://aimojo.io/tools/palabra-ai/)).
- Talo (another live-translation tool) reportedly joined the Palabra ecosystem via acquisition (Palabra's own blog). — [Palabra blog: Hebrew translator apps](https://blog.palabra.ai/al-speech-translation/7-best-hebrew-translator-apps-for-2026-free-paid/)

#### DeepL Voice for Meetings
- Works in Microsoft Teams, Zoom and Google Meet; voice-to-voice in online meetings requires the DeepL desktop app. — [DeepL Support: About DeepL Voice for Meetings](https://support.deepl.com/hc/en-us/articles/16810100955676-About-DeepL-Voice-for-Meetings); [DeepL Voice for Meetings](https://www.deepl.com/en/products/voice/deepl-voice-for-meetings)
- Hebrew is in the DeepL Voice language set (added alongside the 24 EU languages, total 40+). — [heise](https://www.heise.de/en/news/DeepL-becomes-real-time-translator-11262244.html); [PR Newswire](https://www.prnewswire.com/news-releases/deepl-unveils-real-time-spoken-translation-breaking-the-next-language-barrier-with-voice-to-voice-302744050.html)
- For Hebrew, transcription and translated speech are provided by external partners (translation by DeepL); partners cannot auto-detect the source language, so it must be set explicitly. Changelog (22 Sep entry) says Hebrew translated speech generation began in beta; no later GA entry found. — [DeepL docs: Supported Voice Languages](https://developers.deepl.com/docs/voice/supported-voice-languages); [DeepL changelog](https://developers.deepl.com/docs/resources/roadmap-and-release-notes)
- Only "Voice for Conversations" (mobile/web) was confirmed GA at the voice-to-voice launch; meeting components were in early access. Some 2026 third-party roundups claim meeting voice-to-voice became GA in Sept 2026 (conflicting). — [PR Newswire](https://www.prnewswire.com/news-releases/deepl-unveils-real-time-spoken-translation-breaking-the-next-language-barrier-with-voice-to-voice-302744050.html); [TheNextWeb](https://thenextweb.com/news/deepl-voice-to-voice-real-time-spoken-translation); [TechCrunch Apr 2026](https://techcrunch.com/2026/04/16/deepl-known-for-text-translation-now-wants-to-translate-your-voice/)
- Plans named Voice Starter, Voice Business, Voice for Meetings - Business; a trial page exists. No prices found. — [DeepL Support (plans)](https://support.deepl.com/hc/articles/29861723462812); [DeepL Voice for Meetings trial](https://www.deepl.com/en/c/products/voice/deepl-voice-for-meetings-trial)

#### Timekettle (hardware earbuds + app)
- W4 AI Interpreter Earbuds: 52 languages / 106 accents; Hebrew marked available online only (not offline). Offline limited to ~13 pairs. Counts conflict across Timekettle pages (40 to 54 languages). — [Timekettle W4](https://www.timekettle.co/products/w4-ai-interpreter-earbuds); [Timekettle W4 Pro](https://www.timekettle.co/products/w4-pro-ai-interpreter-earbuds); [Timekettle language list](https://www.timekettle.co/pages/language-supported)
- X1 AI Interpreter Hub / X1 Meeting Interpreter Hub: Hebrew online-only. — [X1 AI Interpreter Hub](https://www.timekettle.co/products/x1-ai-interpreter-hub); [X1 Meeting Interpreter Hub](https://www.timekettle.co/products/x1-meeting-interpreter-hub)
- W4 Pro call mode: both sides speak their native language; works with WhatsApp, WeChat or cellular calls; "both sides hear the original voice and the real-time translation in their own language during voice calls or virtual meetings". — [Timekettle W4 Pro phone call page](https://www.timekettle.co/pages/w4-pro-phone-call)
- Reviews: positive video-call test with a foreign client ([Cybernews](https://cybernews.com/reviews/timekettle-w4-pro-ai-interpreter-earbuds-review/)); SoundGuys lists real-time phone call translation and floating subtitles for video ([SoundGuys](https://www.soundguys.com/best-translation-earbuds-2-152438/)). Negative: Trustpilot users report voice-call translation failing, 5 to 9 second delays, and working well only ~60% of the time ([Trustpilot](https://www.trustpilot.com/review/www.timekettle.co); [besttranslationearbuds.com](https://besttranslationearbuds.com/timekettle/w4-pro-review/)).
- Exact setup for Google Meet on a computer was not documented in sources found.

#### Microsoft Teams Interpreter agent
- Supports 9 speaking/listening languages: Mandarin Chinese, English, French, German, Italian, Japanese, Korean, Brazilian Portuguese, Spanish. No Hebrew. Unsupported caption languages fall back to English. Consecutive mode covers 10 languages, also no Hebrew. Teams-only. — [Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/interpreter-agent-teams); [Microsoft Support](https://support.microsoft.com/en-us/topic/c7efe2bb-535d-42ab-a5c4-d2d91619b46d); [Microsoft 365 Insider (consecutive)](https://techcommunity.microsoft.com/t5/microsoft-365-insider-blog/converse-naturally-across-languages-with-consecutive/ba-p/4514327)

#### Zoom
- Voice translation: English, Chinese, Spanish, French, Japanese; Portuguese, Arabic, German, Italian planned later in 2026. No Hebrew. Zoom-only. — [Zoom blog: Live voice translation](https://www.zoom.com/en/blog/voice-translation-zoom/)
- Translated captions (text): ~35 to 36 languages; requires Business Plus / Enterprise Plus or add-on. Community posts indicate English-to-Hebrew translated captions exist (anecdotal); Hebrew missing from AI summary language. Zoom partnered with Israeli Sumit-AI for Hebrew transcription. — [Zoom blog: Translated captions](https://www.zoom.com/en/blog/translated-captions); [Zoom Community](https://community.zoom.com/t5/Zoom-Meetings/Caption/m-p/170286); [Zoom Community (AI summary no Hebrew)](https://community.zoom.com/meetings-2/ai-meeting-summary-transcript-language-does-not-support-hebrew-81650); [Zoom + Sumit-AI](https://news.zoom.com/zoom-and-sumit-ai-partner-to-bring-advanced-ai-hebrew-transcriptions-to-users/)

#### Apple Live Translation (iOS 26, FaceTime / Phone / AirPods)
- FaceTime gives live translated captions (you still hear the original voice); Phone calls and AirPods give spoken translation. — [Apple Newsroom, Sep 2025](https://www.apple.com/newsroom/2025/09/new-apple-intelligence-features-are-available-today/)
- Languages as of Nov 2025: English (US, UK), French, German, Italian, Japanese, Korean, Portuguese (Brazil), Spanish, Mandarin (simplified and traditional). No Hebrew; one-on-one calls only. No 2026 expansion found. Not usable inside Google Meet. — [Apple Newsroom (Ireland), Nov 2025](https://www.apple.com/ie/newsroom/2025/11/live-translation-on-airpods-expands-to-the-eu/)

#### Samsung Galaxy AI Live Translate (calls)
- Expanded to 24 languages (Hungarian and Malay added), newsroom dated 14 Oct 2026; Hebrew not mentioned in any list found; regional pages show older counts (9, 13, 22). Phone calls only, not Meet. — [Samsung Newsroom AU](https://news.samsung.com/au/samsung-expands-language-support-across-ai-experiences-on-galaxy); [Samsung Newsroom Global](https://news.samsung.com/global/samsung-expands-language-support-across-ai-experiences-on-galaxy); [Samsung Levant guide](https://www.samsung.com/levant/support/mobile-devices/galaxy-ai-languages-usage-guide/)

#### Google Pixel Voice Translate (calls)
- Pixel 10/11 call languages: French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, Russian, Spanish, Swedish, each to/from English. No Hebrew. Phone calls / compatible apps only. — [Pixel Phone Help](https://support.google.com/pixelphone/answer/16477051?hl=en); [Google Store](https://store.google.com/us/magazine/pixel-live-translate?hl=en-US)

#### Wordly, KUDO, Interprefy (event / enterprise platforms)
- Integration: Interprefy's AI agent works with Teams, Zoom and Google Meet without kit installation; KUDO offers a Meet widget; Wordly connects to Zoom, Teams, Meet and Webex. — [Maestra comparison](https://maestra.ai/blogs/best-real-time-translators-for-meetings); [JotMe: Google Meet tools](https://www.jotme.io/blog/6-best-live-translation-tools-for-google-meet)
- Language counts: Interprefy AI ~80 to 82, Wordly 60+, KUDO AI 60+ or 77 (up to 32 per meeting). KUDO offers male/female AI voices. — [Maestra: KUDO alternatives](https://maestra.ai/blogs/kudo-alternatives); [Intermind conference tools](https://intermind.com/blog/best-ai-conference-translation-tools)
- Pricing: Wordly ~ $1,500 per 10 hours (third-party); KUDO and Interprefy quote-based; KUDO AI plans are sales-led, so cannot be bought and started the same day; one estimate of KUDO event-tier AI at $0.80 to $1.25 per source-audio minute. — [Maestra](https://maestra.ai/blogs/best-real-time-translators-for-meetings); [Fora Soft vendor benchmarks](https://www.forasoft.com/blog/article/real-time-speech-translation-vendor-benchmarks)

#### Maestra Live
- AI voice + captions in 100+ (or 125+) languages alongside Zoom, Teams, Google Meet; listeners pick a channel on their own phone; Chrome extension available; plans from ~$15/month (another source: 49). Hebrew not confirmed in sources found. All vendor-produced. — [Maestra Live](https://live.maestra.ai/); [Maestra live meeting translation](https://maestra.ai/tools/real-time-translator/live-meeting-translation); [Chrome Web Store](https://chromewebstore.google.com/detail/live-voice-translation-tr/ldocnolbfcoiidallliboelnfpkdlgjm)

#### Felo
- Felo Translator (voice app) supports 15 to 16 languages; Felo's own blog states Hebrew and Arabic are NOT supported as translation languages. Felo Subtitles (a different, subtitle-only product) lists Hebrew among 43 speech-recognition languages. — [Felo blog: 15 languages](https://felo.me/blog/felo-translator-15-languages-explained); [Felo Subtitles](https://subtitles.felo.me/en)

#### Pinch
- startpinch.com: usage-based, $0.04/min Pinch Desktop, $0.02/min API, $0.02/min per participant for Pinch Rooms; $5 free credit; no subscription. Hebrew not confirmed. — [Pinch pricing](https://startpinch.com/pricing)
- A different "Pinch Voice Translation" Mac app (Duo Labs) works with Zoom/Teams/Meet, $29 to $49/month, listed languages exclude Hebrew. — [AlternativeTo](https://alternativeto.net/software/pinch--voice-translation/about)

#### Byrdhouse (now Langfinity)
- Rebranded Langfinity, claims 100+ languages; free Starter with 30 minutes for 2 attendees per call; paid from ~$254/month (third-party); Chrome extension with free minutes. Hebrew not confirmed. — [Product Hunt](https://www.producthunt.com/products/byrdhouse); [SourceForge](https://sourceforge.net/software/product/Byrdhouse/); [Chrome Web Store](https://chromewebstore.google.com/detail/real-time-video-audio-tra/cbokniolkggbjffkamfkloblcjckdohp?hl=en-US)

#### Whisperr (whisperr.co, Hebrew-language site)
- Claims live Hebrew <-> English voice translation at ~0.2 s latency (implausibly low, vendor claim), free start, unlimited use on a flat annual plan; teams $29/member/month or $120/member/year. Works "alongside" Zoom/Teams/Meet from the audio; does not plug into the meeting app. Company origin not confirmed. — [Whisperr: Hebrew to English](https://whisperr.co/live-translate/hebrew-to-english/); [Whisperr: meeting use case](https://whisperr.co/use-cases/meeting-interpreter-alternative/)

#### Other caption-first tools
- JotMe: translated captions across Zoom/Teams/Meet without a bot; MicWrite: captures mic + system audio to translate both sides; mostly captions. Vendor-written comparisons. — [JotMe](https://www.jotme.io/blog/best-live-translation); [MicWrite](https://micwrite.com/blog/best-real-time-translation-apps)
- InterMIND: its own meeting platform with translation; free Basic plan; Pro ~ $10 to $20/user/month (conflicting). — [G2](https://www.g2.com/products/intermind/pricing); [InterMIND FAQ](https://intermind.com/faq)

#### Israeli startups
- No Israeli startup offering Hebrew <-> English live voice-to-voice for video calls was found. Closest: Deepdub (Tel Aviv) launched a real-time AI voice model (Hebrew supported) for dubbing and voice agents, not calls; Rylo (formerly Nagish) does real-time captions for phone calls and sign-language AI; Barvox converts atypical speech. — [israel.com: Deepdub](https://israel.com/business/tel-aviv-startup-deepdub-introduces-real-time-ai-voice-model-for-global-enterprises/); [Techwire: Rylo](https://www.techwire.co.il/en/article/rylo-nvidia-sign-language-ai); [i24NEWS: Barvox](https://www.i24news.tv/en/news/innov-nation/artc-israeli-startup-uses-ai-to-give-a-voice-to-people-with-speech-difficulties)

### Inferences
- Confirmed "no Hebrew" (rule out): Microsoft Teams Interpreter, Zoom voice translation, Apple Live Translation, Pixel Voice Translate, Felo Translator, Pinch (Duo Labs Mac app). Samsung Live Translate: unconfirmed and probably absent. Of these, only Google Meet itself covers Hebrew voice among the big-platform native features.
- Phone-OS features (Apple, Samsung, Pixel) only work on native phone calls anyway, not inside a Meet browser session, so they are not a fit even if Hebrew were added.
- The Meet-bot approach (Palabra, DeepL, Interprefy, KUDO) means the other side does not need to install anything, which matters for a business counterpart. Tools that "work from the audio" (Whisperr, MicWrite, Timekettle) primarily help the local user hear/read translations; getting English voice to the other side would need virtual-mic routing or the counterpart also running the tool (not documented).
- Event platforms (Wordly, KUDO, Interprefy) are built for webinars and conferences, are mostly sales-led, and are poor value for a single 1:1 call.

### Gaps
- VoicePing: no information found in any search.
- ElevenLabs-based live call translators, Pocketalk and Vasco (mainly in-person devices), Skype (retired), Speak, Translate.live: not covered by any search result found.
- Hebrew voice support for Wordly, KUDO, Interprefy, Maestra, Pinch Desktop, Byrdhouse/Langfinity not verified (only total language counts found).
- Timekettle W4 / W4 Pro retail price and Israeli availability not found; exact Google Meet-on-PC workflow not documented.
- How Palabra's bot routes translated audio in Meet (separate audio participant vs. per-listener) not confirmed.
- DeepL Voice pricing not found.

## Q3. Which options are most recommended for a single important 1:1 business call, and which can be set up within a day

### Takeaway
No independent user forum consensus (e.g., Reddit threads) was found; almost all "best of" rankings are vendor-written. Based on documented features, the practical ranking for a single Hebrew <-> English Meet call is: (1) re-test Google Meet's native Hebrew voice translation, now available since late Oct 2026; (2) Palabra.ai Meet bot as the main commercial fallback (self-serve, Hebrew S2S, ~$0.04/min with free credits, set up in under an hour); (3) DeepL Voice for Meetings if a trial can be activated quickly (Hebrew voice beta); (4) a human interpreter if the stakes are high. Timekettle hardware is not a same-day option.

### Cited Findings
- Search for Reddit/user recommendations returned only vendor-run comparison blogs; none report real user experience in business settings. One guide advises that for internal meetings the built-in Zoom/Teams/Meet translation is usually enough in 2026, and that you test on the actual platform with a short bilingual call first. — [Boostlingo](https://boostlingo.com/blog/best-apps-for-real-time-ai-translation/); [LiveLingo guide](https://www.livelingo.io/guides/real-time-voice-translation-guide); [Whisperr comparison](https://whisperr.co/blog/en/the-10-best-live-voice-translation-apps-in-2026-(an-honest-comparison))
- For high-stakes settings, Interprefy pairs certified remote simultaneous interpreters with an AI captioning layer; Boostlingo supports both AI and human interpreters. — [Boostlingo](https://boostlingo.com/blog/best-apps-for-real-time-ai-translation/)
- KUDO AI is sales-led and cannot be bought and started the same day. — [Fora Soft](https://www.forasoft.com/blog/article/multilingual-translation-video-calls)
- Palabra is self-serve with free sign-up credits and per-minute pricing. — [Palabra pricing](https://www.palabra.ai/pricing)
- An independent benchmark measured Palabra at ~800 ms vs. Google Meet's multi-second delay. — [ai.gopubby benchmark](https://ai.gopubby.com/i-benchmarked-30-voice-ai-engines-and-built-a-real-time-translator-faster-than-google-meet-e6a160def969?gi=35a55d5ef86a); [Slator](https://slator.com/google-meet-live-translation/)

### Inferences
Comparison (synthesized from the cited findings in Q1 and Q2):

| Option | Hebrew voice both ways | How it works with Meet | Voice or text | Reported latency | Price / trial | Ready within a day? |
|---|---|---|---|---|---|---|
| Google Meet speech translation | Yes, since 22 Oct 2026 rollout (Geektime/News1) | Native | Voice (speaker-like) | 1-3 s (Google); ~10 s in Jan 2026 beta (Slator) | Needs Google AI Pro/Ultra or Workspace AI add-on; 90-min cap on lower tiers | Yes, if plan is bought and rollout reached the account |
| Palabra.ai | Yes (vendor) | Bot joins call, nothing to install for counterpart | Voice (cloned) + captions | <1 s claimed, ~800 ms measured | $0.04/min; $50 free credits; Starter $45/mo (official page summary) | Yes (self-serve) |
| DeepL Voice for Meetings | Hebrew supported; Hebrew voice output beta | Meet/Zoom/Teams; voice-to-voice via desktop app | Captions; voice in beta/early access | Not found | Plans unpublished; trial page exists | Maybe (depends on trial access) |
| Timekettle W4 / W4 Pro | Hebrew online only | Earbuds + app; call/meeting mode; PC Meet flow undocumented | Voice in ear | 5-9 s in some user reports | Price not found | No (hardware purchase/shipping) |
| Wordly / KUDO / Interprefy | Not verified | Bot/widget | Voice (KUDO AI voices) + captions | Not found | Quote-based; Wordly ~$1,500/10 h | No (sales-led) |
| Maestra / Pinch / Langfinity / Whisperr | Not verified (Whisperr claims yes) | Extension, desktop app, or alongside the audio | Mostly captions, some voice | Vendor claims only | Free tiers / small credits | Yes, but Hebrew voice unverified |
| Teams Interpreter, Zoom voice, Apple, Pixel, Felo | No Hebrew | N/A for Meet | - | - | - | Not applicable |
| Human interpreter (consecutive, joins Meet as participant) | Yes | Joins as a normal participant | Human voice | Consecutive roughly doubles meeting time | ~$2-5/min on demand; hourly with minimums when scheduled | On-demand VRI same day; scheduled needs booking |

- Recommended path for one important call: do a 10-minute test call with a friend on both Google Meet native translation and Palabra (using free credits) the day before; choose the one with acceptable delay; keep a human interpreter as the fallback if the call has legal/financial weight.
- Practical tips implied by sources: speak in short sentences and pause for the translation (both Meet and Palabra translate at sentence boundaries); avoid overlapping speech; use a good wired connection; set the source language explicitly where a tool cannot auto-detect Hebrew (DeepL).

### Gaps
- No Reddit or other independent user reports found that specifically evaluate Hebrew <-> English voice in Meet for any tool.
- No head-to-head Hebrew quality comparison between Meet native and Palabra exists in sources found.

## Q4. Human interpreter on-demand services as a last-resort fallback (Hebrew <-> English pricing)

### Takeaway
No Hebrew-specific public price list was found. General 2026 remote/video interpreting (VRI) pricing is about $1.95 to $4.00 per minute on demand (up to ~$4.95/min for immediate unscheduled access), or roughly $35 to $100 per hour on flat-rate plans; scheduled remote interpreting is usually billed hourly with a minimum booking. A human interpreter can simply join the Meet as a regular participant and interpret consecutively.

### Cited Findings
- Typical spoken-language VRI in 2026: $1.95 to $4.00 per minute; roughly $35 to $100 per hour on flat-rate plans; immediate unscheduled access up to $4.95 per minute. — [Translators USA: VRI cost 2026](https://translators-usa.com/video-remote-interpreting-cost/); [Global Ethos: interpreter cost per hour 2026](https://global-ethos.com/how-much-do-interpreters-cost-per-hour-u-s-pricing-guide/)
- Scheduled interpreting (on-site or remote) is commonly priced hourly with a minimum booking. — [NWI Global](https://www.nwiglobal.com/blog/what-you-need-to-know-about-interpreter-pricing/)
- One European provider runs remote interpreting on any standard video platform (Zoom, Teams, Webex) from ~€120/hour (page ~2 years old, not Hebrew-specific). — [BeTranslated](https://betranslated.com/remote-interpretation/)
- LanguageLine Solutions employs remote Hebrew video/phone interpreters (job postings list $15 to $17/hour interpreter pay, i.e., wages, not client prices), indicating on-demand Hebrew coverage exists at large providers. — [DailyRemote: LanguageLine Hebrew Interpreter](https://dailyremote.com/remote-job/hebrew-interpreter-4354357)
- Interprefy and Boostlingo offer human remote interpreters alongside AI. — [Boostlingo](https://boostlingo.com/blog/best-apps-for-real-time-ai-translation/)

### Inferences
- A 60-minute call via on-demand VRI at $2 to $5/min would cost roughly $120 to $300; a scheduled freelance or agency Hebrew interpreter would likely be in a similar or higher range with a 1 to 2 hour minimum. These are extrapolations from general rates, not Hebrew quotes.
- In Israel, local agencies and freelance court/business interpreters are a likely cheaper and faster channel for Hebrew <-> English, but no sources were found to quote prices.
- Google Meet has no native separate interpretation audio channels documented in sources found, so a human interpreter would work consecutively (speaker pauses, interpreter repeats), which roughly doubles speaking time but is the most reliable option for high-stakes content.

### Gaps
- No published Hebrew <-> English per-hour or per-minute client rate found from any provider (LanguageLine, Boostlingo, Israeli agencies).
- Whether Google Meet supports dedicated interpretation channels (as Zoom does) was not verified.
