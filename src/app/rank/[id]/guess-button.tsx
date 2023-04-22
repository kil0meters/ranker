"use client";

import { useRouter } from 'next/navigation';

export function GuessButton({ index, text }: { index: number, text: string }) {
    const router = useRouter();

    const click = async () => {
        await fetch("/api/vote", {
            method: "POST",
            body: JSON.stringify({
                choice: index,
            })
        });

        router.refresh();
    };

    return (
        <button
            className='shadow-lg aspect-video p-8 text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl'
            onClick={click}>
            {text}
        </button>
    );
}
