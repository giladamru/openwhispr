import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReasoningService, { type AgentStreamChunk } from "../services/ReasoningService";
import { getSettings } from "../stores/settingsStore";
import { resolvePrompt } from "../config/prompts";
import { parseCoachResponse } from "../utils/parseCoachResponse";
import { ttsService, type TtsQueueItem } from "../services/ttsService";
import type { Message, AgentState } from "../components/chat/types";

const HISTORY_LIMIT = 20;

/**
 * Conversation + streaming loop for English Coach Mode.
 *
 * Mirrors src/components/chat/useChatStreaming.ts (same cloud-vs-local decision and
 * chunk accumulation) but with a fixed "tutor" system prompt, no tools, and no RAG.
 * After each turn it parses the reply into five sections and, when enabled, reads
 * them aloud via the TTS service (English voice for the English parts, Hebrew voice
 * for the explanation). The conversation is kept in memory only.
 */
export interface EnglishCoach {
  messages: Message[];
  state: AgentState;
  sendTranscript: (text: string) => Promise<void>;
  speakMessage: (content: string) => void;
  cancel: () => void;
  newConversation: () => void;
}

function configureTts(): void {
  const s = getSettings();
  ttsService.configure({
    apiKey: s.googleTtsApiKey,
    enVoice: s.coachEnglishVoice,
    heVoice: s.coachHebrewVoice,
  });
}

/** Builds the ordered TTS queue from a parsed coach reply: English parts, then Hebrew. */
function buildSpeechQueue(content: string, speakHebrew: boolean): TtsQueueItem[] {
  const parsed = parseCoachResponse(content);
  const queue: TtsQueueItem[] = [];
  if (parsed.betterEnglish) queue.push({ text: parsed.betterEnglish, lang: "en" });
  if (parsed.moreNatural && parsed.moreNatural !== parsed.betterEnglish) {
    queue.push({ text: parsed.moreNatural, lang: "en" });
  }
  if (parsed.continue) queue.push({ text: parsed.continue, lang: "en" });
  if (speakHebrew && parsed.explanationHe) {
    queue.push({ text: parsed.explanationHe, lang: "he" });
  }
  return queue;
}

export function useEnglishCoach(): EnglishCoach {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<AgentState>("idle");
  const mountedRef = useRef(true);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      ReasoningService.cancelActiveStream();
      ttsService.cancel();
    };
  }, []);

  const speakMessage = useCallback((content: string) => {
    configureTts();
    const queue = buildSpeechQueue(content, getSettings().coachSpeakHebrew);
    if (queue.length) void ttsService.speak(queue);
  }, []);

  const cancel = useCallback(() => {
    ReasoningService.cancelActiveStream();
    ttsService.cancel();
    setState("idle");
  }, []);

  const newConversation = useCallback(() => {
    ReasoningService.cancelActiveStream();
    ttsService.cancel();
    setMessages([]);
    setState("idle");
  }, []);

  const sendTranscript = useCallback(
    async (text: string) => {
      const transcript = text?.trim();
      if (!transcript) return;

      ttsService.cancel();
      setState("thinking");

      const settings = getSettings();
      const chatAgentMode = settings.chatAgentMode || "openwhispr";
      const isCloudAgent = chatAgentMode === "openwhispr" && settings.isSignedIn;
      const isLanAgent = chatAgentMode === "self-hosted" && !!settings.chatAgentRemoteUrl;
      const isCustomAgent =
        chatAgentMode === "providers" && settings.chatAgentProvider === "custom";

      const systemPrompt = resolvePrompt("englishCoach", {
        agentName: null,
        uiLanguage: settings.uiLanguage,
      });

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: transcript,
        isStreaming: false,
      };
      const history = [...messagesRef.current, userMsg];
      setMessages(history);

      const llmMessages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-HISTORY_LIMIT).map((m) => ({ role: m.role, content: m.content })),
      ];

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", isStreaming: true },
      ]);
      setState("streaming");

      try {
        let fullContent = "";
        let stream: AsyncGenerator<AgentStreamChunk>;

        if (isCloudAgent) {
          stream = ReasoningService.processTextStreamingCloud(llmMessages, { systemPrompt });
        } else {
          stream = ReasoningService.processTextStreamingAI(
            llmMessages,
            settings.chatAgentModel,
            settings.chatAgentProvider,
            {
              systemPrompt,
              lanUrl: isLanAgent ? settings.chatAgentRemoteUrl : undefined,
              baseUrl: isCustomAgent ? settings.chatAgentCloudBaseUrl || undefined : undefined,
              customApiKey: isCustomAgent ? settings.chatAgentCustomApiKey || undefined : undefined,
              disableThinking: settings.chatAgentDisableThinking,
            }
          );
        }

        for await (const chunk of stream) {
          if (!mountedRef.current) {
            ReasoningService.cancelActiveStream();
            break;
          }
          if (chunk.type === "content") {
            fullContent += chunk.text;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: fullContent } : m))
            );
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
        );

        if (mountedRef.current && fullContent.trim() && getSettings().coachAutoSpeak) {
          configureTts();
          const queue = buildSpeechQueue(fullContent, getSettings().coachSpeakHebrew);
          if (queue.length) void ttsService.speak(queue);
        }
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `${t("coach.errorPrefix")}: ${(error as Error).message}`,
                  isStreaming: false,
                }
              : m
          )
        );
      }

      if (mountedRef.current) setState("idle");
    },
    [t]
  );

  return { messages, state, sendTranscript, speakMessage, cancel, newConversation };
}
