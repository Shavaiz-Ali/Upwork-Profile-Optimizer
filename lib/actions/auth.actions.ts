"use server"

import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successActionResponse, errorActionResponse } from "@/lib/action-response";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-fallback-secret";

export async function loginAction(credentials: { email: string; password?: string }) {
    try {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) {
            return errorActionResponse("Email not found");
        }

        if (!user.password) {
            return errorActionResponse("This account was created with a different provider (e.g. Google)");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password || "", user.password);

        if (!isPasswordMatch) {
            return errorActionResponse("Incorrect password");
        }

        const userResponse = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            displayName: user.displayName,
            role: user.role,
            image: user.image,
            onboardingCompleted: user.onboardingCompleted,
        };

        const token = jwt.sign(
            userResponse,
            JWT_SECRET,
            { expiresIn: "15d" }
        );

        return successActionResponse({
            user: userResponse,
            token: token,
        }, "Login successful");
    } catch (error: any) {
        console.error("Login action error:", error);
        return errorActionResponse(error.message || "Internal server error");
    }
}

export async function signupAction(data: { email: string; password?: string; name?: string }) {
    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return errorActionResponse("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password || "", 10);

        const newUser = await User.create({
            email: data.email,
            password: hashedPassword,
            name: data.name || "",
            role: "user",
            onboardingCompleted: false,
        });

        const userResponse = {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            onboardingCompleted: newUser.onboardingCompleted,
        };

        return successActionResponse({
            user: userResponse,
        }, "User registered successfully");
    } catch (error: any) {
        console.error("Signup action error:", error);
        return errorActionResponse(error.message || "Internal server error");
    }
}
