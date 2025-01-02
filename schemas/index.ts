import { UserRole } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }),
	password: z.string().min(1, { message: "Password is required" }),
	code: z.string().optional(),
});

export const registerSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }),
	password: z.string().min(6, { message: "Minimum 6 characters required" }),
	name: z.string().min(1, { message: "Name is required" }),
});

export const resetSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }),
});

export const newPasswordSchema = z.object({
	password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export const SettingsSchema = z
	.object({
		name: z.string().optional(),
		isTwoFactorAuthEnabled: z.boolean().optional(),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
		newPassword: z.string().min(6).optional(),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}
			return true;
		},
		{
			message: "Password is required",
			path: ["newPassword"],
		},
	)
	.refine(
		(data) => {
			if (!data.password && data.newPassword) {
				return false;
			}
			return true;
		},
		{
			message: "New Password is required",
			path: ["password"],
		},
	);
