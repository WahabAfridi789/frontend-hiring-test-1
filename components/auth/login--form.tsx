"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { loginAction } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { LoginFormSchema } from "@/schema"
import { Loader } from "lucide-react"
import { CustomFormField, FormFieldType } from "../shared/custom-form-input"


export function LoginForm() {
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
        await loginAction(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

                <CustomFormField
                    control={form.control}
                    label="User Name"
                    name="username"
                    placeholder="Enter your username"
                    fieldType={FormFieldType.INPUT}
                    icon={<PersonIcon />}



                />

                <CustomFormField
                    control={form.control}
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    fieldType={FormFieldType.PASSWORD_INPUT}
                    icon={<LockClosedIcon />}
                />








                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>

                    {
                        form.formState.isSubmitting && <Loader className="w-6 h-6 mr-2 animate-spin" />
                    }
                    {form.formState.isSubmitting ? "Loging..." : "Login"}
                </Button>
            </form>
        </Form>
    )
}
