// src/types/app.ts
export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
    isStreaming?: boolean;
    error?: string | null;
}


export interface AppError {
    message: string;
    details?: string;
}