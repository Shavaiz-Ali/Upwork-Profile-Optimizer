import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import UserApiKey from "@/lib/models/user-api-key.model";
import { getProviderModel } from "@/lib/ai/provider";

/** Shape of the profile analysis sent from the browser extension */
interface AnalyzeRequest {
    profileContent: string;
}

const ProfileAnalysisSchema = z.object({
    overallScore: z.number().min(0).max(100),
    summary: z.string(),

    sections: z.object({
        title: z.object({
            score: z.number().min(0).max(100),
            feedback: z.string(),
            suggestions: z.array(z.string()),
        }),
        overview: z.object({
            score: z.number().min(0).max(100),
            feedback: z.string(),
            suggestions: z.array(z.string()),
        }),
        skills: z.object({
            score: z.number().min(0).max(100),
            feedback: z.string(),
            suggestions: z.array(z.string()),
        }),
        portfolio: z.object({
            score: z.number().min(0).max(100),
            feedback: z.string(),
            suggestions: z.array(z.string()),
        }),
        rates: z.object({
            score: z.number().min(0).max(100),
            feedback: z.string(),
            suggestions: z.array(z.string()),
        }),
    }),

    keywords: z.object({
        present: z.array(z.string()),
        missing: z.array(z.string()),
    }),

    topImprovements: z.array(z.string()).max(5),
});

export async function POST(req: Request) {
    try {
        // =========================
        // 1. AUTH (Session or Bearer)
        // =========================
        let userId: string | null = null;

        const authHeader = req.headers.get("authorization");

        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const { default: jwt } = await import("jsonwebtoken");

            const decoded = jwt.verify(
                token,
                process.env.NEXTAUTH_SECRET!
            ) as { id: string };

            userId = decoded.id;
        } else {
            const session = await getServerSession(authOptions);
            userId = session?.user?.id ?? null;
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // =========================
        // 2. BODY VALIDATION
        // =========================
        const body: AnalyzeRequest = await req.json();

        if (!body.profileContent?.trim()) {
            return NextResponse.json(
                { error: "profileContent is required" },
                { status: 400 }
            );
        }

        // =========================
        // 3. DB + MODEL FETCH
        // =========================
        await connectToDatabase();

        const aiModelDoc = await AiModel.findOne({
            userId,
            isActive: true,
        })
            .populate<{
                apiKeyId: { key: string; provider: string };
            }>({
                path: "apiKeyId",
                select: "+key provider",
                model: UserApiKey,
            })
            .lean();

        if (!aiModelDoc) {
            return NextResponse.json(
                {
                    error:
                        "No active AI model configured. Please complete onboarding.",
                },
                { status: 422 }
            );
        }

        const { modelId, settings, apiKeyId } = aiModelDoc as any;
        
        if (!apiKeyId) {
             return NextResponse.json(
                { error: "Your AI model configuration is missing an API Key. Please update it in your dashboard." },
                { status: 422 }
            );
        }

        const { key: apiKey, provider } = apiKeyId;

        const customPrompt = settings?.get?.("customPrompt") ?? "";

        // =========================
        // 4. MODEL INIT
        // =========================
        const model = getProviderModel(provider, modelId, apiKey);

        // =========================
        // 5. 🔥 IMPROVED SYSTEM PROMPT
        // =========================
        const systemPrompt = [
            "You are a top 1% Upwork profile optimization expert who helps freelancers get more profile views, clicks, and job offers.",

            "Your job is to deeply analyze the profile and provide highly specific, actionable, and conversion-focused feedback.",

            "Think like a hiring client scanning the profile for 5-10 seconds.",

            "For EACH section (title, overview, skills, portfolio, rates):",
            "- Give a score from 0-100 based on hiring effectiveness",
            "- Clearly explain WHY the score was given",
            "- Identify exact weaknesses and missed opportunities",
            "- Provide actionable suggestions that can be directly implemented",

            "IMPORTANT:",
            "- Be brutally honest but constructive",
            "- Avoid generic advice",
            "- Focus on conversion (getting hired, not just looking good)",
            "- Prioritize clarity, niche positioning, and client-focused messaging",

            "KEY FACTORS:",
            "- Keyword optimization",
            "- Clear niche positioning",
            "- Client-focused language",
            "- Proof of work and credibility",
            "- Readability and structure",
            "- Pricing psychology",

            "KEYWORDS:",
            "- Extract relevant keywords already present",
            "- Suggest missing high-impact keywords",

            "TOP IMPROVEMENTS:",
            "- Return ONLY 5 high-impact improvements",
            "- Focus on biggest ROI changes",

            customPrompt
                ? `\n\nAdditional user instructions:\n${customPrompt}`
                : "",
        ]
            .filter(Boolean)
            .join("\n");

        // =========================
        // 6. 🔥 IMPROVED USER PROMPT
        // =========================
        const userPrompt = `
                Analyze the following Upwork profile.

                    Profile Content:
                    ${body.profileContent}

                    Focus on:
                    - First impression impact
                    - Value proposition clarity
                    - Keyword optimization
                    - Client appeal (not freelancer-focused)
                    - Conversion potential (likelihood of getting hired)
                    `;

        // =========================
        // 7. AI CALL
        // =========================
        const { object } = await generateObject({
            model,
            schema: ProfileAnalysisSchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        // =========================
        // 8. RESPONSE
        // =========================
        return NextResponse.json({
            success: true,
            data: object,
        });
    } catch (error: any) {

        return NextResponse.json(
            {
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
            },
        }
    );
}