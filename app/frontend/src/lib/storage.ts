import type { Conversation, Settings } from "../types";

const CONV_KEY = "kuberay.conversations.v2";
const SETTINGS_KEY = "kuberay.settings.v2";

export const DEFAULT_SETTINGS: Settings = {
    systemPrompt: "You are a helpful assistant. Be concise.",
    model: "gemini-3.5-flash",
    temperature: 0.2,
    theme: "dark",
};

export function loadConversations(): Conversation[] {
    try {
        const raw = localStorage.getItem(CONV_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as Conversation[]) : [];
    } catch {
        return [];
    }
}

export function saveConversations(convs: Conversation[]): void {
    try {
        localStorage.setItem(CONV_KEY, JSON.stringify(convs));
    } catch {
        /* ignore */
    }
}

export function loadSettings(): Settings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) {
            const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
            return { ...DEFAULT_SETTINGS, theme: prefersDark ? "dark" : "light" };
        }
        return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings: Settings): void {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        /* ignore */
    }
}
