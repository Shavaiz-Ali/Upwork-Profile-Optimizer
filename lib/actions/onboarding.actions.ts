"use server"

import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import AiModel from "@/lib/models/ai-model.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successActionResponse, errorActionResponse } from "@/lib/action-response";

export async function updateUserProfileAction(data: { displayName: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return errorActionResponse("Unauthorized");
        }

        await connectToDatabase();
        await User.findByIdAndUpdate(session.user.id, {
            displayName: data.displayName,
            onboardingCompleted: true,
        });

        return successActionResponse(null, "Profile updated successfully");
    } catch (error: any) {
        console.error("Update user profile error:", error);
        return errorActionResponse(error.message || "Failed to update profile");
    }
}

export async function updateAiConfigAction(data: {
    aiModel: string;
    aiApiKey: string;
    customPrompt?: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const { aiModel, aiApiKey, customPrompt } = data;
        if (!aiModel || !aiApiKey) {
            return errorActionResponse("AI model and API key are required");
        }

        await connectToDatabase();

        // Update AI Model with user-specific key and prompt
        await AiModel.findOneAndUpdate(
            { userId: session.user.id, _id: aiModel },
            { apiKey: aiApiKey, customPrompt },
            { new: true, runValidators: true }
        );

        return successActionResponse(null, "AI configuration saved successfully");
    } catch (error: any) {
        console.error("Update AI config error:", error);
        return errorActionResponse(error.message || "Failed to save AI configuration");
    }
}
