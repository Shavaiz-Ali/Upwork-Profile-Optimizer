import { Metadata } from "next"
import { Onboarding } from "@/components/Onboarding"
import connectToDatabase from "@/lib/db"
import AiModel from "@/lib/models/ai-model.model"

export const metadata: Metadata = {
    title: "Onboarding - Upwork Optimizer",
    description: "Complete your profile setup.",
}

export default async function OnboardingPage() {
    let availableModels: { id: string; name: string; label: string }[] = [];

    try {
        await connectToDatabase();
        const modelsData = await AiModel.find({ isActive: true }).sort({ name: 1 }).lean();

        if (Array.isArray(modelsData)) {
            availableModels = modelsData.map((m: any) => ({
                id: m._id.toString(),
                name: m.name,
                label: m.label,
            }));
        }
    } catch (error) {
        console.error("Failed to fetch AI models:", error);
    }

    return <Onboarding availableModels={availableModels} />
}
