"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormInput } from "@/components/FormInput"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function Onboarding() {
    const [model, setModel] = useState("gemini")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Onboarding submitted")
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
                    />

                    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                        </div>
                        <h3 className="flex items-center text-lg font-semibold text-foreground mb-4 relative z-10">
                            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                            AI Model Configuration
                        </h3>

                        <div className="space-y-5 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor="ai-model">Select AI Model</Label>
                                <Select value={model} onValueChange={setModel}>
                                    <SelectTrigger id="ai-model" className="w-full bg-background border-muted-foreground/20">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini">Google Gemini 1.5</SelectItem>
                                        <SelectItem value="gpt4o">OpenAI GPT-4o</SelectItem>
                                        <SelectItem value="claude">Anthropic Claude 3.5 Sonnet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <FormInput
                                id="apiKey"
                                label={`${model === "gemini" ? "Google" : model === "gpt4o" ? "OpenAI" : "Anthropic"} API Key`}
                                type="password"
                                placeholder={`Paste your API key here`}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                        Complete Setup
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
