"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

	if (!user || !user.id) {
		return { error: "User not found" };
	}

	const dbUser = await getUserById(user.id);

	if (!dbUser) {
		return { error: "User not found" };
	}
	//even though the isOAuth gives a error it works there is a issue with next-auth
	//@ts-expect-error this is a next auth error
	if (user.isOAuth) {
		values.email = undefined;
		values.password = undefined;
		values.newPassword = undefined;
		values.isTwoFactorAuthEnabled = undefined;
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) {
			return { error: "Email already in use!" };
		}

		const verificationToken = await generateVerificationToken(values.email);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);

		return { success: "Verification email sent!" };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordMatch = await bcrypt.compare(
			values.password,
			dbUser.password,
		);

		if (!passwordMatch) {
			return { error: "Enter the correct existing password!" };
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, 10);
		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	await db.user.update({
		where: { id: dbUser.id },
		data: {
			...values,
		},
	});

	return { success: "Settings updated!" };
};
