import { prisma } from "@/dbconfig";
import { notFound } from "next/navigation";
import { GuessButton } from "./guess-button";
import { EloRanking } from "./elo-ranking";

export default async function Ranking({ params }: { params: { id: string } }) {
    const ranking = await prisma.ranking.findUnique({
        select: {
            name: true,
            description: true,
            user: true,
        },
        where: {
            id: params.id
        }
    });

    if (!ranking) notFound();

    return (
        <div className='mx-auto container flex flex-col gap-4'>

            <div>
                <h1 className='text-2xl font-extrabold'>
                    {ranking.name}
                </h1>
                <span className='text-neutral-500'>
                    {ranking.user.name}
                </span>
            </div>

            <p>
                {ranking.description}
            </p>

            <div className="grid grid-cols-2 w-full gap-8 mb-4">
                <GuessButton index={0} text={"C++"} />
                <GuessButton index={1} text={"Rust"} />
            </div>

            <div className="grid grid-cols-10 gap-4">
                <div className="col-start-3 col-end-6">
                    <h2 className="text-lg font-bold">Personal Leaderboard</h2>

                    <EloRanking items={[
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                    ]} />
                </div>

                <div className="col-start-6 col-end-9">
                    <h2 className="text-lg font-bold">Global Leaderboard</h2>

                    <EloRanking items={[
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                        { elo: 1500, name: "Burger" },
                    ]} />
                </div>
            </div>
        </div>
    );
}
