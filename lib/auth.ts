import { loginAction } from "@/lib/actions/auth.actions";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await loginAction(credentials);

                    if (result.success && result.data?.user) {
                        return {
                            ...result.data.user,
                            accessToken: result.data.token,
                        };
                    }

                    if (result.error) {
                        throw new Error(result.error);
                    }

                    return null;
                } catch (error: any) {
                    console.error("Auth authorize error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                await connectToDatabase();

                // Check if user exists, otherwise create
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    existingUser = await User.create({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: "user",
                        onboardingCompleted: false,
                    });
                }

                // Add custom fields to user object for the JWT callback
                user.id = existingUser._id.toString();
                user.role = existingUser.role;
                user.displayName = existingUser.displayName || existingUser.name;
                user.onboardingCompleted = existingUser.onboardingCompleted;
            }
            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.displayName = user.displayName;
                token.onboardingCompleted = user.onboardingCompleted;
                token.accessToken = user.accessToken;
            }

            // Handle session update (e.g. after onboarding)
            if (trigger === "update" && session) {
                token.name = session.name || token.name;
                token.displayName = session.displayName || token.displayName;
                token.onboardingCompleted = session.onboardingCompleted ?? token.onboardingCompleted;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.displayName = token.displayName as string;
                session.user.onboardingCompleted = token.onboardingCompleted as boolean;
            }

            session.accessToken = token.accessToken as string;
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 15 * 24 * 60 * 60, // 15 days
    },
    secret: process.env.NEXTAUTH_SECRET!,
    debug: process.env.NODE_ENV === "development",
};
