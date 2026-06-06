import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Toggle } from "../ui/toggle";
import { Input } from "../ui/input";
import { SettingsPanel, SettingsPanelRow, SettingsRow, SectionHeader } from "../ui/SettingsSection";
import PromptStudio from "../ui/PromptStudio";

// A small curated set of Chirp 3 HD voices (the only Google tier with he-IL support).
const ENGLISH_VOICES = [
  "en-US-Chirp3-HD-Charon",
  "en-US-Chirp3-HD-Kore",
  "en-US-Chirp3-HD-Aoede",
  "en-US-Chirp3-HD-Puck",
  "en-US-Chirp3-HD-Leda",
];
const HEBREW_VOICES = [
  "he-IL-Chirp3-HD-Charon",
  "he-IL-Chirp3-HD-Kore",
  "he-IL-Chirp3-HD-Aoede",
  "he-IL-Chirp3-HD-Puck",
];

const selectClass =
  "h-7 rounded border border-border/70 bg-surface-1/80 px-2.5 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40";

export default function CoachSettings() {
  const { t } = useTranslation();
  const {
    appMode,
    setAppMode,
    googleTtsApiKey,
    setGoogleTtsApiKey,
    coachAutoSpeak,
    setCoachAutoSpeak,
    coachSpeakHebrew,
    setCoachSpeakHebrew,
    coachEnglishVoice,
    setCoachEnglishVoice,
    coachHebrewVoice,
    setCoachHebrewVoice,
  } = useSettings();

  const isCoach = appMode === "coach";

  return (
    <div className="space-y-4">
      <SectionHeader
        title={t("coach.settings.title")}
        description={t("coach.settings.description")}
      />

      <SettingsPanel>
        <SettingsPanelRow>
          <SettingsRow
            label={t("coach.settings.enable")}
            description={t("coach.settings.enableDescription")}
          >
            <Toggle checked={isCoach} onChange={(v) => setAppMode(v ? "coach" : "dictation")} />
          </SettingsRow>
        </SettingsPanelRow>
      </SettingsPanel>

      {isCoach && (
        <>
          <SettingsPanel>
            <SettingsPanelRow>
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">
                  {t("coach.settings.googleTtsApiKey")}
                </p>
                <Input
                  type="password"
                  value={googleTtsApiKey}
                  onChange={(e) => setGoogleTtsApiKey(e.target.value)}
                  placeholder={t("coach.settings.googleTtsApiKeyPlaceholder")}
                  className="text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {t("coach.settings.googleTtsApiKeyDescription")}
                </p>
              </div>
            </SettingsPanelRow>
          </SettingsPanel>

          <SettingsPanel>
            <SettingsPanelRow>
              <SettingsRow
                label={t("coach.settings.autoSpeak")}
                description={t("coach.settings.autoSpeakDescription")}
              >
                <Toggle checked={coachAutoSpeak} onChange={setCoachAutoSpeak} />
              </SettingsRow>
            </SettingsPanelRow>
            <SettingsPanelRow>
              <SettingsRow
                label={t("coach.settings.speakHebrew")}
                description={t("coach.settings.speakHebrewDescription")}
              >
                <Toggle checked={coachSpeakHebrew} onChange={setCoachSpeakHebrew} />
              </SettingsRow>
            </SettingsPanelRow>
          </SettingsPanel>

          <SettingsPanel>
            <SettingsPanelRow>
              <SettingsRow
                label={t("coach.settings.englishVoice")}
                description={t("coach.settings.englishVoiceDescription")}
              >
                <select
                  value={coachEnglishVoice}
                  onChange={(e) => setCoachEnglishVoice(e.target.value)}
                  className={selectClass}
                >
                  {ENGLISH_VOICES.map((v) => (
                    <option key={v} value={v}>
                      {v.replace("en-US-Chirp3-HD-", "")}
                    </option>
                  ))}
                </select>
              </SettingsRow>
            </SettingsPanelRow>
            {coachSpeakHebrew && (
              <SettingsPanelRow>
                <SettingsRow
                  label={t("coach.settings.hebrewVoice")}
                  description={t("coach.settings.hebrewVoiceDescription")}
                >
                  <select
                    value={coachHebrewVoice}
                    onChange={(e) => setCoachHebrewVoice(e.target.value)}
                    className={selectClass}
                  >
                    {HEBREW_VOICES.map((v) => (
                      <option key={v} value={v}>
                        {v.replace("he-IL-Chirp3-HD-", "")}
                      </option>
                    ))}
                  </select>
                </SettingsRow>
              </SettingsPanelRow>
            )}
          </SettingsPanel>

          <div className="border-t border-border/40 pt-6">
            <SectionHeader
              title={t("coach.settings.promptTitle")}
              description={t("coach.settings.promptDescription")}
            />
            <PromptStudio kind="englishCoach" />
          </div>
        </>
      )}
    </div>
  );
}
