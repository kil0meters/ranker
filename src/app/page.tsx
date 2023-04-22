import { GuessButton } from '@/components/guess-button';
import { config } from '@/dbconfig'
import { connect } from '@planetscale/database'

async function ShowNumber() {
    const conn = connect(config);
    const results = await conn.execute('select 1 as col from dual where 1=?', [1])

    return (
        <div>
            {JSON.stringify(results.rows[0])}
        </div>
    );
}

const entryPerPage=10;

export default function Home() {

    return (
        <main className="container mx-auto">
            <ShowNumber />
        </main>
    );
}
