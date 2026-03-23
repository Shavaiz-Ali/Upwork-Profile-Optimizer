"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalysisService } from "@/services/analysis.service";
import { 
  successActionResponse, 
  errorActionResponse, 
  ActionResponse 
} from "@/lib/action-response";
import { revalidatePath } from "next/cache";

/**
 * Server Action to delete an analysis record.
 */
export async function deleteAnalysisAction(analysisId: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorActionResponse("Unauthorized");
    }

    const success = await AnalysisService.deleteAnalysis(analysisId, session.user.id);
    
    if (success) {
      revalidatePath("/(dashboard)/history", "page");
      revalidatePath("/(dashboard)/dashboard", "page");
      return successActionResponse(null, "Analysis deleted successfully");
    } else {
      return errorActionResponse("Analysis not found or unauthorized");
    }
  } catch (error) {
    console.error("Delete Analysis Error:", error);
    return errorActionResponse("Failed to delete analysis");
  }
}

/**
 * Placeholder for creating analysis from dashboard.
 * Actual analysis logic is currently in the API route, 
 * but a server action version could be added here for dashboard-initiated runs.
 */
export async function createAnalysisAction(data: any): Promise<ActionResponse> {
    // Implementation for dashboard-initiated analysis
    return errorActionResponse("Not implemented yet");
}
