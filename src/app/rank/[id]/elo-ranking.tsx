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
            {items.map((item, i) =>
                <tr className="group">
                    <td className="border border-neutral-300 p-2">{item.name}</td>
                </tr>
            )}
   */}      </table>
    );
}
