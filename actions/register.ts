"use server";

import { registerSchema } from "@/schemas";
import { z } from "zod";

export const register = async (values: z.infer<typeof registerSchema>) => {
	const validateFields = registerSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	return { success: "Email sent" };
};
