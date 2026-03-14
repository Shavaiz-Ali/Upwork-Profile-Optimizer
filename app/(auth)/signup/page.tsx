import { Metadata } from "next"
import { AuthForm } from "@/components/AuthForm"

export const metadata: Metadata = {
    title: "Signup - Upwork Optimizer",
    description: "Create a new account.",
}

export default function SignupPage() {
    return <AuthForm type="signup" />
}
