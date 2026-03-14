import { axiosClient } from "@/config";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Define full shape of authorized user
type AuthorizedUser = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    accessToken: string;
    role: string;
    university_id: string | null;
} | null;

type CustomCredentials = {
    email: string;
    password: string;
    accessToken?: string;
    loginType?: "login" | "loginAsUser";
};

// Named function with return type to avoid circular typing issues
async function authorizeFn(
    credentials: CustomCredentials | undefined
): Promise<AuthorizedUser> {
    try {
        if (!credentials?.email) {
            return null;
        }

        if (!credentials?.email) {
            console.error("❌ Missing credentials");
            return null;
        }

        const endPoint = "/auth/login";
        const body = {
            email: credentials?.email || "",
            password: credentials?.password || "",
        };

        const response = await axiosClient.post(endPoint, body, {
            headers: {
                Authorization: `Bearer ${credentials?.accessToken ?? {}}`,
            },
        });

        const user = response?.data?.data?.userResponse;
        const token = response?.data?.data?.token;

        if (!user || !token) {
            throw new Error(
                response.data.message || "Missing user or token in response"
            );
        }

        const authUser: AuthorizedUser = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: `${user.firstName} ${user.lastName}` || null,
            image: user.profileImage || null, // Add profile URL if available: user.image || null
            university_id: user.university_id || null,
            accessToken: token,
        };

        return authUser;
    } catch (error) {
        console.error("❌ authorize error:", error);
        if (axios.isAxiosError(error)) {
            const err = error?.response?.data?.message;
            throw new Error(err || "Error login you in. Try again later");
        }
        throw new Error("Something went wrong");
    }
}

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
            authorize: authorizeFn,
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.university_id = user.university_id;
                token.email = user.email;
                token.role = user.role;
                token.name = user.name;
                token.picture = user.image;
                token.accessToken = user.accessToken;
            }

            if (!token.id && token.sub) {
                token.id = token.sub;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.university_id = token.university_id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }

            session.accessToken = token.accessToken as string;
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
        maxAge: 15 * 24 * 60 * 60, // 15 days
    },
    secret: process.env.NEXTAUTH_SECRET!,
    debug: process.env.NODE_ENV === "development",
};
