type EloRankingItem = {
    elo: number;
    text: string;
};

export async function EloRanking({ items }: { items: EloRankingItem[] }) {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th className="border border-neutral-300 bg-neutral-50 p-2">#</th>
                    <th className="border border-neutral-300 bg-neutral-50 p-2">Item</th>
                    <th className="border border-neutral-300 bg-neutral-50 p-2">Elo</th>
                </tr>
            </thead>

            <tbody>
                {items.map((item, i) =>
                    <tr className="group" key={i}>
                        <td className="group-last-of-type:rounded-bl border border-neutral-300 p-2">{i + 1}</td>
                        <td className="border border-neutral-300 p-2">{item.text}</td>
                        <td className="group-last-of-type:rounded-br border border-neutral-300 p-2">{item.elo}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
