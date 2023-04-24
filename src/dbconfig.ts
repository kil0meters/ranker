import { Kysely } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'
import { DB } from './db/types';

export const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    useSharedConnection: true,
};

export const db = new Kysely<DB>({
    dialect: new PlanetScaleDialect(config),
});
