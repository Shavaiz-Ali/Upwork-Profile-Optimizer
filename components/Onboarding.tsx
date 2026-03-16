"use client"

import * as React from "react"
import { useState } from "react"
import { updateUserProfileAction, updateAiConfigAction } from "@/lib/actions/onboarding.actions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormInput } from "@/components/FormInput"
import { FormCombobox } from "@/components/FormCombobox"
import { FormTextarea } from "@/components/FormTextarea"

export function Onboarding({ availableModels = [] }: { availableModels: { id: string, name: string, label: string }[] }) {
    const [isPending, setIsPending] = useState(false)
    const [selectedModelId, setSelectedModelId] = useState(availableModels[0]?.id || "")
    const [displayName, setDisplayName] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [customPrompt, setCustomPrompt] = useState("")
    const { update } = useSession()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        try {
            // 1. Update User Profile
            const profileRes = await updateUserProfileAction({ displayName })
            if (!profileRes.success) {
                toast.error(profileRes.error || "Could not update your display name.")
                setIsPending(false)
                return
            }

            // 2. Update AI Configuration
            const aiRes = await updateAiConfigAction({
                aiModel: selectedModelId,
                aiApiKey: apiKey,
                customPrompt,
            })

            if (!aiRes.success) {
                toast.error(aiRes.error || "Could not save your AI model settings.")
                setIsPending(false)
                return
            }

            // 3. Refresh Session
            await update({
                displayName,
                onboardingCompleted: true,
            })

            toast.success("Your profile has been successfully configured!")

            // 4. Redirect
            setTimeout(() => {
                window.location.href = "/dashboard"
            }, 1000)
        } catch (error) {
            toast.error("An error occurred during setup. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-muted-foreground/10 bg-card/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            <CardHeader className="space-y-3 pb-6 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                    Welcome to Upwork Optimizer
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                    Let's set up your profile to personalize your experience.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormInput
                        id="displayName"
                        label="What should we call you?"
                        placeholder="E.g. Alex"
                        className="text-base"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />

                    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary/10">
                        {/* <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                        </div> */}
                        <h3 className="flex items-center text-lg font-semibold text-foreground mb-4 relative z-10">
                            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                            AI Model Configuration
                        </h3>

                        <div className="space-y-5 relative z-10">
                            <FormCombobox
                                id="ai-model"
                                label="Select AI Model"
                                value={selectedModelId}
                                onValueChange={setSelectedModelId}
                                placeholder="Select a model"
                                searchPlaceholder="Search models..."
                                options={availableModels.map((m) => ({ value: m.id, label: m.label }))}
                            />

                            <FormInput
                                id="apiKey"
                                label={`${availableModels.find(m => m.id === selectedModelId)?.label || "AI"} API Key`}
                                type="password"
                                placeholder={`Paste your API key here`}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                required
                            />
                            <FormTextarea
                                id="customPrompt"
                                label="System Prompt (Optional)"
                                placeholder="Add custom instructions to guide the AI when generating proposals or analyzing your profile..."
                                className="min-h-[100px] resize-y bg-background border-muted-foreground/20"
                                hint="Leave blank to use the default optimized prompts."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending ? "Setting up..." : "Complete Setup"}
                        {!isPending && (
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
