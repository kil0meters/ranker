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
            {items.map((item, i) =>
                <tr className="group" key={i}>
                    <td className="group-last-of-type:rounded-bl border border-neutral-300 p-2">{i + 1}</td>
                    <td className="border border-neutral-300 p-2">{item.name}</td>
                    <td className="group-last-of-type:rounded-br border border-neutral-300 p-2">{item.elo}</td>
                </tr>
            )}
        </table>
    );
}
