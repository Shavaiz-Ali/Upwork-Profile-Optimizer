import connectToDatabase from "@/lib/db";
import AiModel, { IAiModel } from "@/lib/models/ai-model.model";
import UserApiKey, { IUserApiKey } from "@/lib/models/user-api-key.model";
import { Types } from "mongoose";

export class AiConfigService {
  /**
   * Fetch all API keys for a user.
   */
  static async getUserApiKeys(userId: string) {
    await connectToDatabase();
    return await UserApiKey.find({ userId: new Types.ObjectId(userId) }).lean();
  }

  /**
   * Fetch a single API key by ID with ownership check.
   */
  static async getApiKeyById(keyId: string, userId: string) {
    await connectToDatabase();
    return await UserApiKey.findOne({
      _id: new Types.ObjectId(keyId),
      userId: new Types.ObjectId(userId),
    }).lean();
  }

  /**
   * Fetch all AI model configurations for a user.
   */
  static async getUserModels(userId: string) {
    await connectToDatabase();
    return await AiModel.find({ userId: new Types.ObjectId(userId) })
      .populate("apiKeyId")
      .lean();
  }

  /**
   * Fetch a single AI model by ID with ownership check.
   */
  static async getModelById(modelId: string, userId: string) {
    await connectToDatabase();
    return await AiModel.findOne({
      _id: new Types.ObjectId(modelId),
      userId: new Types.ObjectId(userId),
    })
      .populate("apiKeyId")
      .lean();
  }

  /**
   * Delete an API key (also disables related models).
   */
  static async deleteApiKey(keyId: string, userId: string) {
    await connectToDatabase();
    const kid = new Types.ObjectId(keyId);
    const uid = new Types.ObjectId(userId);

    // Disable all models using this key
    await AiModel.updateMany({ apiKeyId: kid, userId: uid }, { isActive: false });

    const result = await UserApiKey.deleteOne({ _id: kid, userId: uid });
    return result.deletedCount > 0;
  }

  /**
   * Delete a model configuration.
   */
  static async deleteModel(modelId: string, userId: string) {
    await connectToDatabase();
    const result = await AiModel.deleteOne({
      _id: new Types.ObjectId(modelId),
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }
}
