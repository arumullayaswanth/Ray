import type { Conversation } from "../types";
import { relativeDay } from "../lib/utils";
import { IconPlus, IconTrash } from "./icons";

interface Props {
    conversations: Conversation[];
    activeId: string | null;
    onNew: () => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export function HistoryPanel({
    conversations,
    activeId,
    onNew,
    onSelect,
    onDelete,
}: Props) {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <div className="history">
            <button type="button" className="history-new" onClick={onNew}>
                <IconPlus width={16} height={16} />
                Start a new chat
            </button>

            {sorted.length === 0 ? (
                <p className="history-empty">Your conversations will appear here.</p>
            ) : (
                <ul className="history-list">
                    {sorted.map((c) => (
                        <li
                            key={c.id}
                            className={`history-item ${c.id === activeId ? "active" : ""}`}
                        >
                            <button type="button" className="history-pick" onClick={() => onSelect(c.id)}>
                                <span className="history-title">{c.title}</span>
                                <span className="history-sub">
                                    {c.messages.length} messages · {relativeDay(c.updatedAt)}
                                </span>
                            </button>
                            <button
                                type="button"
                                className="history-del"
                                aria-label="Delete conversation"
                                onClick={() => onDelete(c.id)}
                            >
                                <IconTrash width={15} height={15} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
