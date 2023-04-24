import Link from 'next/link'
import { ClerkProvider, currentUser } from "@clerk/nextjs/app-beta";
import './globals.css'
import Image from "next/image";
import rankerLogo from "../../public/Ranker.svg";
import { Button } from '@/components/ui/button';
import { SignOutButton } from './sign-out';

export const metadata = {
    title: 'Ranker',
    description: 'Rank things',
}

async function Header() {
    const session = await currentUser();

    return (
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
                            <div className='flex gap-4 items-center'>
                                <span className='font-bold'>{session.firstName} {session.lastName}</span>
                                <img className="inline h-9 w-9 rounded-full" src={session.profileImageUrl} alt='Logo' />

                                <Button variant="default">
                                    <Link href={"/new"} className='font-bold text-lg'>
                                        New Ranking
                                    </Link>
                                </Button>

                                <SignOutButton />
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
    );
};

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
    return (
        <html lang="en" className='min-h-screen'>
            <body className='min-h-screen flex flex-col'>
                <ClerkProvider>
                    <Header />
                    <main className='my-24'>{children}</main>
                    <Footer />
                </ClerkProvider>
            </body>
        </html>
    )
}
