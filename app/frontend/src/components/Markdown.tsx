import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IconCheck, IconCopy } from "./icons";

function CodeBlock({ language, value }: { language: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <div className="code-block">
            <div className="code-head">
                <span className="code-lang">{language || "text"}</span>
                <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">
                    {copied ? <IconCheck width={14} height={14} /> : <IconCopy width={14} height={14} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <SyntaxHighlighter
                language={language || "text"}
                style={oneDark}
                customStyle={{ margin: 0, borderRadius: "0 0 10px 10px", fontSize: "0.85rem" }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
}

export function Markdown({ content }: { content: string }) {
    return (
        <div className="markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const text = String(children).replace(/\n$/, "");
                        const isInline = !className && !text.includes("\n");
                        if (isInline) {
                            return (
                                <code className="inline-code" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return <CodeBlock language={match?.[1] ?? ""} value={text} />;
                    },
                    a({ children, ...props }) {
                        return (
                            <a target="_blank" rel="noreferrer noopener" {...props}>
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
