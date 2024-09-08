import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username is required.",
    })
    .min(3, {
      message: "Username must be at least 2 characters.",
    }),

  password: z
    .string()
    .min(1, {
      message: "Password is required.",
    })
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),
});
