import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
	isTwoFactorAuthEnabled: boolean;
	//customField: string; //if we want to add custom fields to user object
};
declare module "@auth/core" {
	interface Session {
		user: ExtendedUser;
	}
}
