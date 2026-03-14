import { Metadata } from "next"
import { AuthForm } from "@/components/AuthForm"

export const metadata: Metadata = {
    title: "Login - Upwork Optimizer",
    description: "Login to your account.",
}

export default function LoginPage() {
    return <AuthForm type="login" />
}
