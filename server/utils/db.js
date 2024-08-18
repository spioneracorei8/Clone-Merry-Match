import * as pg from 'pg';

const {Pool} = pg.default;

const pool = new Pool({
    connectionString: process.env.PSQL_CONNECTION_MERRY_MATCH 
});

export default pool;