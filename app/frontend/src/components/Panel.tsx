import type { ReactNode } from "react";
import { IconClose } from "./icons";

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

/** Right-side slide-over panel used for History and Settings. */
export function Panel({ open, title, onClose, children }: Props) {
    return (
        <>
            <div className={`panel-scrim ${open ? "show" : ""}`} onClick={onClose} />
            <aside className={`panel ${open ? "open" : ""}`} role="dialog" aria-label={title}>
                <header className="panel-head">
                    <h2>{title}</h2>
                    <button type="button" className="panel-close" onClick={onClose} aria-label="Close">
                        <IconClose width={18} height={18} />
                    </button>
                </header>
                <div className="panel-body">{children}</div>
            </aside>
        </>
    );
}
