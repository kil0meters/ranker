"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hashString, type getRankingItems } from '@/util';
import { getPairByIndex } from '@/order';
import { useAuth } from '@clerk/nextjs';

export type ButtonOption = {
    text: string,
    publicId: string,
}

export function ClientGuessButtons({
    publicRankingId,
    items,
    startIndex
}: {
    publicRankingId: string,
    items: Awaited<ReturnType<typeof getRankingItems>>,
    startIndex: number
}) {
    const [index, setIndex] = useState(startIndex);
    const { userId } = useAuth();

    let choices = [...items].sort((a, b) => a.text > b.text ? 1 : -1); // required to make ordering consistent

    const router = useRouter();

    const query = async (choices: string[], index: number) => {
        await fetch("/api/vote", {
            method: "POST",
            body: JSON.stringify({
                rankingId: publicRankingId,
                choices,
                index,
            })
        });

        router.refresh();
    };

    try {
        const pair = getPairByIndex(choices.length, index, userId ? hashString(userId) : 0);
        return (
            <div className="grid grid-cols-2 w-full gap-2 md:gap-8 mb-4 aspect-[32/9]">
                <GuessButton
                    index={0}
                    text={choices[pair[0]].text}
                    onClick={() => {
                        query([choices[pair[0]].publicId, choices[pair[1]].publicId], 0);
                        setIndex(index + 1);
                    }} />

                <GuessButton
                    index={0}
                    text={choices[pair[1]].text}
                    onClick={() => {
                        query([choices[pair[0]].publicId, choices[pair[1]].publicId], 1);
                        setIndex(index + 1);
                    }} />
            </div>
        );
    } catch (e) {
        return (
            <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 max-w-lg rounded-lg mx-auto p-8 shadow-md">
                <span className="text-6xl font-bolder">You rated everything. 😊</span>
            </div>
        );
    }
}

function GuessButton({ text, onClick }: { text: string, index: number, onClick: () => void }) {
    return (
        <button
            className='shadow-lg aspect-video p-8 text-xl md:text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl'
            onClick={onClick}>
            {text}
        </button>
    );
}
