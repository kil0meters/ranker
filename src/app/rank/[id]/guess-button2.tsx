import { RankingItem } from "@prisma/client";

export function GuessButton({ options, index, onClick }: { options: RankingItem[], index: number, onClick: () => void }) {
    return (
        <button
            className='shadow-lg aspect-video p-8 text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl'
            onClick={onClick}>
            {options[index].text}
        </button>
    );
}

