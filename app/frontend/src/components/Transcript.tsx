import { useState } from "react";
import type { ChatMessage } from "../types";
import { Markdown } from "./Markdown";
import { IconCheck, IconCopy, IconRefresh } from "./icons";

function Turn({
    message,
    isLast,
    onRegenerate,
}: {
    message: ChatMessage;
    isLast: boolean;
    onRegenerate?: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === "user";

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className={`turn ${isUser ? "user" : "assistant"}`}>
            <div className="turn-tag">{isUser ? "You" : "Agent"}</div>
            <div className={`turn-content ${message.error ? "error" : ""}`}>
                {isUser || message.error ? (
                    <p className="plain">{message.content}</p>
                ) : (
                    <Markdown content={message.content} />
                )}
            </div>
            {!isUser && !message.error && message.content && (
                <div className="turn-actions">
                    <button type="button" onClick={copy}>
                        {copied ? <IconCheck width={14} height={14} /> : <IconCopy width={14} height={14} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                    {isLast && onRegenerate && (
                        <button type="button" onClick={onRegenerate}>
                            <IconRefresh width={14} height={14} />
                            Regenerate
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

interface Props {
    messages: ChatMessage[];
    busy: boolean;
    onRegenerate: () => void;
}

export function Transcript({ messages, busy, onRegenerate }: Props) {
    return (
        <div className="transcript">
            {messages.map((m, i) => (
                <Turn
                    key={m.id}
                    message={m}
                    isLast={i === messages.length - 1}
                    onRegenerate={onRegenerate}
                />
            ))}
            {busy && (
                <div className="turn assistant">
                    <div className="turn-tag">Agent</div>
                    <div className="turn-content">
                        <div className="dots" aria-label="Thinking">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
