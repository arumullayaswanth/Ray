import type { SVGProps } from "react";

const base = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const IconPlus = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export const IconSend = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
);

export const IconTrash = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

export const IconEdit = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
);

export const IconCopy = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export const IconSun = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
);

export const IconMoon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
);

export const IconMenu = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
);

export const IconStop = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
);

export const IconRefresh = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" />
    </svg>
);

export const IconSparkle = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5 10.1 11.9 4.5 10l5.6-1.4L12 3z" />
    </svg>
);

export const IconSettings = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

export const IconHistory = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
        <path d="M12 7v5l4 2" />
    </svg>
);

export const IconClose = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

export const IconArrowUp = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}>
        <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
);
