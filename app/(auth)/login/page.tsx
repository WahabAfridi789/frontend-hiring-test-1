
import { getUserCookies } from "@/actions/auth.actions"
import { LoginForm } from "@/components/auth/login--form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { redirect } from "next/navigation"


const LoginPage = async () => {
    //temporary solution to protect this page
    const isAuthenticated = await getUserCookies()
    if (isAuthenticated)
        redirect('/')

    return (
        <section className=" flex h-screen items-center justify-center w-full">

            <Card className="w-full max-w-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription className="font-medium  ">
                        Enter your username and password to login to your account.
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

