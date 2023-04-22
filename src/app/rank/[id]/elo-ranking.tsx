type EloRankingItem = {
    elo: number;
    name: string;
};

export async function EloRanking({ items }: { items: EloRankingItem[] }) {
    return (
        <table className="w-full">
            <thead>
                <th className="border border-neutral-300 bg-neutral-50">Item</th>
            </thead>
{/* 

   */}      </table>
    );
}
