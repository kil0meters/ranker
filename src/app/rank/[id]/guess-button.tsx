"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GuessButton } from './guess-button2';
import { LoadingGuessButtons } from './loading-guess-buttons';

export type ButtonOption = {
    text: string,
    publicId: string,
}

type GuessButtonContainerProps = {
    rankingId: string,
    options: ButtonOption[]
};

export function GuessButtonContainer({ rankingId, options }: GuessButtonContainerProps) {
    const [loading, setLoading] = useState(false);
    const choices = options.map(x => x.publicId);
    const router = useRouter();

    const query = async (index: number) => {
        if (loading) return;

        setLoading(true);

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

    useEffect(() => {
        setLoading(false);
    }, [options])

    if (loading) {
        return (
            <LoadingGuessButtons />
        );
    } else {
        return (
            <div className="grid grid-cols-2 w-full gap-2 md:gap-8 mb-4 aspect-[32/9]">
                <GuessButton index={0} options={options} onClick={() => query(0)} />
                <GuessButton index={1} options={options} onClick={() => query(1)} />
            </div>
        );
    }
}
