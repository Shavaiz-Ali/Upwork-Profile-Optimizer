import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const email = req.nextUrl.searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "Account not found. Please sign up first." },
                { status: 404 }
            );
        }

        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new Error("NEXTAUTH_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            secret,
            { expiresIn: "30d" } // Extension tokens last longer
        );

        return NextResponse.json(
            {
                token,
                email: user.email,
                user: {
                    name: user.name,
                    image: user.image,
                    displayName: user.displayName,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API /extension-api/me Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
            },
        }
    );
}
