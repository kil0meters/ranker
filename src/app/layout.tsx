import Link from 'next/link'
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import './globals.css'
import { authOptions } from './api/auth/[...nextauth]/route';
import Image from "next/image";
import rankerLogo from "../../public/Ranker.svg";

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
                <nav className='border-b border-neutral-300 p-4 w-full mb-4 fixed backdrop-blur bg-white/50 shadow-white'>
                    <div className='container mx-auto flex justify-between items-center'>
                        <Link href={"/"} className='font-bold text-lg hover:underline flex items-center gap-2'>
                            <Image
                                priority
                                src={rankerLogo}
                                height={36}
                                alt="Follow us on Twitter"
                            />

                            Ranker
                        </Link>
                        <div>
                            {session
                                ? (
                                    <div className='inline space-x-5 flex items-center'>
                                        <div className='inline'>Hi, {session.user?.name}</div>
                                        <img className="inline object-scale-down h-8 w-8" src={session.user?.image} alt='Logo' />
                                        <button className='px-2 p-1 rounded-lg bg-cyan-300 hover:bg-cyan-400'>
                                            <Link href={"/new"} className='font-bold text-lg'>
                                                New Ranking
                                            </Link>
                                        </button>
                                        <button className='px-2 p-1 rounded-lg bg-cyan-300 hover:bg-red-400'>
                                            <Link href={"/api/auth/signout"} className='font-bold text-lg'>
                                                Sign out
                                            </Link>
                                        </button>
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

                <div className='my-24'>
                    {children}
                </div>

                <footer className="mt-auto bg-neutral-50 border-neutral-300 border-t grid grid-cols-2 text-center p-10">
                    <div>
                        <h3 className='font-bold'>Contributers</h3>
                        <div className="grid grid-cols-1 text-cyan-900">
                            <a href="https://github.com/WERDXZ">WERDXZ</a>
                            <a href="https://github.com/kil0meters">kil0meters</a>
                            <a href="https://github.com/lostdanielfound">lostdanielfound</a>
                            <a href="https://github.com/mcsharland">mcsharland</a>
                        </div>
                    </div>
                    <div>
                        <div className='grid grid-cols-1 grid-rows-2 gap-4'>
                            <div>

                                <h3 className='font-bold'>View us on</h3>
                                <a href="https://github.com/kil0meters/hackathon-coffeedrinkers-2023" className='text-cyan-900' >
                                    github
                                </a>
                            </div>
                            <div>
                                <h3 className='font-bold'>Find bugs?</h3>
                                <a href='
									https://github.com/kil0meters/hackathon-coffeedrinkers-2023/issues/new
									'
                                    className='text-cyan-900'

                                >
                                    report them here on github
                                </a>

                            </div>

                        </div>
                    </div>
                </footer>


            </body>
        </html>
    )
}
