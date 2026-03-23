"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { 
  successActionResponse, 
  errorActionResponse, 
  ActionResponse 
} from "@/lib/action-response";
import { revalidatePath } from "next/cache";

/**
 * Update user profile information.
 */
export async function updateProfileAction(data: any): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return errorActionResponse("Unauthorized");

    const result = await UserService.updateUser(session.user.id, data);
    revalidatePath("/(dashboard)/profile");
    return successActionResponse(result, "Profile updated successfully");
  } catch (error: any) {
    return errorActionResponse(error.message || "Failed to update profile");
  }
}
