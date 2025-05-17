// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SIMULATE_AI: string;
    readonly VITE_SIMULATE_AI_DELAY: string;
    readonly VITE_SIMULATE_AI_ERROR_CHANCE: string;
    readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}