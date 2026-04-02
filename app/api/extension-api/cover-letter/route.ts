import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import UserApiKey from "@/lib/models/user-api-key.model";
import { getProviderModel } from "@/lib/ai/provider";
import mongoose from "mongoose";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CoverLetterRequest {
    jobTitle: string;
    jobDescription: string;
    requiredSkills?: string;
    budget?: string;
    freelancerProfile?: {
        name?: string;
        title?: string;
        overview?: string;
        skills?: string;
        hourlyRate?: string;
    };
    existingLetter?: string;
    optimizeInstruction?: string;
    modelId?: string;
}

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
    return [
        "You are an elite Upwork proposal writer with a proven track record of writing cover letters that win contracts.",
        "You write compelling, personalized cover letters that get clients to reply.",
        "",
        "RULES:",
        "- Open with a hook that shows you understand the client's problem — NOT 'I saw your job post'",
        "- Mirror the client's language and pain points from the job description",
        "- Highlight only the most relevant skills and experience — no generic laundry lists",
        "- Demonstrate credibility with a brief, specific proof point or result",
        "- Keep it concise: 150–250 words maximum",
        "- End with a confident, low-friction call to action",
        "- Sound human, conversational, and confident — NOT AI-generated or sycophantic",
        "- DO NOT start with 'I', 'Hi', or the freelancer's name",
        "- DO NOT use buzzwords like 'passionate', 'dedicated', 'guru', 'ninja'",
        "- DO NOT copy/paste the job description or skills verbatim",
        "",
        "Return ONLY the cover letter text. No preamble, no explanation, no markdown formatting.",
    ].join("\n");
}

function buildGeneratePrompt(body: CoverLetterRequest): string {
    const profile = body.freelancerProfile || {};
    return `
Write a winning Upwork cover letter for the following job:

JOB TITLE: ${body.jobTitle}

JOB DESCRIPTION:
${body.jobDescription}

${body.requiredSkills ? `REQUIRED SKILLS: ${body.requiredSkills}` : ""}
${body.budget ? `BUDGET: ${body.budget}` : ""}

FREELANCER PROFILE:
- Name: ${profile.name || "N/A"}
- Professional Title: ${profile.title || "N/A"}
- Overview: ${profile.overview || "N/A"}
- Skills: ${profile.skills || "N/A"}
- Hourly Rate: ${profile.hourlyRate || "N/A"}

Write a cover letter (150–250 words) that will make this client want to immediately reach out.
`.trim();
}

function buildOptimizePrompt(body: CoverLetterRequest): string {
    return `
You are refining an existing Upwork cover letter based on specific user feedback.

ORIGINAL COVER LETTER:
${body.existingLetter}

USER'S REFINEMENT INSTRUCTION:
${body.optimizeInstruction}

JOB CONTEXT:
- Job Title: ${body.jobTitle}
- Description: ${body.jobDescription?.substring(0, 500)}...

Apply the instruction to improve the cover letter. Keep what works. Return ONLY the revised cover letter text.
`.trim();
}

// ─── Auth Helper ──────────────────────────────────────────────────────────────

async function resolveUserId(req: Request): Promise<string | null> {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const { default: jwt } = await import("jsonwebtoken");
        try {
            const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
            return decoded.id;
        } catch {
            return null;
        }
    }
    const session = await getServerSession(authOptions);
    return session?.user?.id ?? null;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        // ─── 1. AUTH ───────────────────────────────────────────────────────────
        const userId = await resolveUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ─── 2. BODY VALIDATION ────────────────────────────────────────────────
        const body: CoverLetterRequest = await req.json();

        if (!body.jobTitle?.trim()) {
            return NextResponse.json({ error: "jobTitle is required" }, { status: 400 });
        }
        if (!body.jobDescription?.trim()) {
            return NextResponse.json({ error: "jobDescription is required" }, { status: 400 });
        }
        if (body.optimizeInstruction && !body.existingLetter?.trim()) {
            return NextResponse.json(
                { error: "existingLetter is required when optimizeInstruction is provided" },
                { status: 400 }
            );
        }

        // ─── 3. DB + MODEL FETCH ───────────────────────────────────────────────
        await connectToDatabase();

        let aiModelDoc;
        if (body.modelId) {
            if (!mongoose.Types.ObjectId.isValid(body.modelId)) {
                return NextResponse.json({ error: "Invalid AI model ID format." }, { status: 400 });
            }
            aiModelDoc = await AiModel.findOne({ _id: body.modelId, userId, isActive: true })
                .populate<{ apiKeyId: { key: string; provider: string } }>({
                    path: "apiKeyId",
                    select: "+key provider",
                    model: UserApiKey,
                })
                .lean();
        } else {
            aiModelDoc = await AiModel.findOne({ userId, isActive: true })
                .populate<{ apiKeyId: { key: string; provider: string } }>({
                    path: "apiKeyId",
                    select: "+key provider",
                    model: UserApiKey,
                })
                .lean();
        }

        if (!aiModelDoc) {
            return NextResponse.json(
                {
                    error: body.modelId
                        ? "The selected AI model configuration was not found or is inactive."
                        : "No active AI model configured. Please complete onboarding.",
                },
                { status: 422 }
            );
        }

        const { modelId, apiKeyId } = aiModelDoc as any;
        if (!apiKeyId) {
            return NextResponse.json(
                { error: "Your AI model configuration is missing an API Key. Please update it in your dashboard." },
                { status: 422 }
            );
        }

        const { key: apiKey, provider } = apiKeyId;

        // ─── 4. MODEL INIT ─────────────────────────────────────────────────────
        const model = getProviderModel(provider, modelId, apiKey);

        // ─── 5. BUILD PROMPT ───────────────────────────────────────────────────
        const isOptimize = !!(body.existingLetter && body.optimizeInstruction);
        const systemPrompt = buildSystemPrompt();
        const userPrompt = isOptimize ? buildOptimizePrompt(body) : buildGeneratePrompt(body);

        // ─── 6. AI CALL ────────────────────────────────────────────────────────
        const { text } = await generateText({
            model,
            system: systemPrompt,
            prompt: userPrompt,
            maxTokens: 600,
        });

        // ─── 7. RESPONSE ───────────────────────────────────────────────────────
        return NextResponse.json({
            success: true,
            data: {
                coverLetter: text.trim(),
                mode: isOptimize ? "optimized" : "generated",
            },
        });
    } catch (error: any) {
        console.error("[cover-letter] error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
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
                "Access-Control-Allow-Headers":
                    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
            },
        }
    );
}
