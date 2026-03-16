import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import { successResponse, errorResponse } from "@/lib/api-response";
import { HTTP_STATUS } from "@/lib/constants/http-status";

export async function GET() {
    try {
        await connectToDatabase();

        const models = await AiModel.find({ isActive: true })
            .select("name label")
            .sort({ name: 1 })
            .lean();

        if (!models) {
            return errorResponse({ error: "Failed to fetch AI models", status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }

        return successResponse({ data: models });
    } catch (error) {
        console.error("Error fetching AI models:", error);
        return errorResponse({ error: "Failed to fetch models" });
    }
}
