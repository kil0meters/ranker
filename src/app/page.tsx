//import { GuessButton } from '@/components/guess-button';
//import { config } from '@/dbconfig'
//import { connect } from '@planetscale/database'
//import { PrismaClient } from '@prisma/client';
import { ShowEntries } from '@/components/entries';

export default function Home() {
    return (
        <main className="container mx-auto">
			<ShowEntries />
        </main>
    );
}
