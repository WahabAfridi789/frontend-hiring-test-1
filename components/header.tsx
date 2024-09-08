import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Header = async () => {
    return (
        <div className=' max-w-7xl'>
            <Link href={"/"}>
                <Image
                    src={"/assets/logo.png"}
                    width={300}
                    alt='Turing-Logo'
                    priority
                    height={100}
                />
            </Link>
        </div>
    )
}
