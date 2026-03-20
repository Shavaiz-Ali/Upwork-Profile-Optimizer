import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import UserApiKey from "@/lib/models/user-api-key.model";
import { successResponse, errorResponse } from "@/lib/api-response";
import { HTTP_STATUS } from "@/lib/constants/http-status";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        // 1. Authenticate user
        let userId: string | null = null;
        const authHeader = req.headers.get("authorization");

        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
                userId = decoded.id;
            } catch (err) {
                return errorResponse({ error: "Invalid token", status: HTTP_STATUS.UNAUTHORIZED });
            }
        } else {
            const session = await getServerSession(authOptions);
            userId = session?.user?.id ?? null;
        }

        if (!userId) {
            return errorResponse({ error: "Unauthorized", status: HTTP_STATUS.UNAUTHORIZED });
        }

        // 2. Fetch models for the user that have active API keys
        const models = await AiModel.find({ userId, isActive: true })
            .populate({
                path: "apiKeyId",
                model: UserApiKey,
                match: { isActive: true }
            })
            .select("name modelId apiKeyId")
            .sort({ name: 1 })
            .lean();

        // Filter out models where apiKeyId became null due to match: { isActive: true }
        const activeModels = models.filter(m => m.apiKeyId);

        return successResponse({ data: activeModels });
    } catch (error) {
        console.error("Error fetching AI models:", error);
        return errorResponse({ error: "Failed to fetch models" });
    }
}
