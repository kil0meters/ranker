"use client";

import { auth } from "@clerk/nextjs/app-beta";
import { User } from "@clerk/nextjs/dist/api";
import Link from 'next/link'
import rankerLogo from "../../public/Ranker.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./sign-out";
import { useState } from "react";

export function Header({ session }: { session: { firstName: string, lastName: string, profileImageUrl: string } | null }) {
    const [hidden, setHidden] = useState(true);

    return (
        <nav className='border-b border-neutral-300 p-4 w-full mb-4 fixed backdrop-blur bg-white/50 shadow-white'>
            <div className='container mx-auto flex justify-between flex-col gap-4 md:flex-row'>
                <div className='flex'>
                    <Link href={"/"} className='font-bold text-lg hover:underline flex items-center gap-2'>
                        <Image
                            priority
                            src={rankerLogo}
                            height={36}
                            alt="Follow us on Twitter"
                        />

                        Ranker
                    </Link>

                    <Button variant={"secondary"} className='font-bold ml-auto md:hidden' onClick={() => setHidden(!hidden)}>
                        Menu
                    </Button>
                </div>

                <div className={`flex-col md:flex-row gap-4 ${hidden ? "hidden" : "flex"} md:flex`}>
                    {session
                        ? (<>
                            <div className='md:md-0 flex gap-4 items-center'>
                                <img className="inline h-9 w-9 rounded-full" src={session.profileImageUrl} alt='Logo' />
                                <span className='font-bold'>{session.firstName} {session.lastName}</span>
                            </div>

                            <Link href={"/new"} className='font-bold text-lg'>
                                <Button variant="default" className="font-bold text-lg">
                                    New Ranking
                                </Button>
                            </Link>

                            <SignOutButton />
                        </>)
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
