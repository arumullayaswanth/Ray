import { IconSparkle } from "./icons";

export function TypingIndicator() {
    return (
        <div className="msg-row assistant">
            <div className="avatar" aria-hidden="true">
                <IconSparkle width={16} height={16} />
            </div>
            <div className="msg-body">
                <div className="msg-meta">
                    <span className="msg-author">Agent</span>
                </div>
                <div className="bubble">
                    <div className="typing" aria-label="Agent is typing">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            </div>
        </div>
    );
}
