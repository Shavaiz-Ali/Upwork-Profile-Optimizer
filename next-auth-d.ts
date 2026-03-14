import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      university_id?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    university_id?: string | null;
    image?: string | null;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    university_id?: string | null;
    picture?: string | null;
    accessToken: string;
  }
}
