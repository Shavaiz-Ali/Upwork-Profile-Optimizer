"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SettingsService } from "@/services/settings.service";
import { AiConfigService } from "@/services/ai-config.service";
import { 
  successActionResponse, 
  errorActionResponse, 
  ActionResponse 
} from "@/lib/action-response";
import { revalidatePath } from "next/cache";

/**
 * Save API Key configuration.
 */
export async function saveApiKeyAction(formData: any): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return errorActionResponse("Unauthorized");

    const result = await SettingsService.saveApiKey(session.user.id, formData);
    revalidatePath("/(dashboard)/settings/api-keys");
    return successActionResponse(result, "API Key saved successfully");
  } catch (error: any) {
    return errorActionResponse(error.message || "Failed to save API key");
  }
}

/**
 * Delete API Key.
 */
export async function deleteApiKeyAction(keyId: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return errorActionResponse("Unauthorized");

    await AiConfigService.deleteApiKey(keyId, session.user.id);
    revalidatePath("/(dashboard)/settings/api-keys");
    return successActionResponse(null, "API Key deleted");
  } catch (error: any) {
    return errorActionResponse(error.message || "Failed to delete API key");
  }
}

/**
 * Save AI Model configuration.
 */
export async function saveAiModelAction(formData: any): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return errorActionResponse("Unauthorized");

    const result = await SettingsService.saveAiModel(session.user.id, formData);
    revalidatePath("/(dashboard)/settings/models");
    return successActionResponse(result, "AI Model saved successfully");
  } catch (error: any) {
    return errorActionResponse(error.message || "Failed to save AI model");
  }
}

/**
 * Delete AI Model.
 */
export async function deleteAiModelAction(modelId: string): Promise<ActionResponse> {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) return errorActionResponse("Unauthorized");
  
      await AiConfigService.deleteModel(modelId, session.user.id);
      revalidatePath("/(dashboard)/settings/models");
      return successActionResponse(null, "AI Model deleted");
    } catch (error: any) {
      return errorActionResponse(error.message || "Failed to delete AI model");
    }
}
