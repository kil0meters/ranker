import Link from 'next/link'
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import './globals.css'
import { authOptions } from './api/auth/[...nextauth]/route';

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
        <html lang="en" className='min-h-screen'>
            <body className='min-h-screen flex flex-col'>
                <nav className='border-b border-neutral-300 p-4 w-full mb-4 fixed backdrop-blur shadow-white'>
                    <div className='container mx-auto flex justify-between items-center'>
                        <Link href={"/"} className='font-bold text-lg hover:underline'>
                            Ranker
                        </Link>

                        <div>
                            {session
                                ? (
                                    <div className='inline space-x-5'>
                                        <div className='inline'>Hi, {session.user?.name}</div>
                                        <Link href={"/new"} className='font-bold text-lg hover:underline'>
                                            New Ranking
                                        </Link>
                                        <Link href={"/api/auth/signout"} className='font-bold text-lg hover:underline'>
                                            Sign out
                                        </Link>
                                    </div>
                                )
                                : (
                                    <Link href={"/signin"} className='font-bold text-lg hover:underline'>
                                        Sign in
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </nav>
                {/*place holder*/}
                <div className='mb-auto mt-24'>
                    {children}
                </div>

                <div className='bg-neutral-50 border-neutral-300 border-t mt-8 p-8 flex bottom-0'>
                    <a className='hover:underline mx-auto' href="https://github.com/kil0meters/hackathon-coffeedrinkers-2023">Github</a>
                </div>
            </body>
        </html>
    )
}
