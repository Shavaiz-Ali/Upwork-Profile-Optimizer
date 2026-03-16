import connectToDatabase from "./db";
import AiModel from "./models/ai-model.model";

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

export async function seedAiModels() {
    try {
        await connectToDatabase();
        
        for (const model of initialModels) {
            await AiModel.findOneAndUpdate(
                { name: model.name },
                model,
                { upsert: true, new: true }
            );
        }
        
        console.log("AI Models seeded successfully");
    } catch (error) {
        console.error("Error seeding AI models:", error);
    }
}
