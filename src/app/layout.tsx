import Link from 'next/link'
import { ClerkProvider, currentUser } from "@clerk/nextjs/app-beta";
import './globals.css'
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { SignOutButton } from './sign-out';
import { Header } from './header';

export const metadata = {
    title: 'Ranker',
    description: 'Rank things',
}

function Footer() {
    return (
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
                        <a href="https://github.com/kil0meters/hackathon-coffeedrinkers-2023" className='text-cyan-900'>
                            github
                        </a>
                    </div>
                    <div>
                        <h3 className='font-bold'>Find bugs?</h3>
                        <a href='https://github.com/kil0meters/hackathon-coffeedrinkers-2023/issues/new' className='text-cyan-900'>
                            report them here on github
                        </a>
                    </div>
                </div>
            </div>
        </footer >
    );
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await currentUser();

    return (
        <html lang="en" className='min-h-screen'>
            <body className='min-h-screen flex flex-col'>
                <ClerkProvider>
                    <Header session={session ? {
                        firstName: session.firstName!,
                        lastName: session.lastName!,
                        profileImageUrl: session.profileImageUrl
                    } : null} />
                    <main className='my-24 px-2 md:px-0'>{children}</main>
                    <Footer />
                </ClerkProvider>
            </body>
        </html>
    )
}
