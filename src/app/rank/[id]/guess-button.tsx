"use client";

import { RankingItem } from '@prisma/client';
import { useRouter } from 'next/navigation';

export function GuessButton({ rankingId, options, index }: { rankingId: string, options: RankingItem[], index: number }) {
    const router = useRouter();
    const choices = options.map(x => x.id);

    const click = async () => {
		// blur all the button and disable after clicked util after fetched
		const buttons = document.getElementsByClassName('needToToggle');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.add('opacity-50', 'pointer-events-none');
		}

        await fetch("/api/vote", {
            method: "POST",
            body: JSON.stringify({
                rankingId,
                choices,
                index
            })
        });

        router.refresh();
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove('opacity-50', 'pointer-events-none');
		}

    };

    return (
        <button
            className='shadow-lg aspect-video p-8 text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl'
            onClick={click}>
            {options[index].text}
        </button>
    );
}
