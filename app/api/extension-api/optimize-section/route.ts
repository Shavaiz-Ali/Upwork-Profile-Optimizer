import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import AiModel from "@/lib/models/ai-model.model";
import UserApiKey from "@/lib/models/user-api-key.model";
import { getProviderModel } from "@/lib/ai/provider";
import mongoose from "mongoose";

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionType = "title" | "overview" | "skills" | "portfolio" | "rates";

interface OptimizeSectionRequest {
    section: SectionType;
    currentContent: string;
    profileContext: string; // Brief description of who the freelancer is
    modelId?: string;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const SectionOptimizationSchema = z.object({
    improvedVersion: z
        .string()
        .describe("The fully rewritten, optimized version of the section content"),

    alternatives: z
        .array(z.string())
        .min(2)
        .max(3)
        .describe("2–3 alternative variations with different angles or tones"),

    improvements: z
        .array(z.string())
        .describe("Specific, concrete changes made and why each matters for conversion"),

    reasoning: z
        .string()
        .describe("Why this version is significantly better than the original"),

    tips: z
        .array(z.string())
        .max(5)
        .describe("Actionable next steps the freelancer can take to further improve this section"),
});

// ─── Section-Specific System Prompts ─────────────────────────────────────────

function buildSystemPrompt(section: SectionType, customPrompt: string): string {
    const base = [
        "You are a top-tier Upwork profile optimization specialist with 10+ years of experience helping freelancers increase their profile views, invitations, and job offers.",
        "Your feedback is conversion-focused: everything must serve the goal of getting the freelancer hired.",
        "Avoid generic advice. Be specific, direct, and use clear language.",
        "Think from the perspective of a time-pressured client scanning dozens of profiles.",
    ].join(" ");

    const sectionInstructions: Record<SectionType, string> = {
        title: [
            "Optimize the PROFILE TITLE to:",
            "- Include the freelancer's primary niche and top skill keyword",
            "- Be specific enough to attract the right clients (not generic like 'Web Developer')",
            "- Avoid buzzwords and overused phrases like 'Expert', 'Guru', 'Ninja'",
            "- Stay within Upwork's character limit (max ~70 chars)",
            "- Communicate unique value in the fewest words possible",
            "- Use natural language that matches what clients search for",
        ].join("\n"),

        overview: [
            "Optimize the PROFILE OVERVIEW to:",
            "- Open with a powerful, client-focused hook (not 'I am a...' or 'I have X years')",
            "- Clearly state WHAT problem the freelancer solves and for WHOM",
            "- Use the client's language, not freelancer jargon",
            "- Highlight concrete results, outcomes, and proof over tasks and responsibilities",
            "- Include the top 5–8 keywords naturally throughout",
            "- End with a clear, confident call-to-action",
            "- Structure with short paragraphs for easy scanning",
        ].join("\n"),

        skills: [
            "Optimize the SKILLS SECTION to:",
            "- Place the highest-demand, most searchable skills first",
            "- Remove generic or low-value skills that dilute the niche",
            "- Suggest specific missing high-impact skills based on the profile context",
            "- Ensure a balance between broad (searchable) and niche (credibility) skills",
            "- Order by client relevance and search volume priority",
        ].join("\n"),

        portfolio: [
            "Optimize the PORTFOLIO SECTION to:",
            "- Lead with results and impact, not just project descriptions",
            "- Use outcome-focused titles (e.g., '127% traffic increase for e-commerce client')",
            "- Suggest what types of projects to add for maximum credibility",
            "- Advise on presentation: descriptive captions, before/after context, measurable results",
            "- Prioritize diversity and relevance over quantity",
        ].join("\n"),

        rates: [
            "Optimize the RATES / PRICING POSITIONING to:",
            "- Use pricing psychology principles to position rate confidently",
            "- Help the freelancer articulate value to justify their rate",
            "- Suggest whether to raise, hold, or temporarily lower the rate based on context",
            "- Advise on how to frame rate in the overview or proposals",
            "- Provide competitive positioning guidance based on the niche",
        ].join("\n"),
    };

    return [
        base,
        "",
        "SECTION-SPECIFIC INSTRUCTIONS:",
        sectionInstructions[section],
        customPrompt ? `\nADDITIONAL USER INSTRUCTIONS:\n${customPrompt}` : "",
    ]
        .filter(Boolean)
        .join("\n");
}

function buildUserPrompt(
    section: SectionType,
    currentContent: string,
    profileContext: string
): string {
    return `
            SECTION TO OPTIMIZE: ${section.toUpperCase()}

            FREELANCER CONTEXT:
            ${profileContext}

            CURRENT ${section.toUpperCase()} CONTENT:
            ${currentContent}

            TASK:
            Analyze the current content, identify all weaknesses and missed opportunities, 
            then return a significantly improved version that maximizes conversion (getting hired).
            Focus on specificity, client-focused language, and clear value communication.
            Do NOT make the content sound AI-generated. Keep it natural and human.
                `.trim();
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        // ─── 1. AUTH ─────────────────────────────────────────────────────────
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

        // ─── 2. BODY VALIDATION ───────────────────────────────────────────────
        const body: OptimizeSectionRequest = await req.json();

        const validSections: SectionType[] = ["title", "overview", "skills", "portfolio", "rates"];

        if (!validSections.includes(body.section)) {
            return NextResponse.json(
                { error: `Invalid section. Must be one of: ${validSections.join(", ")}` },
                { status: 400 }
            );
        }

        if (!body.currentContent?.trim()) {
            return NextResponse.json({ error: "currentContent is required" }, { status: 400 });
        }

        if (!body.profileContext?.trim()) {
            return NextResponse.json({ error: "profileContext is required" }, { status: 400 });
        }

        // ─── 3. DB + MODEL FETCH ──────────────────────────────────────────────
        await connectToDatabase();

        let aiModelDoc;
        if (body.modelId) {
            // Validate modelId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(body.modelId)) {
                return NextResponse.json(
                    { error: "Invalid AI model ID format." },
                    { status: 400 }
                );
            }

            aiModelDoc = await AiModel.findOne({ _id: body.modelId, userId, isActive: true })
                .populate<{
                    apiKeyId: { key: string; provider: string };
                }>({
                    path: "apiKeyId",
                    select: "+key provider",
                    model: UserApiKey,
                })
                .lean();
        } else {
            aiModelDoc = await AiModel.findOne({ userId, isActive: true })
                .populate<{
                    apiKeyId: { key: string; provider: string };
                }>({
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
                        : "No active AI model configured. Please complete onboarding."
                },
                { status: 422 }
            );
        }

        const { modelId, settings, apiKeyId } = aiModelDoc as any;
        const { key: apiKey, provider } = apiKeyId;
        const customPrompt = settings?.get?.("customPrompt") ?? "";

        // ─── 4. MODEL INIT ────────────────────────────────────────────────────
        const model = getProviderModel(provider, modelId, apiKey);

        // ─── 5. PROMPTS ───────────────────────────────────────────────────────
        const systemPrompt = buildSystemPrompt(body.section, customPrompt);
        const userPrompt = buildUserPrompt(body.section, body.currentContent, body.profileContext);

        // ─── 6. AI CALL ───────────────────────────────────────────────────────
        const { object } = await generateObject({
            model,
            schema: SectionOptimizationSchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        // ─── 7. RESPONSE ──────────────────────────────────────────────────────
        return NextResponse.json({
            success: true,
            section: body.section,
            data: object,
        });

    } catch (error: any) {
        console.error("[optimize-section] error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
