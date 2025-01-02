import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

declare module "next-auth" {
	interface User {
		role?: UserRole; //Anywhere you use session.user, TypeScript will now recognize user.role as a valid property
	}
}

export const useCurrentRole = () => {
	const session = useSession();

	return session.data?.user?.role;
};
