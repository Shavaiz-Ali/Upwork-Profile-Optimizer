import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import { successResponse, errorResponse } from "@/lib/api-response";

const initialModels = [
    {
        name: "gemini",
        label: "Google Gemini 1.5",
        apiKey: "GOOGLE_API_KEY",
        isActive: true,
    },
    {
        name: "gpt4o",
        label: "OpenAI GPT-4o",
        apiKey: "OPENAI_API_KEY",
        isActive: true,
    },
    {
        name: "claude",
        label: "Anthropic Claude 3.5 Sonnet",
        apiKey: "ANTHROPIC_API_KEY",
        isActive: true,
    },
];

export async function GET() {
    try {
        await connectToDatabase();

        for (const aiModel of initialModels) {
            await AiModel.findOneAndUpdate(
                { name: aiModel.name },
                aiModel,
                { upsert: true, new: true }
            );
        }

        return successResponse({ message: "AI Models seeded successfully" });
    } catch (error) {
        console.error("Seeding error:", error);
        return errorResponse({ error: "Seeding failed" });
    }
}
