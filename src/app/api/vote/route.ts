import { connect } from '@planetscale/database'
import { config } from '@/dbconfig'

export async function POST(request: Request) {
    const conn = connect(config);
    const results = await conn.execute('select 1 as col from dual where 1=?', [1])

    return new Response();
}
