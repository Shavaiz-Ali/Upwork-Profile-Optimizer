import { Metadata } from "next"
import { Onboarding } from "@/components/Onboarding"

export const metadata: Metadata = {
    title: "Onboarding - Upwork Optimizer",
    description: "Complete your profile setup.",
}

export default function OnboardingPage() {
    return <Onboarding />
}
