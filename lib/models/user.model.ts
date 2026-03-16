import { Schema, model, models, Document, Types } from "mongoose";

// Interface for TypeScript support
export interface IUser extends Document {
    email: string;
    name?: string;
    image?: string;
    password?: string;
    displayName?: string;
    onboardingCompleted: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Email is invalid",
            ],
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        password: {
            type: String,
            select: false,
        },
        displayName: {
            type: String,
        },
        onboardingCompleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

// Models check ensures we don't compile the model multiple times during hot-reloads in development
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
