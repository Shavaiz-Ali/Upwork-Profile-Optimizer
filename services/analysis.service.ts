import connectToDatabase from "@/lib/db";
import Analysis, { IAnalysis } from "@/lib/models/analysis.model";
import { Types } from "mongoose";

/**
 * Service for fetching and managing analyses with strict data ownership checks.
 */
export class AnalysisService {
  /**
   * Fetch all analyses for a specific user, ordered by creation date.
   */
  static async getUserAnalyses(userId: string, options: { limit?: number; skip?: number } = {}) {
    await connectToDatabase();
    const { limit = 20, skip = 0 } = options;

    const data = await Analysis.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Analysis.countDocuments({ userId: new Types.ObjectId(userId) });

    return {
      data: data as (IAnalysis & { _id: Types.ObjectId })[],
      totalCount,
      hasMore: totalCount > skip + data.length,
    };
  }

  /**
   * Fetch a single analysis by ID, ensuring it belongs to the authenticated user.
   */
  static async getAnalysisById(analysisId: string, userId: string) {
    if (!Types.ObjectId.isValid(analysisId)) {
      return null;
    }

    await connectToDatabase();

    const analysis = await Analysis.findOne({
      _id: new Types.ObjectId(analysisId),
      userId: new Types.ObjectId(userId),
    }).lean();


    if (!analysis) return null;

    return analysis as IAnalysis & { _id: Types.ObjectId };
  }

  /**
   * Fetch the most recent analysis for a user.
   */
  static async getLatestAnalysis(userId: string) {
    await connectToDatabase();

    const analysis = await Analysis.findOne({
      userId: new Types.ObjectId(userId)
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!analysis) return null;

    return analysis as IAnalysis & { _id: Types.ObjectId };
  }

  /**
   * Calculate summary stats for a user's dashboard.
   */
  static async getDashboardStats(userId: string) {
    await connectToDatabase();
    const uid = new Types.ObjectId(userId);

    const [totalAnalyses, latestAnalysis] = await Promise.all([
      Analysis.countDocuments({ userId: uid }),
      Analysis.findOne({ userId: uid }).sort({ createdAt: -1 }).select("overallScore").lean(),
    ]);

    return {
      totalAnalyses,
      latestScore: latestAnalysis?.overallScore || 0,
    };
  }

  /**
   * Delete an analysis entry, double-checking ownership.
   */
  static async deleteAnalysis(analysisId: string, userId: string) {
    await connectToDatabase();

    const result = await Analysis.deleteOne({
      _id: new Types.ObjectId(analysisId),
      userId: new Types.ObjectId(userId),
    });

    return result.deletedCount > 0;
  }
}
