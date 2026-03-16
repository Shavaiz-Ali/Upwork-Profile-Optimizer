import { Schema, model, models, Document, Types } from "mongoose";

export interface IAiModel extends Document {
    userId: Types.ObjectId;
    name: string;
    label: string;
    apiKey: string;
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
        name: {
            type: String,
            required: [true, "Model name is required"],
            unique: true,
            trim: true,
        },
        label: {
            type: String,
            required: [true, "Model label is required"],
            trim: true,
        },
        apiKey: {
            type: String,
            required: [true, "API key configuration is required"],
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

// Models check ensures we don't compile the model multiple times during hot-reloads in development
const AiModel = models?.AiModel || model<IAiModel>("AiModel", AiModelSchema);

export default AiModel;
