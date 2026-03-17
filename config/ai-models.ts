/**
 * Static catalog of supported AI models.
 * Used in the onboarding UI dropdown so users can pick a model type.
 */
export type AiProvider = "openai" | "google" | "anthropic" | "other";

export interface AiModelOption {
    id: string;        // Unique ID used as dropdown value
    provider: AiProvider;
    modelId: string;   // Actual model string (e.g. gpt-4o, gemini-pro)
    label: string;     // Display label in UI
}

export const AI_MODEL_CATALOG: AiModelOption[] = [
    {
        id: "openai-gpt-4o",
        provider: "openai",
        modelId: "gpt-4o",
        label: "OpenAI — GPT-4o",
    },
    {
        id: "openai-gpt-4-turbo",
        provider: "openai",
        modelId: "gpt-4-turbo",
        label: "OpenAI — GPT-4 Turbo",
    },
    {
        id: "openai-gpt-3.5-turbo",
        provider: "openai",
        modelId: "gpt-3.5-turbo",
        label: "OpenAI — GPT-3.5 Turbo",
    },
    {
        id: "google-gemini-1.5-pro",
        provider: "google",
        modelId: "gemini-1.5-pro",
        label: "Google — Gemini 1.5 Pro",
    },
    {
        id: "google-gemini-1.5-flash",
        provider: "google",
        modelId: "gemini-1.5-flash",
        label: "Google — Gemini 1.5 Flash",
    },
    {
        id: "anthropic-claude-3-5-sonnet",
        provider: "anthropic",
        modelId: "claude-3-5-sonnet-20240620",
        label: "Anthropic — Claude 3.5 Sonnet",
    },
    {
        id: "anthropic-claude-3-haiku",
        provider: "anthropic",
        modelId: "claude-3-haiku-20240307",
        label: "Anthropic — Claude 3 Haiku",
    },
];
