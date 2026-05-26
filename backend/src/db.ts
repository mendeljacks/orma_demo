// biab's pg config sets parsers for int8 + TIMESTAMP as a side effect.
import 'biab/src/config/pg'
import { DbType, get_db_adapter, get_trans_fn } from 'biab/src/config/orma'
import { orma_introspect, OrmaSchema } from 'orma'
import { Pool as PgPool, types } from 'pg'
import mysql from 'promise-mysql'

// Round out the date/time parsers so values come back as raw strings
// (orma decides how to handle them downstream).
const identity = (val: any) => val
types.setTypeParser(1082, identity) // date
types.setTypeParser(1083, identity) // time
types.setTypeParser(1184, identity) // timestamptz

// Header contract used by the playground frontend:
//   x-database-type: 'postgres' | 'mysql'
//   x-db-config:     JSON for { connection_string } (pg) or { host,port,user,password,database } (mysql)
const HEADER_DB_TYPE = 'x-database-type'
const HEADER_DB_CONFIG = 'x-db-config'

export type PgHeaderConfig = { connection_string: string }
export type MysqlHeaderConfig = {
    host: string
    port?: string | number
    user: string
    password: string
    database: string
}

const parse_headers = (headers: Record<string, any>) => {
    const db_type = (headers[HEADER_DB_TYPE] as string)?.toLowerCase() as DbType
    if (db_type !== 'postgres' && db_type !== 'mysql') {
        throw new Error(`Missing or invalid '${HEADER_DB_TYPE}' header (got ${db_type})`)
    }
    const raw = headers[HEADER_DB_CONFIG] as string | undefined
    if (!raw) throw new Error(`Missing '${HEADER_DB_CONFIG}' header`)
    try {
        return { db_type, config: JSON.parse(raw) }
    } catch {
        throw new Error(`'${HEADER_DB_CONFIG}' header is not valid JSON`)
    }
}

// Pool + schema caches keyed by db config so repeated requests reuse them.
const pools = new Map<string, any>()
const schemas = new Map<string, OrmaSchema>()
const cache_key = (db_type: DbType, config: any) => `${db_type}::${JSON.stringify(config)}`

const get_pool = async (db_type: DbType, config: any): Promise<any> => {
    const key = cache_key(db_type, config)
    const cached = pools.get(key)
    if (cached) return cached

    const pool =
        db_type === 'postgres'
            ? new PgPool({ connectionString: (config as PgHeaderConfig).connection_string, max: 5 })
            : await mysql.createPool({
                  host: config.host,
                  port: config.port ? Number(config.port) : 3306,
                  user: config.user,
                  password: config.password,
                  database: config.database,
                  connectionLimit: 5,
                  multipleStatements: true,
                  timezone: 'utc'
              })
    pools.set(key, pool)
    return pool
}

// biab only registers postgres_promise_transaction; supply our own for mysql.
const mysql_trans = async <T>(fn: (conn: any) => Promise<T>, pool: mysql.Pool): Promise<T> => {
    const conn = await pool.getConnection()
    try {
        await conn.query('START TRANSACTION')
        const res = await fn(conn)
        await conn.query('COMMIT')
        return res
    } catch (err) {
        try {
            await conn.query('ROLLBACK')
        } catch {}
        throw err
    } finally {
        conn.release()
    }
}

export type Resolved = {
    db_type: DbType
    pool: any
    db_adapter: ReturnType<typeof get_db_adapter>
    trans: any
    get_schema: () => Promise<OrmaSchema>
    refresh_schema: () => Promise<OrmaSchema>
}

export const resolve_db = async (headers: Record<string, any>): Promise<Resolved> => {
    const { db_type, config } = parse_headers(headers)
    const pool = await get_pool(db_type, config)
    const db_adapter = get_db_adapter(db_type)
    const trans = db_type === 'postgres' ? get_trans_fn('postgres') : mysql_trans
    const key = cache_key(db_type, config)

    const refresh_schema = async () => {
        const schema = (await orma_introspect('public', db_adapter(pool), {
            database_type: db_type as any
        })) as OrmaSchema
        schemas.set(key, schema)
        return schema
    }
    const get_schema = async () => schemas.get(key) ?? refresh_schema()

    return { db_type, pool, db_adapter, trans, get_schema, refresh_schema }
}
