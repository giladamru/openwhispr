/**
 * Text-to-speech for English Coach Mode.
 *
 * Primary engine: Google Cloud Text-to-Speech "Chirp 3 HD" voices via the public
 * REST endpoint (the only Google tier with verified Hebrew he-IL support). Audio
 * comes back as base64 MP3 and is played through an HTMLAudioElement.
 *
 * Sections are queued and played strictly in order (English voice for the English
 * parts, Hebrew voice for the explanation). When no API key is configured or a
 * request fails (offline, quota, bad key), playback falls back to the browser's
 * built-in Web Speech API so the feature degrades gracefully and never throws.
 */
const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";

export type TtsLang = "en" | "he";

export interface TtsQueueItem {
  text: string;
  lang: TtsLang;
}

interface TtsConfig {
  apiKey?: string;
  enVoice?: string;
  heVoice?: string;
}

class TtsService {
  private apiKey = "";
  private enVoice = "en-US-Chirp3-HD-Charon";
  private heVoice = "he-IL-Chirp3-HD-Charon";
  private queue: TtsQueueItem[] = [];
  private playing = false;
  private cancelled = false;
  private currentAudio: HTMLAudioElement | null = null;
  // Cache synthesized audio so the 🔊 replay button doesn't re-hit the API.
  private cache = new Map<string, string>();

  configure(opts: TtsConfig): void {
    if (opts.apiKey !== undefined) this.apiKey = opts.apiKey || "";
    if (opts.enVoice) this.enVoice = opts.enVoice;
    if (opts.heVoice) this.heVoice = opts.heVoice;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /** Stops any in-progress playback and clears the queue. */
  cancel(): void {
    this.cancelled = true;
    this.queue = [];
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }
    try {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }
    this.playing = false;
  }

  /** Cancels current playback and speaks the given sections in order. */
  async speak(items: TtsQueueItem[]): Promise<void> {
    this.cancel();
    this.cancelled = false;
    this.queue = items.filter((i) => i.text && i.text.trim());
    if (this.queue.length === 0) return;
    await this.drain();
  }

  private async drain(): Promise<void> {
    if (this.playing) return;
    this.playing = true;
    while (this.queue.length && !this.cancelled) {
      const item = this.queue.shift()!;
      try {
        await this.playItem(item);
      } catch {
        if (!this.cancelled) await this.playWebSpeech(item);
      }
    }
    this.playing = false;
  }

  private voiceFor(lang: TtsLang): { languageCode: string; name: string } {
    return lang === "he"
      ? { languageCode: "he-IL", name: this.heVoice }
      : { languageCode: "en-US", name: this.enVoice };
  }

  private async playItem(item: TtsQueueItem): Promise<void> {
    if (!this.apiKey) {
      await this.playWebSpeech(item);
      return;
    }
    const dataUrl = await this.synthesize(item);
    if (this.cancelled) return;
    await this.playUrl(dataUrl);
  }

  private async synthesize(item: TtsQueueItem): Promise<string> {
    const voice = this.voiceFor(item.lang);
    const cacheKey = `${voice.name}|${item.text}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(this.apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: item.text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });

    if (!res.ok) {
      throw new Error(`Google TTS request failed: HTTP ${res.status}`);
    }

    const json = (await res.json()) as { audioContent?: string };
    if (!json.audioContent) {
      throw new Error("Google TTS response missing audioContent");
    }

    const url = `data:audio/mp3;base64,${json.audioContent}`;
    this.cache.set(cacheKey, url);
    return url;
  }

  private playUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      this.currentAudio = audio;
      audio.onended = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve();
      };
      audio.onerror = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        reject(new Error("Audio playback failed"));
      };
      audio.play().catch(reject);
    });
  }

  private playWebSpeech(item: TtsQueueItem): Promise<void> {
    return new Promise((resolve) => {
      if (this.cancelled || typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = item.lang === "he" ? "he-IL" : "en-US";
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}

export const ttsService = new TtsService();
export default ttsService;
