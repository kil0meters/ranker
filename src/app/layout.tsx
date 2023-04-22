import Link from 'next/link'
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import './globals.css'
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const metadata = {
    title: 'Ranker',
    description: 'Rank things',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body>
                <div className='border-b border-neutral-300 p-4 w-full mb-4'>
                    <div className='container mx-auto flex'>
                        <Link href={"/"} className='font-bold text-lg hover:underline'>
                            Ranker
                        </Link>

                        {session
                            ? <Link className='ml-auto hover:underline' href={"/api/auth/signout"}>Sign out</Link>
                            : <Link className="ml-auto hover:underline" href={"/signin"}>Sign in</Link>}
                    </div>
                </div>

                {JSON.stringify(session)}

                {children}
            </body>
        </html>
    )
}
