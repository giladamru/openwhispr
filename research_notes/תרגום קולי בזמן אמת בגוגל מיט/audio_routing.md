# Audio Routing for Live Voice Translation in Google Meet (Windows / macOS / Linux)

Scope: the "plumbing" only. Two flows are needed:
- **Flow 1 (outgoing):** physical Hebrew mic -> translator -> English TTS -> *virtual mic* -> Meet microphone.
- **Flow 2 (incoming):** Meet speaker output -> *virtual sink / capture* -> translator -> Hebrew TTS -> user's headphones.

Research caveat: many primary pages (support.google.com, vb-audio.com, rogueamoeba.com, existential.audio, wiki.archlinux.org, workspaceupdates.googleblog.com, transyncai.com, kulak.pages.dev, kizuna-ai-lab.github.io) could not be fetched directly from this research environment (network blocked). Facts from those pages below come from search-engine result summaries that quoted them, not from a full read of the page. GitHub pages (Sokuji, BlackHole README, Chromium gist) were read directly.

## Virtual audio devices per OS (cost, install steps)

### Takeaway
Every OS needs **two independent virtual devices** (one per flow) so the translator never hears its own output: Windows = VB-CABLE (free) + a second cable (VB-CABLE A+B donationware or VoiceMeeter Banana); macOS = BlackHole 2ch + BlackHole 16ch (free, Homebrew) or Rogue Amoeba Loopback (~$99) for a GUI; Linux = two PipeWire/PulseAudio null sinks plus a `module-remap-source`, because Chrome refuses to list "monitor" sources as microphones.

### Cited Findings

**Windows**
- VB-CABLE installs on "all Windows from XP SP2 to latest Win11 32 or 64 bits" — [VB-Audio shop listing (via search)](https://shop.vb-audio.com/en/win-apps/12-vb-cable.html)
- Reboot after installation is listed as mandatory ("REBOOT after installation (mandatory)") — [VB-Audio shop listing (via search)](https://shop.vb-audio.com/en/win-apps/11-vb-cable.html)
- VB-CABLE's default format is stereo 48 kHz on Win10/11 (44.1 kHz on older Windows), and the input/output format can be changed by the application — [VB-CABLE Reference Manual (via search)](https://vb-audio.com/Cable/VBCABLE_ReferenceManual.pdf)
- The basic VB-CABLE is free (donationware); extra cables "VB-CABLE A+B" and "VB-CABLE C+D" are donationware that "must be purchased on Webshop", which offers 5 different amounts — [VB-Audio licensing page (via search)](https://www.vb-audio.com/Services/licensing.htm). The only concrete price found was a Mac A+B tier at $15.00 ("P1"); no Windows A+B/C+D amount was confirmed — [VB-Cable A+B MAC shop page (via search)](https://shop.vb-audio.com/en/mac-apps/30-vb-cable-ab-mac.html)
- Device naming: in the translator's speaker settings select "CABLE Input (VB-Audio Virtual Cable)"; in the meeting app select "CABLE Output" as the microphone; the translator keeps using the real microphone as its source — [Transync AI: How to set up virtual microphone on Windows (via search)](https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/)
- Gotcha: "After installing VB-CABLE, CABLE Output may become the selected microphone" — reselect your real mic — [Transync AI (via search)](https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/)
- A user reported VB-CABLE A+B stopped working after Windows 11 24H2 (build 26100.4652); the developer's fix was to install latest Voicemeeter (2.1.1.9) and VB-CABLE "pack 45", which worked — [VB-Audio forum](https://forum.vb-audio.com/viewtopic.php?p=7505)
- VoiceMeeter Banana (VB-Audio mixer, includes its own virtual devices): official guide makes the VoiceMeeter virtual device the recording device so apps take audio from bus B1, and suggests "VoiceMeeter Aux Output" as mic / "VoiceMeeter Aux Input" as speakers in conferencing apps — [VoiceMeeter: Setup VoiceMeeter Banana with Zoom and other conference tools](https://voicemeeter.com/setup-voicemeeter-banana-with-zoom-and-other-conference-tools/)
- A Meet-specific VoiceMeeter recipe: Meet microphone = "VoiceMeeter Output (B1)", speakers = Default or "VoiceMeeter AUX Input"; tick B1 in VoiceMeeter; restart Meet if no sound — [PatientNotes VoiceMeeter guide](https://patientnotes.zendesk.com/hc/en-us/articles/12752584333583-Windows-audio-cable-compatible-systems)
- VoiceMeeter Banana: set physical mic as Hardware Input 1; restart the computer after install so virtual devices register — [Hollyland guide](https://store.hollyland.com/apps/arenza/blogs/creator-hub/capture-mic-and-desktop-audio-as-a-single-mic-input)
- VoiceMeeter is distributed as donationware per VB-Audio's donationware page — [VB-Audio Voicemeeter Donationware page (URL surfaced in search; content not read)](https://vb-audio.com/Voicemeeter/Donationware.htm)

**macOS**
- BlackHole: GPL-3.0, "Compatible with macOS 10.10 Yosemite and newer", "Builds for Intel and Apple Silicon"; no price listed (free) — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- Install: installer package from existential.audio/blackhole (close audio apps, install, restart when prompted) or Homebrew `brew install blackhole-2ch` / `brew install blackhole-16ch` / `brew install blackhole-64ch` — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- Multi-Output device: create in Audio MIDI Setup, right-click -> "Use This Device For Sound Output"; Built-in Output must be enabled and listed first; Multi-Output volume cannot be changed in macOS (adjust each sub-device in Audio MIDI Setup) — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- "You need to enable drift correction for all devices except the Clock Source" — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- Troubleshooting: if no sound, set BlackHole input/output volume to maximum in Audio MIDI Setup; confirm the app has Microphone access in Privacy settings — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- BlackHole 2ch can serve as clock/primary device; BlackHole 16ch will not work as primary (primary needs 2ch) — [BlackHole GitHub issue (via search)](https://github.com/ExistentialAudio/BlackHole)
- Uninstall: uninstaller package or `rm -R /Library/Audio/Plug-Ins/HAL/BlackHoleXch.driver` then `sudo killall -9 coreaudiod` — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- Existential Audio's own Meet how-to: create a Multi-Output device with BlackHole + drift compensation, then in Meet (three-dot menu -> Settings) set microphone to BlackHole — [Existential Audio: Stream from Logic Pro X to Google Meet (via search)](https://existential.audio/howto/StreamFromLogicProXtoGoogleMeet.php)
- Rogue Amoeba Loopback: $99 regular price ($75 intro sale cited in one review) — [CIO.de review](https://cio.de/a/loopback-review-an-easy-way-to-route-you-mac-s-audio-to-your-software-and-devices,3252817); [FileHorse](https://mac.filehorse.com/download-loopback). Older Macworld listing said $119 for Loopback 2 (outdated) — [Macworld](https://www.macworld.com/article/3333786/software/loopback-2-review.html). Bundle with Audio Hijack saves $33 — [Rogue Amoeba store (via search)](https://rogueamoeba.com/audiohijack/buy.php)
- Rogue Amoeba says issues it reported in macOS Tahoe "have been resolved with the recent release of MacOS 26.1" and recommends 26.1+ — [Rogue Amoeba blog, Nov 2025](https://weblog.rogueamoeba.com/2025/11/)
- Audio Hijack 4.5.9 (May 19, 2026) supports macOS 14.4 to macOS 26 — [Rogue Amoeba Audio Hijack page (via search)](https://www.rogueamoeba.com/audiohijack/)
- Rogue Amoeba's capture engine: "approve the necessary System Audio Access permission on first launch", no kernel extensions or Security Policy changes or restarts (Dec 2024 post) — [Rogue Amoeba blog, Dec 2024](https://weblog.rogueamoeba.com/2024/12/13/the-developers-who-came-in-from-the-cold/)
- Sequoia: something changed so that an audio session must be running before the default audio device is configured (affects apps that set devices programmatically) — [Apple Developer Forums](https://developer.apple.com/forums/thread/767333)
- Tahoe audio reports: general Tahoe audio glitches/distortion threads exist; a (promotional, competitor-written) post claims BlackHole crackles on Tahoe — discount it; an OBS forum user on Tahoe 26.3 reports BlackHole routing worked for others — [Apple Community](https://discussions.apple.com/thread/256140785); [Medium (promotional)](https://medium.com/@andrew_best/how-to-record-system-audio-on-mac-without-blackhole-macos-tahoe-fix-6cc488b728d1); [OBS forum](https://obsproject.com/forum/threads/issues-with-audio-recording-daws.194514/post-702403)
- An Audacity forum user on Sequoia 15.6.1 couldn't get Meet -> BlackHole recording to work (no confirmed fix) — [Audacity forum](https://forum.audacityteam.org/t/recording-a-podcast-via-google-meet-guest-voice-not-recording/150374)

**Linux**
- Chromium/Chrome "refuse to list or capture monitor devices on Linux" (Chromium issues 931749, 1155954, 865799) — so a null-sink `.monitor` will not appear as a mic in Meet — [Chromium monitor-devices gist](https://gist.github.com/53e00c6765aa256362fb52c08e82d189)
- Workaround: `pactl load-module module-remap-source master=virtmic.monitor source_name=virtmic source_properties=device.description=Virtual_Microphone` — clones the monitor as a non-monitor source Chrome will list — [Chromium monitor-devices gist](https://gist.github.com/53e00c6765aa256362fb52c08e82d189)
- PipeWire issue thread pattern: `pactl load-module module-null-sink sink_name=Virtual-Speaker ...` then `pactl load-module module-remap-source source_name=Remap-Source master=Virtual-Speaker.monitor` (works on PipeWire via pipewire-pulse) — [PipeWire GitLab issue #1086 (via search)](https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/1086)
- Persistence: pactl-loaded modules vanish on restart; put config in `~/.config/pipewire/pipewire-pulse.conf.d/` (e.g. `10-remap-sink.conf`) and restart PipeWire — [yutsuten PipeWire notes (via search)](https://yutsuten.github.io/notes/tool/linux/audio/pipewire)
- PipeWire-native alternative: `libpipewire-module-loopback` config in `~/.config/pipewire/pipewire.conf.d/` has a documented "virtual source" example; `pw-loopback` is the CLI equivalent — [libpipewire-module-loopback(7) man page](https://man.archlinux.org/man/extra/libpipewire/libpipewire-module-loopback.7.en); [pw-loopback(1)](https://man.archlinux.org/man/pw-loopback.1)
- Example of a mono virtual microphone via loopback config and the equivalent `pw-loopback` command — [denilsonsa: PipeWire conf examples](https://denilsonsa.github.io/blog/2023-12-26/pipewire-conf-examples)
- `media.class = "Audio/Source/Virtual"` used to expose a virtual source — [Manjaro forum](https://forum.manjaro.org/t/virtual-mic-in-pipewire/164210)
- Known issue: a `pw-loopback` virtual source didn't create output ports on one setup — [PipeWire issue #2858](https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/2858)
- Pitfall: a user's remap source recorded the physical mic instead of the virtual monitor, and reset on reboot — check the source in pavucontrol — [Arch forum (via search)](https://bbs.archlinux.org/viewtopic.php?id=301547)
- Restart after config edits: `systemctl --user restart pipewire pipewire-pulse` — [search summary of PipeWire docs/forums](https://denilsonsa.github.io/blog/2023-12-26/pipewire-conf-examples)

### Inferences
Practical recipes synthesized from the findings above (verify in a test call before the real meeting):

**Windows 11 — recipe A (two cables, cleanest):**
1. Install VB-CABLE (free): download zip from vb-audio.com/Cable, extract, right-click `VBCABLE_Setup_x64.exe` -> Run as administrator -> Install Driver -> reboot. For Flow 2, also install VB-CABLE A+B (donationware purchase) — or use VoiceMeeter Banana's virtual devices instead (recipe B).
2. Windows Settings -> System -> Sound: make sure default *input* is still your real headset mic and default *output* is your headphones (VB-CABLE install may have changed them).
3. Optional: in the classic Sound control panel, set CABLE Input/Output and your headset all to 48 kHz (matches VB-CABLE's Win11 default and Meet's typical 48 kHz pipeline).
4. Flow 1: translator *input* = real mic (Hebrew); translator *English output* = "CABLE Input (VB-Audio Virtual Cable)". Meet microphone = "CABLE Output (VB-Audio Virtual Cable)".
5. Flow 2: Meet *speakers* = "CABLE-A Input" (second cable); translator *input* for the incoming direction = "CABLE-A Output"; translator *Hebrew output* = your headphones.
6. To also hear the original English faintly: in Sound control panel -> Recording -> CABLE-A Output -> Properties -> Listen -> "Listen to this device" -> playback through headphones, then lower the level. (Adds a little latency; inference — not sourced.)

**Windows — recipe B (VoiceMeeter Banana, one install for both flows + mixing):** physical mic on Hardware Input 1 routed only to the translator; translator English output -> "VoiceMeeter Input" routed to B1; Meet mic = "VoiceMeeter Output (B1)"; Meet speakers = "VoiceMeeter AUX Input" routed to B2; translator listens to "VoiceMeeter AUX Output (B2)"; headphones on A1 receive translator Hebrew output (plus, optionally, a faint AUX/English strip). This gives faders for "ducking" but is more complex to configure.

**macOS 15/26 recipe:**
1. `brew install blackhole-2ch blackhole-16ch` (or both installers); reboot/restart audio as prompted. On Tahoe, be on 26.1 or later.
2. Audio MIDI Setup: set BlackHole 2ch, BlackHole 16ch and the headphones to 48 kHz; set BlackHole volumes to max.
3. Flow 1: translator input = real mic; translator English output = BlackHole 2ch; Meet microphone = BlackHole 2ch.
4. Flow 2: Meet speakers = BlackHole 16ch; translator incoming input = BlackHole 16ch; translator Hebrew output = headphones. To also hear faint English, create a Multi-Output Device (headphones first + BlackHole 16ch, drift correction on BlackHole) and set Meet speakers to it — but note Multi-Output volume is not adjustable from the menu bar, so "ducking" the English requires per-device volume in Audio MIDI Setup.
5. Grant Microphone permission (and, for any app capturing system/app audio, the "System Audio Recording"/"Screen & System Audio Recording" permission) in System Settings -> Privacy & Security to the translator app and Chrome; restart the app after granting.
6. Loopback ($99) is the "just works" alternative: one virtual device "Translator Mic" fed by the translator app, and another fed by Chrome's output; it captures per-app audio, so Meet's speaker can stay on the headphones while Loopback taps Chrome. Worth it if the user has no time to debug Audio MIDI Setup.

**Linux (PipeWire with pipewire-pulse) recipe:**
```
# Flow 1: translator writes English here; Chrome reads the remapped source
pactl load-module module-null-sink sink_name=tr_en sink_properties=device.description=Translator_EN_Out
pactl load-module module-remap-source master=tr_en.monitor source_name=tr_en_mic source_properties=device.description=Translator_EN_Mic
# Flow 2: Meet plays the other side here; translator records tr_meet.monitor (native apps can read monitors)
pactl load-module module-null-sink sink_name=tr_meet sink_properties=device.description=Meet_Out
```
Meet mic = "Translator_EN_Mic"; Meet speakers = "Meet_Out"; translator input #1 = real mic, output #1 = Translator_EN_Out; translator input #2 = Meet_Out monitor, output #2 = headphones. Verify in pavucontrol (Recording/Playback tabs) or a patchbay (qpwgraph/Helvum) that nothing is cross-linked. Make persistent via `~/.config/pipewire/pipewire-pulse.conf.d/` only after it works. (Commands adapted from the gist/PipeWire issue; device names are illustrative.)

### Gaps
- Could not read vb-audio.com directly: exact current VoiceMeeter Banana/Potato licensing terms (Potato is believed to be paid donationware with a nag but this was not confirmed) and Windows A+B/C+D price tiers are unconfirmed.
- No source found on any native Windows 11 virtual audio cable (I found none; Windows 11 does not appear to ship one — unconfirmed).
- Loopback free-trial limits (historically noise added after ~20 minutes) and SoundSource pricing/role were not confirmed (rogueamoeba.com blocked).
- Helvum/qpwgraph install and usage were not researched with sources.
- No source confirmed BlackHole behavior specifically on macOS 26.x with Chrome; Tahoe evidence is anecdotal.

## Configuring Google Meet (Chrome) to use a virtual mic and capturing Meet's output

### Takeaway
Use Chrome (not Firefox): in Meet open More options (⋮) -> Settings -> Audio, pick the virtual device as Microphone, pick a *separate* virtual device as Speakers, and turn **Noise cancellation off**. For Flow 2 the two options are (a) set Meet's speaker to a virtual cable the translator listens to, or (b) use a browser extension (e.g., Sokuji) that captures the Meet tab audio and exposes its own in-browser virtual microphone — no drivers needed.

### Cited Findings
- Meet audio settings path: "select More options, then Settings. In the settings panel, click Audio"; speakers can also be changed from the speaker drop-down before or during a meeting — [Google Meet Help: Fix audio issues (via search)](https://support.google.com/meet/answer/10620276?hl=en); [Google Meet Help: Before a meeting (via search)](https://support.google.com/meet/answer/10409699?hl=en)
- Chrome shows the full output-device list and remembers the choice across sessions; Firefox Release has had a bug where Meet's speaker is always the System Default — [Mozilla Bugzilla 1878107 (via search)](https://bugzilla.mozilla.org/show_bug.cgi?id=1878107); [Mozilla support (via search)](https://support.mozilla.org/he/questions/1550238)
- Chrome needs microphone permission for Meet; restarting Chrome or rejoining fixes some access problems — [Google Meet Help: Fix audio issues (via search)](https://support.google.com/meet/answer/10620276?hl=en)
- Noise cancellation "can be turned on or off before or during a meeting"; changes made in a meeting "apply only to that meeting"; Meet cancels non-speech noise and Google suggests turning it off for things like music; screen-share audio is not affected by noise cancellation — [Google Meet Help: Filter out noise (via search)](https://support.google.com/meet/answer/9919960)
- Workspace admins can set noise cancellation default on/off — [Google Workspace Admin Help (via search)](https://support.google.com/a/answer/11925281)
- OBS-based chains into Meet fail when the monitoring output isn't routed back to the cable; Google warns that when you monitor, make sure it's not your selected audio output — [OBS forum: Virtual Audio Cable not working on Google Meet](https://obsproject.com/forum/threads/virtual-audio-cable-not-working-on-google-meet.166242)
- Sokuji (Chrome/Edge extension) creates a virtual microphone; in Meet's audio settings select "Sokuji Virtual Microphone"; listeners need no setup; you choose AI provider (OpenAI, Gemini, Palabra.ai, etc.) and enter an API key — [Sokuji Chrome Web Store listing (via search)](https://chromewebstore.google.com/detail/sokuji-ai-meeting-transla/ppmihnhelgfpjomhjhpecobloelicnak)
- Sokuji captures "meeting audio (extension)" or "any system audio (desktop)"; two-way mode takes microphone and system audio in one session; "Echo Cancellation — built-in with modern Web Audio API"; AGPL-3.0; providers incl. OpenAI, Gemini, Palabra.ai, Kizuna AI, Doubao AST 2.0, Soniox, OpenAI-compatible (desktop only), Local Inference (offline) — [Sokuji GitHub README](https://github.com/kizuna-ai-lab/sokuji)
- Sokuji also ships a desktop app "with virtual audio devices" for routing outside the browser; the repo includes a BlackHole submodule — [Sokuji GitHub README](https://github.com/kizuna-ai-lab/sokuji)
- Chrome extension "Audio Selector" can route a browser tab's audio to any output device — [Chrome Web Store: Audio Selector (via search)](https://chromewebstore.google.com/detail/nladhmjchmoeoadjnckmoemmapkjhalb)
- On Linux, a web page can select a specific virtual mic with `getUserMedia({audio:{deviceId:{exact:id}}})` after enumerating devices — [Chromium monitor-devices gist](https://gist.github.com/53e00c6765aa256362fb52c08e82d189)

### Inferences
- Meet's own Speaker selector (Chrome `setSinkId`) is the simplest way to isolate Meet's output: it sends *only* the meeting audio to the virtual cable, leaving other system sounds (and the translator's Hebrew TTS) out of the translator's input. This is safer than capturing whole-system loopback, which would also capture the translator's own Hebrew output and create a re-translation loop.
- Before joining, use Meet's green-room "Check your audio and video" preview to confirm the virtual mic meter moves when the translator speaks.
- If Meet's settings are not saved between meetings, re-check Mic/Speaker/Noise cancellation at the start of each call (noise-cancellation changes during a meeting apply only to that meeting).
- Extension-based setups (Sokuji extension) avoid OS drivers entirely and work identically on Windows/macOS/Linux Chrome — likely the fastest route for a user who needs this working soon, provided the extension's chosen provider supports Hebrew (covered by the other researcher).

### Gaps
- Could not confirm whether Meet applies Chrome's default WebRTC processing (auto gain control, echo cancellation) to a virtual-cable mic in a way that degrades TTS, or whether Meet exposes a toggle for it; no source found on "Meet auto-gain" specifically.
- Could not read Sokuji's supported-sites page for Meet-specific troubleshooting (host blocked).

## Should the other side hear the original Hebrew too? Ducking/mixing and etiquette

### Takeaway
Google's own Meet speech translation plays the original voice **faintly underneath** the translated voice ("dubbed over the original"), which is the de facto industry model; for a DIY setup the simplest reliable choice is **English-only** to the other side (no mixer needed), optionally adding faint original audio only if a mixer (VoiceMeeter/Loopback/PipeWire) is already in place. Etiquette (announce the interpreter, short sentences, pauses) is not documented by these sources and is inference.

### Cited Findings
- In Meet speech translation, when the other side speaks "you will still faintly hear their original voice, with the translated speech overlaid on top"; voice, tone and expression are preserved — [Google Meet Help: Learn about Speech Translation (via search)](https://support.google.com/meet/answer/16221730)
- Reviewers note you first hear the original speech quite faintly before the translated version comes in — [9to5Google](https://9to5google.com/2025/05/20/google-meet-speech-translation/)
- Google describes it as an audio translation "dubbed over the original speech" that mimics tone and cadence — [Google blog: How AI made Meet's language translation possible](https://blog.google/products/workspace/google-meet-langauge-translation-ai/)
- Google warns real-time translations have more errors than translations from a recording/text, and suggests using captions with translation as a supplement — [Google Meet Help: Speech Translation (via search)](https://support.google.com/meet/answer/16221730)
- Hebrew is on Meet's translated-captions language list (separate feature from speech translation) — [Google Workspace with Gemini language support (via search)](https://knowledge.workspace.google.com/admin/gemini/google-workspace-with-gemini-language-support?hl=en)
- DeepL's guidance: the cleaner the incoming audio, the more accurate the transcription/translation — [DeepL support: Recommended audio settings](https://support.deepl.com/hc/en-us/articles/28245982055580-Recommended-audio-settings-for-best-translation-quality)

### Inferences
- **Outgoing (Flow 1):** Send English only. Reasons: no mixer needed; avoids the English speaker's brain fighting two voices; avoids Meet's noise suppression/voice processing treating two overlapping voices as noise. Downside: the other side gets no cue that you started speaking until the TTS arrives (1-3 s later) — mitigate with video (they see your lips move) or by saying a short English "one moment" before long turns.
- If including the original Hebrew: mix it ~15-20 dB below the English (VoiceMeeter strip faders, Loopback channel volumes, or a PipeWire loopback with reduced volume), and duck it further while TTS plays. Only worth it if the user already uses VoiceMeeter/Loopback.
- **Incoming (Flow 2):** Hearing the English faintly under the Hebrew (as Meet does) helps turn-taking — the user knows when the other person starts/stops. Implement with Windows "Listen to this device" at low level, a macOS Multi-Output device with lowered BlackHole/headphone levels, or a low-volume PipeWire loopback.
- **Etiquette for interpreted calls:** tell the other side at the start ("I'm using an AI voice interpreter; there's a ~2-second delay; please speak in short sentences and pause"); speak in short, complete sentences and pause at the end of each so the translator can finalize; avoid interrupting/overlapping speech (double-talk breaks most speech-to-speech pipelines); agree on a fallback (Meet chat, or Meet's translated captions) for names, numbers, and anything important; do a 5-minute test call with someone before the real meeting.

### Gaps
- No primary source found on etiquette/best practices for AI-interpreted video calls; the above is practitioner inference.
- No source found describing how DIY tools (Sokuji, Palabra, etc.) handle ducking of original audio.

## Pitfalls (echo, noise cancellation, auto-gain, double-talk, headphones, latency, Bluetooth, sample rates)

### Takeaway
The biggest failure modes are (1) the translator hearing its own TTS (feedback/re-translation loop) — prevented by headphones plus strictly separate virtual devices per flow, (2) Meet's noise cancellation mangling synthetic voice — turn it off, (3) Bluetooth headsets dropping to low-quality mono HFP when their mic is used — use a wired headset or a separate mic, and (4) default devices silently changed by driver installs.

### Cited Findings
- Installing VB-CABLE can silently make CABLE Output the selected microphone — [Transync AI (via search)](https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/)
- Meet cancels non-speech sounds; Google suggests turning noise cancellation off when you need other sounds (e.g., music); admins can force defaults — [Google Meet Help: Filter out noise (via search)](https://support.google.com/meet/answer/9919960); [Workspace Admin Help (via search)](https://support.google.com/a/answer/11925281)
- A Zoom Room joining Google Meet kept suppressing music even with audio processing disabled; the poster thought it was integration-level — [Zoom Community](https://community.zoom.com/meetings-2/google-meet-integration-ignoring-audio-settings-echo-cancellation-noise-suppression-not-applied-17534)
- Bluetooth: A2DP has no mic channel; using the headset mic forces HSP/HFP — mono, lower bitrate — [Daily.co blog](https://www.daily.co/blog/why-bluetooth-audio-quality-suffers-in-video-calls/); [Gcore docs](https://gcore.com/docs/streaming/faq/real-time-video-issues/audio-quality-is-reduced-when-using-bluetooth-headsets-in-video-call-apps)
- Fix: pick a different mic (e.g., laptop built-in) in the call app so the headset stays in A2DP — [Gcore docs](https://gcore.com/docs/streaming/faq/real-time-video-issues/audio-quality-is-reduced-when-using-bluetooth-headsets-in-video-call-apps); A2DP increases audio delay — [BGR](https://bgr.com/2158391/how-to-fix-bluetooth-bad-sound-quality-call/)
- Windows 11 voice-activation features can trigger the hands-free switch even without a call; Windows may stay in hands-free mode after a call — [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/3928805/how-to-fix-windows-11-recognizing-bluetooth-device)
- Linux/PipeWire: a user found headset-head-unit profile made the Bluetooth mic stable for Meet but call-grade quality — [Zorin forum](https://forum.zorin.com/t/zorin-os-bluetooth-call-mode-issue-with-oneplus-buds-3-a2dp-playback-works-hfp-hsp-mic-audio-unreliable-for-google-meet/59093)
- Sample rate: VB-CABLE defaults to 48 kHz on Win10/11; BlackHole supports 8-768 kHz and warns against high rates with many channels; drift correction needed on all Multi-Output members except the clock source — [VB-CABLE manual (via search)](https://vb-audio.com/Cable/VBCABLE_ReferenceManual.pdf); [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md)
- macOS: Multi-Output volume can't be controlled from macOS; Tahoe audio glitches were addressed in 26.1 — [BlackHole README](https://raw.githubusercontent.com/ExistentialAudio/BlackHole/master/README.md); [Rogue Amoeba blog](https://weblog.rogueamoeba.com/2025/11/)
- Anecdotal macOS fixes (unverified): `sudo killall coreaudiod`; Chrome flag `--disable-features=AudioServiceSandbox` — [Apple Community (via search)](https://discussions.apple.com/thread/256140785)
- Firefox + external USB audio in Meet: echo/duplicate-audio reports — [Mozilla support (via search)](https://support.mozilla.org/ln/questions/1432980)
- Latency claims are vendor numbers only: Transync ~300-600 ms; Palabra "under one second" — [Transync AI (via search)](https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/); [Palabra: Google Meet](https://www.palabra.ai/solutions/google-meet)
- Meet speech translation is not available when using "adaptive audio", in recordings, live streams, CSE meetings, dial-in, or interop calls — [Workspace Updates, Oct 22 2026 (via search)](https://workspaceupdates.googleblog.com/2026/10/real-time-speech-translation-in-google-Meet-expands-to-63-languages-with-automatic-language-detection.html)

### Inferences
- **Echo/re-translation loop rule:** the translator's *output* devices must never be its *input* devices. Flow 1 input = physical mic, output = virtual cable #1. Flow 2 input = virtual cable #2 (Meet speakers), output = headphones. With speakers instead of headphones, the physical mic hears the Hebrew TTS and English from Meet, and the translator re-translates them — **headphones are mandatory**, preferably wired.
- Also turn off Windows "Listen to this device" / macOS Multi-Output on the wrong device — a common hidden loop.
- **Latency budget (rough, not sourced):** STT+MT+TTS pipelines typically add ~1-3 s per direction, plus Meet network latency; round-trip turn-taking (you speak -> they hear English -> they reply -> you hear Hebrew) can approach 4-6 s. Plan pauses accordingly.
- **Double-talk:** if both sides speak at once, each translator mixes/garbles; speech-to-speech models may cut themselves off. The etiquette of short turns is the real fix.
- **Bluetooth:** best is a wired USB/3.5 mm headset; second best is Bluetooth headphones for listening (A2DP) + laptop/USB mic for speaking. Avoid the Bluetooth headset's own mic — HFP lowers both the user's mic quality (hurting Hebrew STT) and the playback quality.
- **Sample rates:** keep everything at 48 kHz; mismatches show up as chipmunk/slowed audio, crackles, or drift over long calls (macOS aggregate/multi-output without drift correction).
- **Meet noise cancellation:** turn off *before* joining and re-check after joining; if a Workspace admin forces it on, synthetic voice may get clipped at word starts — test.
- **Auto-gain:** TTS output is usually loud and constant; set translator output volume so Meet's mic meter peaks well below max to avoid Chrome/Meet AGC pumping. (Inference; unsourced.)

### Gaps
- No source quantified Meet's own added latency or confirmed how Meet's AGC/echo cancellation behaves with virtual mics.
- No source specifically documented Meet noise cancellation suppressing TTS voices (only music/non-speech).

## Alternative simpler setups (two devices, interpreter bots, built-in Meet translation, extensions)

### Takeaway
Before building any routing, check **Meet's built-in Gemini speech translation**: as of October 22, 2026 it reportedly supports 63 languages (Hebrew appears in Google's Gemini language-support table for speech translation), works on web and mobile, and needs only a qualifying plan — it would remove all plumbing. Otherwise: an interpreter bot that joins the call (Interprefy, Palabra), a Chrome extension with an in-browser virtual mic (Sokuji, MeetVoice), or a two-device setup.

### Cited Findings
- Oct 22, 2026: Meet speech translation "will now support 63 languages across web and mobile devices (Android and iOS)", listening support on Meet hardware, powered by "Gemini 3.5 Live Translate", any combination of the 63 languages in one meeting, automatic language detection — [Workspace Updates blog, Oct 22 2026 (via search)](https://workspaceupdates.googleblog.com/2026/10/real-time-speech-translation-in-google-Meet-expands-to-63-languages-with-automatic-language-detection.html)
- Google's Gemini language-support page lists "Speech translation in Google Meet" as available in its Hebrew section — [Google Workspace with Gemini language support (via search)](https://knowledge.workspace.google.com/admin/gemini/google-workspace-with-gemini-language-support?hl=en). Note: the full 63-language list was not read directly; confirm Hebrew in-product.
- Earlier: speech translation was English-to/from only; April 2026 mobile rollout listed English + Spanish, French, German, Portuguese, Italian — [Workspace Updates, Apr 8 2026 (via search)](https://workspaceupdates.googleblog.com/2026/04/speech-translation-in-google-meet-is-now-rolling-out-to-mobile-devices.html?hl=en); GA announced Feb 4, 2026 — [Workspace Updates, Feb 4 2026](https://workspaceupdates.googleblog.com/2026/02/speech-translation-meet-ga.html)
- Eligibility: Google AI Pro and Google AI Ultra subscribers (plus Workspace editions controlled by admins); each participant must allow their voice to be translated; 90-minute limit per meeting (per help page, may have changed) — [Google Meet Help: Speech Translation (via search)](https://support.google.com/meet/answer/16221730)
- Speech translation is OFF by default at meeting start and enabled by individual participants; admins can control it — [Workspace Updates (via search)](https://workspaceupdates.googleblog.com/2026/10/real-time-speech-translation-in-google-Meet-expands-to-63-languages-with-automatic-language-detection.html); [Workspace Admin: turn speech translation on or off (via search)](https://knowledge.workspace.google.com/admin/meet/turn-speech-translation-on-or-off-for-meet?hl=ja)
- A 2025 write-up said Meet translation was limited to personal accounts on a paid AI plan and Workspace accounts were not supported "at that time" (outdated) — [Kulak blog (via search)](https://kulak.pages.dev/en/blog/google-meet-realtime-translation)
- Interprefy Agent "joins your Google Meet meeting as a smart, automated participant" and streams audio to its platform, returning translations — [Interprefy knowledge base](https://knowledge.interprefy.com/interprefy-agent-for-google-meet)
- Palabra offers a bot you add by pasting a Zoom/Meet/Teams link (latency "under one second" is a marketing claim) — [Palabra: Google Meet](https://www.palabra.ai/solutions/google-meet)
- Chrome extensions for Meet translation exist: Sokuji (virtual mic), MeetVoice, "Meet Live Interpreter", "AI Translator", "Live Captions & Translation for Google Meet, Zoom and MS Teams" — [Sokuji](https://chromewebstore.google.com/detail/sokuji-ai-meeting-transla/ppmihnhelgfpjomhjhpecobloelicnak); [MeetVoice](https://chromewebstore.google.com/detail/ahmdecnledffbnblohemfonphfapcifg); [AI Translator](https://chromewebstore.google.com/detail/cpplcldmgpbihglakanaikeaklfjoifa); [Live Captions & Translation](https://chromewebstore.google.com/detail/ablepjjihjaapealhickinjkhmphigpi)
- Timekettle (a hardware vendor) also publishes a guide for translating Zoom/Meet conversations in real time — [Timekettle blog](https://www.timekettle.co/blogs/tips-and-tricks/how-to-translate-zoom-or-google-meet-conversations-in-real-time)

### Inferences
- **Decision order for "needs to work soon":** (1) Meet built-in speech translation if either participant's account qualifies and Hebrew is offered in the language picker — zero plumbing, and each listener picks their own language, so the English speaker can enable it too. (2) Chrome extension with in-browser virtual mic (Sokuji) — no drivers, same on all OSes. (3) Interpreter bot (Interprefy/Palabra) — the bot is a visible participant; tell the other side. (4) Full virtual-cable routing — most flexible, most failure points.
- **Two-device fallback (unsourced):** run a translator app on a phone; for Flow 2, phone listens to laptop's speaker/headphone output (or a splitter) and speaks Hebrew into an earbud; for Flow 1, phone hears your Hebrew and its English output is picked up by the laptop mic. Works in a pinch, but acoustic coupling causes echo and Meet noise cancellation may suppress the phone's speaker audio; quality is lower than digital routing.
- Because Meet speech translation is unavailable when "adaptive audio" is used, everyone should join from separate rooms/devices, not multiple laptops in one room.

### Gaps
- Could not read the Oct 2026 Workspace Updates post or the Speech Translation help page directly to confirm Hebrew in the 63-language list, current plan eligibility, and whether the 90-minute cap still applies.
- No source found for two-device setups' real-world quality.
- Pricing for Interprefy/Palabra bots not researched.

## Ready-made guides and tutorials

### Takeaway
There is no single authoritative "Hebrew<->English Meet interpreter" tutorial; the best practical references are vendor docs (Transync AI's Windows virtual-mic guide, Wordly's audio-capture guide), Existential Audio's BlackHole->Meet how-to, VoiceMeeter's conference-tool setup page, Sokuji's README, and the Chromium "monitor devices" gist for Linux.

### Cited Findings
- Windows VB-CABLE + translator -> Meet step-by-step — [Transync AI: How to set up virtual microphone on Windows](https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/)
- Reverse direction (meeting audio out via VB-Cable to a translation service) — [Wordly: Capturing audio for Wordly with any platform](https://help.wordly.ai/setup-guides/capturing-audio)
- macOS BlackHole -> Google Meet — [Existential Audio how-to](https://existential.audio/howto/StreamFromLogicProXtoGoogleMeet.php)
- Meet realtime translation guide recommending BlackHole (macOS) / VB-Cable (Windows), both free — [Kulak blog](https://kulak.pages.dev/en/blog/google-meet-realtime-translation)
- VoiceMeeter Banana for conference apps — [VoiceMeeter official](https://voicemeeter.com/setup-voicemeeter-banana-with-zoom-and-other-conference-tools/); Meet-specific VoiceMeeter mapping — [PatientNotes](https://patientnotes.zendesk.com/hc/en-us/articles/12752584333583-Windows-audio-cable-compatible-systems); VoiceMeeter Banana manual — [VB-Audio PDF](https://vb-audio.com/Voicemeeter/VoicemeeterBanana_UserManual.pdf); Windows Central walkthrough — [Windows Central](https://www.windowscentral.com/how-use-voicemeeter-banana)
- Open-source tool README (virtual mic, two-way mode, providers) — [Sokuji GitHub](https://github.com/kizuna-ai-lab/sokuji)
- Linux Chrome virtual mic workaround — [Chromium monitor-devices gist](https://gist.github.com/53e00c6765aa256362fb52c08e82d189); PipeWire config examples — [denilsonsa blog](https://denilsonsa.github.io/blog/2023-12-26/pipewire-conf-examples)
- Google Meet live-translation-for-events write-up — [DEV Community](https://dev.to/lasr21/live-translation-for-events-using-google-meet-ai-4nif)

### Inferences
- For the final report, Transync's Windows guide + BlackHole README + the Chromium gist cover the three OSes; Sokuji's README covers the "no drivers" extension path.

### Gaps
- No YouTube tutorials were located/verified in this pass.
- Pipecat and LiveKit READMEs were not researched (they are developer frameworks for building voice agents/bots rather than end-user routing guides); OBS-based setups were only touched via forum threads.
