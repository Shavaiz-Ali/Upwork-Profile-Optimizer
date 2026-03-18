import { Schema, model, models, Document, Types } from "mongoose";

export interface IAnalysis extends Document {
  userId: Types.ObjectId;
  profileName: string;
  profileTitle: string;
  overallScore: number;
  summary: string;
  sections: {
    title: { score: number; feedback: string; suggestions: string[] };
    overview: { score: number; feedback: string; suggestions: string[] };
    skills: { score: number; feedback: string; suggestions: string[] };
    portfolio: { score: number; feedback: string; suggestions: string[] };
    rates: { score: number; feedback: string; suggestions: string[] };
  };
  keywords: {
    present: string[];
    missing: string[];
  };
  topImprovements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileName: { type: String, required: true },
    profileTitle: { type: String, required: true },
    overallScore: { type: Number, required: true },
    summary: { type: String, required: true },
    sections: {
      title: { score: Number, feedback: String, suggestions: [String] },
      overview: { score: Number, feedback: String, suggestions: [String] },
      skills: { score: Number, feedback: String, suggestions: [String] },
      portfolio: { score: Number, feedback: String, suggestions: [String] },
      rates: { score: Number, feedback: String, suggestions: [String] },
    },
    keywords: {
      present: [String],
      missing: [String],
    },
    topImprovements: [String],
  },
  { timestamps: true }
);

AnalysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = models?.Analysis || model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;
