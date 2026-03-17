import { Schema, model, models, Document, Types } from "mongoose";

export interface IUserApiKey extends Document {
    userId: Types.ObjectId;
    provider: "openai" | "google" | "anthropic" | "other";
    key: string;
    label: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserApiKeySchema = new Schema<IUserApiKey>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        provider: {
            type: String,
            enum: ["openai", "google", "anthropic", "other"],
            required: [true, "API provider is required"],
        },
        key: {
            type: String,
            required: [true, "API key is required"],
            select: false,
        },
        label: {
            type: String,
            required: [true, "API key label is required"],
            trim: true,
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

// Indexing for performance and unique labels per user
UserApiKeySchema.index({ userId: 1, provider: 1 });
UserApiKeySchema.index({ userId: 1, label: 1 }, { unique: true });

const UserApiKey = models?.UserApiKey || model<IUserApiKey>("UserApiKey", UserApiKeySchema);

export default UserApiKey;
