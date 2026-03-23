import connectToDatabase from "@/lib/db";
import UserApiKey, { IUserApiKey } from "@/lib/models/user-api-key.model";
import AiModel, { IAiModel } from "@/lib/models/ai-model.model";
import { Types } from "mongoose";

export class SettingsService {
  /**
   * Save or update an API key for a user.
   */
  static async saveApiKey(userId: string, data: { provider: string; key: string; label: string; id?: string }) {
    await connectToDatabase();
    const uid = new Types.ObjectId(userId);

    if (data.id) {
      // Update existing
      return await UserApiKey.findOneAndUpdate(
        { _id: new Types.ObjectId(data.id), userId: uid },
        { $set: { provider: data.provider, key: data.key, label: data.label } },
        { new: true }
      );
    } else {
      // Create new
      return await UserApiKey.create({
        userId: uid,
        provider: data.provider,
        key: data.key,
        label: data.label,
        isActive: true,
      });
    }
  }

  /**
   * Save or update an AI model configuration.
   */
  static async saveAiModel(userId: string, data: { name: string; modelId: string; apiKeyId: string; id?: string }) {
    await connectToDatabase();
    const uid = new Types.ObjectId(userId);

    if (data.id) {
      return await AiModel.findOneAndUpdate(
        { _id: new Types.ObjectId(data.id), userId: uid },
        { $set: { name: data.name, modelId: data.modelId, apiKeyId: new Types.ObjectId(data.apiKeyId) } },
        { new: true }
      );
    } else {
      return await AiModel.create({
        userId: uid,
        name: data.name,
        modelId: data.modelId,
        apiKeyId: new Types.ObjectId(data.apiKeyId),
        isActive: true,
      });
    }
  }
}
