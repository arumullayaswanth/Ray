import type { ChatApiResponse, ChatMessage, HealthResponse } from "./types";

const MAX_HISTORY = 20;

/** Send a chat message with recent history. Throws on non-2xx with a readable message. */
export async function sendChat(
    message: string,
    history: ChatMessage[],
    signal?: AbortSignal
): Promise<ChatApiResponse> {
    const trimmed = history
        .filter((m) => !m.error)
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: trimmed }),
        signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const detail =
            typeof data?.detail === "string"
                ? data.detail
                : `Request failed (${res.status})`;
        throw new Error(detail);
    }
    return data as ChatApiResponse;
}

/** Poll the health endpoint. Returns null when offline. */
export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse | null> {
    try {
        const res = await fetch("/healthz", { signal });
        if (!res.ok) return null;
        return (await res.json()) as HealthResponse;
    } catch {
        return null;
    }
}
