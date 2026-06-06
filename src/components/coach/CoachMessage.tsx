import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { parseCoachResponse } from "../../utils/parseCoachResponse";

interface CoachMessageProps {
  content: string;
  isStreaming: boolean;
  onSpeak: (content: string) => void;
}

/** Renders one coach reply as five labeled cards, with a replay (🔊) button. */
export function CoachMessage({ content, isStreaming, onSpeak }: CoachMessageProps) {
  const { t } = useTranslation();
  const parsed = parseCoachResponse(content);

  const hasSections =
    parsed.whatISaid ||
    parsed.betterEnglish ||
    parsed.moreNatural ||
    parsed.explanationHe ||
    parsed.continue;

  // Before any labels have streamed in, just show the raw text.
  if (!hasSections) {
    return (
      <div className="rounded-lg bg-surface-1 border border-border/30 px-3 py-2 text-sm whitespace-pre-wrap">
        {content}
        {isStreaming && <span className="ml-0.5 animate-pulse">▍</span>}
      </div>
    );
  }

  const cards: { key: string; label: string; value: string; rtl?: boolean; tone: string }[] = [
    {
      key: "whatISaid",
      label: t("coach.sections.whatISaid"),
      value: parsed.whatISaid,
      tone: "text-muted-foreground",
    },
    {
      key: "betterEnglish",
      label: t("coach.sections.betterEnglish"),
      value: parsed.betterEnglish,
      tone: "text-foreground",
    },
    {
      key: "moreNatural",
      label: t("coach.sections.moreNatural"),
      value: parsed.moreNatural,
      tone: "text-foreground",
    },
    {
      key: "explanationHe",
      label: t("coach.sections.explanationHe"),
      value: parsed.explanationHe,
      rtl: true,
      tone: "text-foreground/80",
    },
    {
      key: "continue",
      label: t("coach.sections.continue"),
      value: parsed.continue,
      tone: "text-primary",
    },
  ];

  return (
    <div className="relative rounded-lg bg-surface-1 border border-border/30 p-3 pr-9 flex flex-col gap-2.5">
      {cards
        .filter((c) => c.value)
        .map((c) => (
          <div key={c.key} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
              {c.label}
            </span>
            <p
              className={cn("text-sm leading-snug whitespace-pre-wrap", c.tone)}
              dir={c.rtl ? "rtl" : undefined}
            >
              {c.value}
            </p>
          </div>
        ))}

      {isStreaming && <span className="text-xs text-muted-foreground animate-pulse">…</span>}

      {!isStreaming && (
        <button
          onClick={() => onSpeak(content)}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-md",
            "text-muted-foreground hover:text-foreground hover:bg-foreground/10",
            "transition-colors duration-150",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/30"
          )}
          aria-label={t("coach.speak")}
          title={t("coach.speak")}
        >
          <Volume2 size={14} />
        </button>
      )}
    </div>
  );
}
