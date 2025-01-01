import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const getTwoToken = await db.twoFactorToken.findUnique({
			where: {
				token,
			},
		});

		return getTwoToken;
	} catch {
		return null;
	}
};

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const getTwoFactorToken = await db.twoFactorToken.findFirst({
			where: {
				email,
			},
		});

		return getTwoFactorToken;
	} catch {
		return null;
	}
};
