"use server";

import { z } from "zod";

import { signIn, signOut } from "@/app/auth";
import { LoginFormSchema } from "@/schema";
import { NextResponse } from "next/server";

export async function loginAction(data: z.infer<typeof LoginFormSchema>) {
  //Validating data on server side as well

  const result = LoginFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors,
    };
  }

  const { username, password } = data;

  const response = await signIn("credentials", {
    username,
    password,
    redirectTo: "/",
  });

  return NextResponse.json({
    success: true,
    message: "Login successful",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
