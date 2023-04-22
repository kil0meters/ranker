"use client";

import { signIn } from "next-auth/react"

export function SigninButton({ provider, providerStyle }: { provider: string, providerStyle: string }) {
    return (
        <button
            onClick={() => signIn(provider, { callbackUrl: "/" })}
            className='bg-neutral-900 p-2 rounded text-neutral-50 hover:bg-neutral-800 transition-colors'>
            Sign in with {providerStyle}
        </button>
    );
}
