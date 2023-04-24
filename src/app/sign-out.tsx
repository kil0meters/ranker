"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export function SignOutButton() {
    const { signOut } = useAuth();
    const router = useRouter();

    return (
        <Button variant="secondary" className="font-bold text-lg" onClick={async () => {
            await signOut();
            router.refresh();
        }}>
            Sign out
        </Button>
    );
}

