import { Schema, model, models, Document, Types } from "mongoose";

export interface IAiModel extends Document {
    userId: Types.ObjectId;
    apiKeyId: Types.ObjectId;
    modelId: string;
    name: string;
    settings: Map<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AiModelSchema = new Schema<IAiModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        apiKeyId: {
            type: Schema.Types.ObjectId,
            ref: "UserApiKey",
            required: [true, "API Key reference is required"],
        },
        modelId: {
            type: String,
            required: [true, "Model ID (e.g., gpt-4) is required"],
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Model configuration name is required"],
            trim: true,
        },
        settings: {
            type: Map,
            of: Schema.Types.Mixed,
            default: {},
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexing for performance
AiModelSchema.index({ userId: 1, isActive: 1 });
AiModelSchema.index({ userId: 1, name: 1 }, { unique: true });

const AiModel = models?.AiModel || model<IAiModel>("AiModel", AiModelSchema);

export default AiModel;
