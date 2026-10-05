import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, Conversation, HealthResponse, Settings } from "./types";
import { fetchHealth, sendChat } from "./api";
import {
    loadConversations,
    loadSettings,
    saveConversations,
    saveSettings,
} from "./lib/storage";
import { deriveTitle, newConversation, uid } from "./lib/utils";
import { Transcript } from "./components/Transcript";
import { InputBar, type SlashCommand } from "./components/InputBar";
import { Panel } from "./components/Panel";
import { SettingsPanel } from "./components/SettingsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { IconHistory, IconSettings, IconSparkle } from "./components/icons";

const PROMPTS = [
    "Explain KubeRay autoscaling simply",
    "Write a Python retry decorator",
    "Compare REST and gRPC",
    "Give me a git rebase cheatsheet",
];

export function App() {
    const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
    const [activeId, setActiveId] = useState<string | null>(
        () => loadConversations()[0]?.id ?? null
    );
    const [settings, setSettings] = useState<Settings>(() => loadSettings());
    const [busy, setBusy] = useState(false);
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [online, setOnline] = useState<boolean | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const abortRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const active = useMemo(
        () => conversations.find((c) => c.id === activeId) ?? null,
        [conversations, activeId]
    );
    const messages = active?.messages ?? [];

    useEffect(() => saveConversations(conversations), [conversations]);
    useEffect(() => {
        document.documentElement.dataset.theme = settings.theme;
        saveSettings(settings);
    }, [settings]);

    useEffect(() => {
        let cancelled = false;
        const poll = async () => {
            const h = await fetchHealth();
            if (cancelled) return;
            setHealth(h);
            setOnline(h !== null);
        };
        poll();
        const id = setInterval(poll, 20000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, busy]);

    const upsert = useCallback((conv: Conversation) => {
        setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === conv.id);
            if (idx === -1) return [conv, ...prev];
            const copy = [...prev];
            copy[idx] = conv;
            return copy;
        });
    }, []);

    const ensureActive = useCallback((): Conversation => {
        if (active) return active;
        const conv = newConversation();
        upsert(conv);
        setActiveId(conv.id);
        return conv;
    }, [active, upsert]);

    const run = useCallback(
        async (conv: Conversation, history: ChatMessage[], userText: string) => {
            setBusy(true);
            const controller = new AbortController();
            abortRef.current = controller;
            try {
                const res = await sendChat(userText, history, controller.signal);
                const assistant: ChatMessage = {
                    id: uid(),
                    role: "assistant",
                    content: res.answer || "(empty response)",
                    createdAt: Date.now(),
                };
                upsert({ ...conv, messages: [...history, assistant], updatedAt: Date.now() });
            } catch (err) {
                if (controller.signal.aborted) {
                    setBusy(false);
                    return;
                }
                const msg = err instanceof Error ? err.message : "Something went wrong";
                upsert({
                    ...conv,
                    messages: [
                        ...history,
                        { id: uid(), role: "assistant", content: "Error: " + msg, createdAt: Date.now(), error: true },
                    ],
                    updatedAt: Date.now(),
                });
            } finally {
                abortRef.current = null;
                setBusy(false);
            }
        },
        [upsert]
    );

    const handleSend = useCallback(
        (text: string) => {
            const conv = ensureActive();
            const userMsg: ChatMessage = { id: uid(), role: "user", content: text, createdAt: Date.now() };
            const history = [...conv.messages, userMsg];
            const titled: Conversation = {
                ...conv,
                title: conv.messages.length === 0 ? deriveTitle(text) : conv.title,
                messages: history,
                updatedAt: Date.now(),
            };
            upsert(titled);
            void run(titled, history, text);
        },
        [ensureActive, run, upsert]
    );

    const handleRegenerate = useCallback(() => {
        if (!active || busy) return;
        const msgs = [...active.messages];
        while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
        const lastUser = [...msgs].reverse().find((m) => m.role === "user");
        if (!lastUser) return;
        const base: Conversation = { ...active, messages: msgs };
        upsert(base);
        void run(base, msgs, lastUser.content);
    }, [active, busy, run, upsert]);

    const handleStop = useCallback(() => {
        abortRef.current?.abort();
        setBusy(false);
    }, []);

    const handleNew = useCallback(() => {
        const conv = newConversation();
        upsert(conv);
        setActiveId(conv.id);
        setHistoryOpen(false);
    }, [upsert]);

    const handleClear = useCallback(() => {
        if (!active) return;
        upsert({ ...active, messages: [], updatedAt: Date.now() });
    }, [active, upsert]);

    const handleDelete = useCallback(
        (id: string) => {
            setConversations((prev) => {
                const next = prev.filter((c) => c.id !== id);
                if (id === activeId) setActiveId(next[0]?.id ?? null);
                return next;
            });
        },
        [activeId]
    );

    const commands: SlashCommand[] = useMemo(
        () => [
            { cmd: "/new", description: "Start a new conversation", run: handleNew },
            { cmd: "/clear", description: "Clear the current chat", run: handleClear },
            { cmd: "/settings", description: "Open settings", run: () => setSettingsOpen(true) },
            { cmd: "/history", description: "Open conversation history", run: () => setHistoryOpen(true) },
        ],
        [handleNew, handleClear]
    );

    const patchSettings = (patch: Partial<Settings>) =>
        setSettings((s) => ({ ...s, ...patch }));

    return (
        <div className="stage">
            <header className="bar">
                <div className="bar-brand">
                    <span className="bar-mark">
                        <IconSparkle width={16} height={16} />
                    </span>
                    <div className="bar-id">
                        <span className="bar-name">Yashacademy Agent</span>
                        <span className={`beam ${online === null ? "" : online ? "ok" : "down"}`}>
                            <i />
                            {online === null ? "Connecting" : online ? `Live · ${health?.model ?? settings.model}` : "Offline"}
                        </span>
                    </div>
                </div>
                <div className="bar-tools">
                    <button type="button" onClick={() => setHistoryOpen(true)} aria-label="History">
                        <IconHistory width={18} height={18} />
                    </button>
                    <button type="button" onClick={() => setSettingsOpen(true)} aria-label="Settings">
                        <IconSettings width={18} height={18} />
                    </button>
                </div>
            </header>

            <div className="canvas" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="intro">
                        <div className="intro-mark">
                            <IconSparkle width={30} height={30} />
                        </div>
                        <h1>What should we build?</h1>
                        <p>A minimal workspace for the KubeRay Gemini agent.</p>
                        <div className="intro-prompts">
                            {PROMPTS.map((p) => (
                                <button key={p} type="button" onClick={() => handleSend(p)}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Transcript messages={messages} busy={busy} onRegenerate={handleRegenerate} />
                )}
            </div>

            <InputBar busy={busy} commands={commands} onSend={handleSend} onStop={handleStop} />

            <Panel open={historyOpen} title="History" onClose={() => setHistoryOpen(false)}>
                <HistoryPanel
                    conversations={conversations}
                    activeId={activeId}
                    onNew={handleNew}
                    onSelect={(id) => {
                        setActiveId(id);
                        setHistoryOpen(false);
                    }}
                    onDelete={handleDelete}
                />
            </Panel>

            <Panel open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
                <SettingsPanel settings={settings} onChange={patchSettings} />
            </Panel>
        </div>
    );
}
