import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { AiProvider } from "@/config/ai-models";

/**
 * Returns a Vercel AI SDK model instance for the given provider + modelId + API key.
 * Keeps all provider initialization in one place.
 */
export function getProviderModel(provider: AiProvider, modelId: string, apiKey: string) {
    switch (provider) {
        case "openai": {
            const openai = createOpenAI({ apiKey });
            return openai(modelId);
        }
        case "google": {
            const google = createGoogleGenerativeAI({ apiKey });
            return google(modelId);
        }
        case "anthropic": {
            const anthropic = createAnthropic({ apiKey });
            return anthropic(modelId);
        }
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
