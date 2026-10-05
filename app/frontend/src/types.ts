export type Role = "user" | "assistant";

export interface ChatMessage {
    id: string;
    role: Role;
    content: string;
    createdAt: number;
    error?: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

export interface ChatApiResponse {
    answer: string;
    model: string;
}

export interface HealthResponse {
    status: string;
    model: string;
}

export type ThemeMode = "light" | "dark";

export interface Settings {
    systemPrompt: string;
    model: string;
    temperature: number;
    theme: ThemeMode;
}
