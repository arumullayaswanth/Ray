import type { Settings } from "../types";

const MODELS = [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
];

interface Props {
    settings: Settings;
    onChange: (patch: Partial<Settings>) => void;
}

export function SettingsPanel({ settings, onChange }: Props) {
    return (
        <div className="settings">
            <label className="field">
                <span className="field-label">System prompt</span>
                <textarea
                    className="field-textarea"
                    rows={5}
                    value={settings.systemPrompt}
                    onChange={(e) => onChange({ systemPrompt: e.target.value })}
                    placeholder="Describe how the assistant should behave…"
                />
                <span className="field-hint">
                    Stored locally as your preference for new chats.
                </span>
            </label>

            <label className="field">
                <span className="field-label">Model</span>
                <select
                    className="field-select"
                    value={settings.model}
                    onChange={(e) => onChange({ model: e.target.value })}
                >
                    {MODELS.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </label>

            <label className="field">
                <span className="field-label">
                    Temperature <strong>{settings.temperature.toFixed(1)}</strong>
                </span>
                <input
                    className="field-range"
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={settings.temperature}
                    onChange={(e) => onChange({ temperature: Number(e.target.value) })}
                />
                <span className="field-hint">Lower is more focused, higher is more creative.</span>
            </label>

            <div className="field">
                <span className="field-label">Appearance</span>
                <div className="segment">
                    <button
                        type="button"
                        className={settings.theme === "light" ? "active" : ""}
                        onClick={() => onChange({ theme: "light" })}
                    >
                        Light
                    </button>
                    <button
                        type="button"
                        className={settings.theme === "dark" ? "active" : ""}
                        onClick={() => onChange({ theme: "dark" })}
                    >
                        Dark
                    </button>
                </div>
            </div>
        </div>
    );
}
