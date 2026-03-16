"use server";

import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: {
    displayName: string;
    aiModel: string;
    aiApiKey: string;
    customPrompt?: string;
}) {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized");
    }

    try {
        await User.findByIdAndUpdate(session.user.id, {
            displayName: formData.displayName,
            aiModel: formData.aiModel,
            aiApiKey: formData.aiApiKey,
            customPrompt: formData.customPrompt,
            onboardingCompleted: true,
        });
    } catch (error) {
        console.error("Failed to update onboarding status:", error);
        throw new Error("Failed to save onboarding data");
    }

    redirect("/dashboard");
}
