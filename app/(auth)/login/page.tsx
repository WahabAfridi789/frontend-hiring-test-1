"use client"

import { LoginForm } from "@/components/auth/login--form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import React from 'react'

const LoginPage = () => {
    return (
        <section className=" flex justify-center w-full">

            <Card className="w-full max-w-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <LoginForm />

                </CardContent>

            </Card>

        </section>
    )
}

export default LoginPage

