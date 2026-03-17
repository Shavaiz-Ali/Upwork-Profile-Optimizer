"use server";

import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import UserApiKey from "@/lib/models/user-api-key.model";
import AiModel from "@/lib/models/ai-model.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successActionResponse, errorActionResponse } from "@/lib/action-response";

/**
 * Step 1 of onboarding: save the user's display name.
 */
export async function updateUserProfileAction(data: { displayName: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return errorActionResponse("Unauthorized");
        }

        await connectToDatabase();

        await User.findByIdAndUpdate(session.user.id, {
            displayName: data.displayName,
        });

        return successActionResponse(null, "Profile updated successfully");
    } catch (error: any) {
        console.error("Update user profile error:", error);
        return errorActionResponse(error.message || "Failed to update profile");
    }
}

/**
 * Step 2 of onboarding:
 * - Save the API key to UserApiKey (key is hidden by default via select:false).
 * - Create/update the AiModel configuration referencing that key.
 * - Mark the user's onboarding as complete.
 */
export async function updateAiConfigAction(data: {
    modelId: string;        // The selected AiModel _id (from the dropdown)
    provider: string;       // e.g. "openai", "google", "anthropic", "other"
    apiKey: string;         // The raw API key entered by the user
    modelName: string;      // Human readable config name e.g. "My OpenAI Setup"
    customPrompt?: string;  // Optional system prompt
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return errorActionResponse("Unauthorized");
        }

        const { modelId, provider, apiKey, modelName, customPrompt } = data;

        if (!modelId || !provider || !apiKey || !modelName) {
            return errorActionResponse("All fields are required");
        }

        await connectToDatabase();

        const userId = session.user.id;

        // 1. Upsert the API key for this user + provider combo
        const apiKeyDoc = await UserApiKey.findOneAndUpdate(
            { userId, provider },
            { key: apiKey, label: `${provider} key`, isActive: true },
            { new: true, upsert: true, runValidators: true }
        );

        // 2. Upsert the AI model configuration
        await AiModel.findOneAndUpdate(
            { userId, name: modelName },
            {
                userId,
                apiKeyId: apiKeyDoc._id,
                modelId,
                name: modelName,
                settings: customPrompt ? new Map([["customPrompt", customPrompt]]) : new Map(),
                isActive: true,
            },
            { new: true, upsert: true, runValidators: true }
        );

        // 3. Mark user onboarding as complete
        await User.findByIdAndUpdate(userId, { onboardingCompleted: true });

        return successActionResponse(null, "AI configuration saved successfully");
    } catch (error: any) {
        console.error("Update AI config error:", error);
        return errorActionResponse(error.message || "Failed to save AI configuration");
    }
}
