import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-rest-token";

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date().getTime() + 3600 * 1000; //1 hour

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
	const expires = new Date().getTime() + 3600 * 1000; //1 hour

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
