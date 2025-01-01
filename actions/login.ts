/* eslint-disable indent */
"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
	generateTwoFactorToken,
	generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
	const validateFields = loginSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password, code } = validateFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.password || !existingUser.email) {
		return { error: "Email does not exist" };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email,
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);

		return { success: "Confirmation email sent!" };
	}

	if (existingUser.isTwoFactorAuthEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				//if the token is not found
				return { error: "Invalid code" };
			}

			if (twoFactorToken.token !== code) {
				return { error: "Invalid code" };
			}

			const hasExpired =
				new Date(twoFactorToken.expiresAt).getTime() < Date.now();

			if (hasExpired) {
				return { error: "Code has expired!" };
			}

			await db.twoFactorToken.delete({
				where: {
					id: twoFactorToken.id,
				},
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id,
			);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: {
						id: existingConfirmation.id,
					},
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

			return { twoFactor: true };
		}
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" };
				default:
					return { error: "An error occurred" };
			}
		}
		throw error;
	}
};
