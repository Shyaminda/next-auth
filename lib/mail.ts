import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "Confirm your email",
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
	});
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
	const resetLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "Reset your password",
		html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "2 factor authentication code",
		html: `<p>Your 2FA code: ${token}</p>`,
	});
};
