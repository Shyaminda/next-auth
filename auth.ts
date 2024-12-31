import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
	customField: string; //if we want to add custom fields to user object
};
declare module "@auth/core" {
	interface Session {
		user: ExtendedUser;
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/login", //this is the path to the login page always
		error: "/auth/error", //this is the path to the error page always
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() }, //users who login with google or github will have their email verified already so we can set emailVerified to current date no need verify the email again
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== "credentials") return true; //Allow OAuth without email verification

			if (!user.id) return false;
			const existingUser = await getUserById(user.id);

			//prevent login if email is not verified
			if (!existingUser?.emailVerified) return false;
			return true;
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				//here sub is the user id
				session.user.id = token.sub; //this is how we extract user id from token
			}

			//session.user.customField = "custom value"

			if (token.role && session.user) {
				//@ts-expect-error //this is a next auth issue
				session.user.role = token.role as UserRole;
			}
			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
});
