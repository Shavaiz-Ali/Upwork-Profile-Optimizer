import { Metadata } from "next"
import { Onboarding } from "@/components/Onboarding"
import { AI_MODEL_CATALOG } from "@/config/ai-models"

export const metadata: Metadata = {
    title: "Onboarding - Upwork Optimizer",
    description: "Complete your profile setup.",
}

export default async function OnboardingPage() {
    return <Onboarding availableModels={AI_MODEL_CATALOG} />
}
