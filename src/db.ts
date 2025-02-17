import {createPool, PoolOptions} from 'mysql2/promise';
import { DB } from './config/config.js';

const dbConfig: PoolOptions = {
    host: DB.host,
    port: Number(DB.port),
    user: DB.user,
    password: DB.password,
    database: DB.database,
    connectionLimit: 10
}
export const connect = createPool(dbConfig);