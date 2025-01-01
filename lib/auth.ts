import { auth } from "@/auth";

export const currentUser = async () => {
	const session = await auth();

	return session?.user;
};

export const currentUserRole = async () => {
	const session = await auth();

	return session?.user?.role;
};

//this is the client side hook
