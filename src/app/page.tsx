import { GuessButton } from '@/components/guess-button';
import { config } from '@/dbconfig'
import { connect } from '@planetscale/database'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ShowNumber() {
    const v = await prisma.ranking.create({
        data: {
            name: "This is a test ranking",
        }
    });

    const values = prisma.ranking.findMany();

    return (
        <div>
            {JSON.stringify(v)}
            {JSON.stringify(values)}
        </div>
    );
}

export default function Home() {
    return (
        <main className="container mx-auto">
            <div className='grid grid-cols-2 gap-4'>
                <GuessButton index={0} text={"C++"} />
                <GuessButton index={1} text={"Rust"} />
            </div>
            <ShowNumber />
        </main>
    );
}
