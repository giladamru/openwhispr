/**
 * Parses the English Coach model output into its five fixed sections.
 *
 * The coach prompt instructs the model to reply with exactly these labels, in order:
 *   What I said: / Better English: / More natural: / Explanation in Hebrew: /
 *   Continue the conversation:
 *
 * Parsing is intentionally tolerant: labels are matched case-insensitively, the
 * trailing colon is optional, stray markdown markers around a label are ignored,
 * and any missing section simply yields an empty string. The raw text is always
 * preserved so the UI can fall back to showing it verbatim when no labels match.
 */
export interface CoachResponse {
  whatISaid: string;
  betterEnglish: string;
  moreNatural: string;
  explanationHe: string;
  continue: string;
  /** The original, untrimmed-of-meaning model text (trimmed of outer whitespace). */
  raw: string;
}

type SectionKey = Exclude<keyof CoachResponse, "raw">;

const SECTION_DEFS: { key: SectionKey; label: string }[] = [
  { key: "whatISaid", label: "What I said" },
  { key: "betterEnglish", label: "Better English" },
  { key: "moreNatural", label: "More natural" },
  { key: "explanationHe", label: "Explanation in Hebrew" },
  { key: "continue", label: "Continue the conversation" },
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseCoachResponse(text: string): CoachResponse {
  const raw = (text || "").trim();
  const result: CoachResponse = {
    whatISaid: "",
    betterEnglish: "",
    moreNatural: "",
    explanationHe: "",
    continue: "",
    raw,
  };

  if (!raw) return result;

  // Locate each label. Allow it to start at the beginning of the text or after a
  // newline, tolerate leading markdown markers (#, *, -, >) and an optional colon.
  const matches: { key: SectionKey; matchStart: number; contentStart: number }[] = [];
  for (const { key, label } of SECTION_DEFS) {
    // Optional leading markers (#, *, _, >, -), the label, then an optional
    // trailing wrapper (**label**), an optional separator (: or a dash), and spaces.
    const re = new RegExp(
      `(?:^|\\n)[ \\t]*[#*_>\\-]*[ \\t]*${escapeRegExp(label)}[ \\t]*[*_]*[ \\t]*[:\\-–—]?[ \\t]*`,
      "i"
    );
    const m = re.exec(raw);
    if (m) {
      matches.push({ key, matchStart: m.index, contentStart: m.index + m[0].length });
    }
  }

  if (matches.length === 0) return result;

  // Order sections by where they actually appear in the text.
  matches.sort((a, b) => a.contentStart - b.contentStart);

  for (let i = 0; i < matches.length; i++) {
    const end = i + 1 < matches.length ? matches[i + 1].matchStart : raw.length;
    result[matches[i].key] = raw.slice(matches[i].contentStart, end).trim();
  }

  return result;
}
