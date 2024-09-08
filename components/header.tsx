import { auth } from '@/app/auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { signOutAction } from '@/actions/auth.actions'

export const Header = async () => {
    const session = await auth()
    return (
        <div className=' !container flex justify-between items-center'>
            <Link href={"/"}>
                <Image
                    src={"/assets/logo.png"}
                    width={300}
                    alt='Turing-Logo'
                    priority
                    height={100}
                />
            </Link>

            {
                session?.user && (
                    <form action={signOutAction}>
                        <Button className=' text-white font-bold py-2 px-4 rounded'>
                            Sign Out
                        </Button>
                    </form>
                )



            }


        </div>
    )
}
