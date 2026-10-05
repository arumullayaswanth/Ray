import type { Conversation } from "../types";

export function uid(): string {
    return (
        Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
    );
}

export function newConversation(): Conversation {
    const now = Date.now();
    return {
        id: uid(),
        title: "New chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
    };
}

/** Derive a short title from the first user message. */
export function deriveTitle(text: string): string {
    const clean = text.trim().replace(/\s+/g, " ");
    if (!clean) return "New chat";
    return clean.length > 40 ? clean.slice(0, 40) + "…" : clean;
}

export function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function relativeDay(ts: number): string {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Group conversations by relative day for the sidebar. */
export function groupConversations(
    convs: Conversation[]
): { label: string; items: Conversation[] }[] {
    const sorted = [...convs].sort((a, b) => b.updatedAt - a.updatedAt);
    const groups = new Map<string, Conversation[]>();
    for (const c of sorted) {
        const label = relativeDay(c.updatedAt);
        const arr = groups.get(label) ?? [];
        arr.push(c);
        groups.set(label, arr);
    }
    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}
