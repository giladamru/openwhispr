import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import AudioManager from "../../helpers/audioManager";
import { ChatInput } from "../chat/ChatInput";
import { ChatEmptyIllustration } from "../chat/ChatEmptyIllustration";
import { CoachMessage } from "./CoachMessage";
import { useEnglishCoach } from "../../hooks/useEnglishCoach";
import type { AgentState } from "../chat/types";

const MIN_HEIGHT = 200;
const MIN_WIDTH = 360;

/**
 * Dedicated English Coach window (loaded with ?coach=true). Mirrors AgentOverlay:
 * runs its own AudioManager (skip reasoning, forced English transcription) and pipes
 * the transcript into the coach streaming loop, rendering five-section feedback cards
 * and reading them aloud.
 */
export default function CoachOverlay() {
  const { t } = useTranslation();
  const [partialTranscript, setPartialTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioManagerRef = useRef<InstanceType<typeof AudioManager> | null>(null);
  const recordingRef = useRef(false);

  const coach = useEnglishCoach();
  const { messages, sendTranscript, speakMessage, cancel, newConversation } = coach;

  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);

  const handleTranscriptionComplete = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      void sendTranscript(text);
    },
    [sendTranscript]
  );

  useEffect(() => {
    const am = new AudioManager();
    am.setSkipReasoning(true);
    am.setContext("coach");
    am.setLanguageOverride("en");
    am.setCallbacks({
      onStateChange: (s: { isRecording?: boolean; isProcessing?: boolean }) => {
        setIsRecording(!!s?.isRecording);
        setIsProcessing(!!s?.isProcessing);
      },
      onError: () => {
        setIsRecording(false);
        setIsProcessing(false);
      },
      onTranscriptionComplete: (result: { text: string }) => {
        handleTranscriptionComplete(result.text);
      },
      onPartialTranscript: (text: string) => {
        setPartialTranscript(text);
      },
      onStreamingCommit: undefined,
    });
    audioManagerRef.current = am;
    return () => {
      am.cleanup?.();
    };
  }, [handleTranscriptionComplete]);

  // Sync STT config so streaming/batch selection matches the rest of the app.
  useEffect(() => {
    window.electronAPI?.getSttConfig?.().then((config) => {
      if (config?.success && audioManagerRef.current) {
        audioManagerRef.current.setSttConfig(config);
      }
    });
  }, []);

  const startRecording = useCallback(() => {
    setPartialTranscript("");
    audioManagerRef.current?.startRecording();
  }, []);

  const stopRecording = useCallback(() => {
    audioManagerRef.current?.stopRecording();
  }, []);

  // Global-hotkey-driven recording events from the main process.
  useEffect(() => {
    const unsubStart = window.electronAPI?.onCoachStartRecording?.(() => startRecording());
    const unsubStop = window.electronAPI?.onCoachStopRecording?.(() => stopRecording());
    const unsubToggle = window.electronAPI?.onCoachToggleRecording?.(() => {
      if (recordingRef.current) stopRecording();
      else startRecording();
    });
    return () => {
      unsubStart?.();
      unsubStop?.();
      unsubToggle?.();
    };
  }, [startRecording, stopRecording]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.electronAPI?.hideCoachOverlay?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.screenX;
    const startY = e.screenY;

    window.electronAPI?.getCoachWindowBounds?.().then((bounds) => {
      if (!bounds) return;
      const startBounds = { ...bounds };

      const handleMouseMove = (ev: MouseEvent) => {
        const dx = ev.screenX - startX;
        const dy = ev.screenY - startY;
        let { x, y, width, height } = startBounds;

        if (direction.includes("e")) width += dx;
        if (direction.includes("w")) {
          x += dx;
          width -= dx;
        }
        if (direction.includes("s")) height += dy;
        if (direction.includes("n")) {
          y += dy;
          height -= dy;
        }

        width = Math.max(MIN_WIDTH, width);
        height = Math.max(MIN_HEIGHT, height);

        window.electronAPI?.setCoachWindowBounds?.(x, y, width, height);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });
  }, []);

  const handleNewChat = useCallback(() => {
    newConversation();
    setPartialTranscript("");
  }, [newConversation]);

  const handleClose = useCallback(() => {
    window.electronAPI?.hideCoachOverlay?.();
  }, []);

  const inputState: AgentState = isRecording
    ? "listening"
    : isProcessing
      ? "transcribing"
      : coach.state;

  return (
    <div className="coach-overlay-window w-screen h-screen bg-transparent relative">
      <div
        className={cn(
          "flex flex-col w-full h-full",
          "bg-surface-0",
          "border border-border/50 rounded-lg",
          "shadow-[var(--shadow-elevated)]",
          "overflow-hidden"
        )}
      >
        {/* Title bar */}
        <div
          className={cn(
            "flex items-center justify-between h-8 px-3",
            "bg-surface-1 border-b border-border/20 select-none"
          )}
          style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        >
          <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
            {t("coach.title")}
          </span>
          <div
            className="flex items-center gap-0.5"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <button
              onClick={handleNewChat}
              className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/30"
              aria-label={t("coach.newConversation")}
              title={t("coach.newConversation")}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/30"
              aria-label={t("coach.close")}
              title={t("coach.close")}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto agent-chat-scroll px-3 py-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full -mt-4 select-none text-center px-4">
              <ChatEmptyIllustration size={48} />
              <p className="text-xs text-foreground/50 dark:text-foreground/25 mt-3">
                {t("coach.emptyState")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div
                    key={m.id}
                    className="self-end max-w-[85%] rounded-lg bg-primary/90 text-primary-foreground px-3 py-1.5 text-sm whitespace-pre-wrap"
                  >
                    {m.content}
                  </div>
                ) : (
                  <CoachMessage
                    key={m.id}
                    content={m.content}
                    isStreaming={m.isStreaming}
                    onSpeak={speakMessage}
                  />
                )
              )}
            </div>
          )}
        </div>

        <ChatInput
          agentState={inputState}
          partialTranscript={partialTranscript}
          onTextSubmit={handleTranscriptionComplete}
          onCancel={cancel}
          autoFocus
        />
      </div>

      {/* Resize handles -- edges */}
      <div
        className="absolute top-0 left-2 right-2 h-[5px] cursor-n-resize"
        onMouseDown={(e) => handleResizeStart(e, "n")}
      />
      <div
        className="absolute bottom-0 left-2 right-2 h-[5px] cursor-s-resize"
        onMouseDown={(e) => handleResizeStart(e, "s")}
      />
      <div
        className="absolute left-0 top-2 bottom-2 w-[5px] cursor-w-resize"
        onMouseDown={(e) => handleResizeStart(e, "w")}
      />
      <div
        className="absolute right-0 top-2 bottom-2 w-[5px] cursor-e-resize"
        onMouseDown={(e) => handleResizeStart(e, "e")}
      />

      {/* Resize handles -- corners */}
      <div
        className="absolute top-0 left-0 w-[10px] h-[10px] cursor-nw-resize"
        onMouseDown={(e) => handleResizeStart(e, "nw")}
      />
      <div
        className="absolute top-0 right-0 w-[10px] h-[10px] cursor-ne-resize"
        onMouseDown={(e) => handleResizeStart(e, "ne")}
      />
      <div
        className="absolute bottom-0 left-0 w-[10px] h-[10px] cursor-sw-resize"
        onMouseDown={(e) => handleResizeStart(e, "sw")}
      />
      <div
        className="absolute bottom-0 right-0 w-[10px] h-[10px] cursor-se-resize"
        onMouseDown={(e) => handleResizeStart(e, "se")}
      />
    </div>
  );
}
