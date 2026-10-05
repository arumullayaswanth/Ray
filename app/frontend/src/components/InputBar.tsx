import { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowUp, IconStop } from "./icons";

export interface SlashCommand {
    cmd: string;
    description: string;
    run: () => void;
}

interface Props {
    busy: boolean;
    commands: SlashCommand[];
    onSend: (text: string) => void;
    onStop: () => void;
}

const MAX_LEN = 4000;

export function InputBar({ busy, commands, onSend, onStop }: Props) {
    const [value, setValue] = useState("");
    const ref = useRef<HTMLTextAreaElement>(null);

    const showMenu = value.startsWith("/");
    const matches = useMemo(() => {
        if (!showMenu) return [];
        const q = value.slice(1).toLowerCase();
        return commands.filter((c) => c.cmd.slice(1).toLowerCase().startsWith(q));
    }, [value, showMenu, commands]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 220) + "px";
    }, [value]);

    const runCommand = (c: SlashCommand) => {
        c.run();
        setValue("");
    };

    const submit = () => {
        const text = value.trim();
        if (busy) return;
        if (text.startsWith("/")) {
            const match = commands.find((c) => c.cmd === text || c.cmd === text.split(" ")[0]);
            if (match) {
                runCommand(match);
                return;
            }
        }
        if (!text) return;
        onSend(text);
        setValue("");
    };

    return (
        <div className="inputbar-shell">
            {showMenu && matches.length > 0 && (
                <div className="slash-menu">
                    {matches.map((c) => (
                        <button key={c.cmd} type="button" onClick={() => runCommand(c)}>
                            <span className="slash-cmd">{c.cmd}</span>
                            <span className="slash-desc">{c.description}</span>
                        </button>
                    ))}
                </div>
            )}

            <form
                className="inputbar"
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
            >
                <textarea
                    ref={ref}
                    value={value}
                    maxLength={MAX_LEN}
                    rows={1}
                    placeholder="Ask anything, or type / for commands…"
                    aria-label="Message"
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            submit();
                        }
                    }}
                />
                {busy ? (
                    <button type="button" className="go stop" onClick={onStop} aria-label="Stop">
                        <IconStop width={18} height={18} />
                    </button>
                ) : (
                    <button type="submit" className="go" disabled={!value.trim()} aria-label="Send">
                        <IconArrowUp width={18} height={18} />
                    </button>
                )}
            </form>
            <div className="inputbar-foot">
                Gemini can make mistakes. Verify important information.
            </div>
        </div>
    );
}
