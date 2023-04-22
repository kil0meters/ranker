type EloRankingItem = {
    elo: number;
    name: string;
};

export async function EloRanking({ items }: { items: EloRankingItem[] }) {
    return (
        <table className="w-full">
            <thead>
                <th className="border border-neutral-300 bg-neutral-50 rounded-lg p-2">#</th>
                <th className="border border-neutral-300 bg-neutral-50">Item</th>
                <th className="border border-neutral-300 bg-neutral-50 rounded-tr">Elo</th>
            </thead>

            {items.map((item, i) =>
                <tr className="group">
                    <td className="group-last-of-type:rounded-bl border border-neutral-300 p-2">{i}</td>
                    <td className="border border-neutral-300 p-2">{item.name}</td>
                    <td className="group-last-of-type:rounded-br border border-neutral-300 p-2">{item.elo}</td>
                </tr>
            )}
        </table>
    );
}
