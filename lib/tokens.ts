import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-rest-token";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date()).getTime() + 3600 * 1000; //1 hour

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await db.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expiresAt: new Date(expires),
		},
	});

	return verificationToken;
};

export const generatePasswordRestToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date()).getTime() + 3600 * 1000; //1 hour

	const existingToken = await getPasswordResetTokenByEmail(email);

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const resetToken = await db.passwordResetToken.create({
		data: {
			email,
			token,
			expiresAt: new Date(expires),
		},
	});

	return resetToken;
};

export const generateTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100_000, 1_000_000).toString();
	const expires = new Date(new Date()).getTime() + 600 * 1000; //10 minutes

	const existingToken = await getTwoFactorTokenByEmail(email);

	if (existingToken) {
		await db.twoFactorToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const twoFactorToken = await db.twoFactorToken.create({
		data: {
			email,
			token,
			expiresAt: new Date(expires),
		},
	});

	return twoFactorToken;
};
