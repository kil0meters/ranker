"use client";

import { RankingItem } from '@prisma/client';
import { useRouter } from 'next/navigation';

export function GuessButton({ rankingId, options, index }: { rankingId: string, options: RankingItem[], index: number }) {
    const router = useRouter();
    const choices = options.map(x => x.id);

    const click = async () => {
        await fetch("/api/vote", {
            method: "POST",
            body: JSON.stringify({
                rankingId,
                choices,
                index
            })
        });

        router.refresh();
    };

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={click}>
            {options[index].text}
        </button>
    );
}
