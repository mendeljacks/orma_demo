import cuid from 'cuid'
import { OrmaStatement, orma_introspect } from 'orma'
import { orma_mutate, orma_query } from 'orma/src/index'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { mutation_entity_deep_for_each } from 'orma/src/mutate/helpers/mutate_helpers'
import { apply_inherit_operations_macro } from 'orma/src/mutate/macros/inherit_operations_macro'
import { validate_mutation } from 'orma/src/mutate/verifications/mutate_validation'
import { orma_schema } from '../../../common/orma_schema'
import { get_pool_mysql, mysql_trans } from './mysql'
import { get_pool_pg, pg_trans } from './pg'

/**
 * Standardizes the output so it is always an array of arrays
 */
export type DbType = 'mysql' | 'postgres'
export const byo_query_fn = async (sqls: { sql_string }[], connection, db_type: DbType) => {
    const sql = sqls.map(el => el.sql_string).join(';\n')
    const response = await connection.query(sql)

    if (db_type === 'postgres') {
        // pg driver returns array only when multiple statements detected
        if (!Array.isArray(response)) {
            return [response.rows]
        } else {
            return response.map(row => row.rows)
        }
    }
    if (db_type === 'mysql') {
        if (!Array.isArray(response[0])) {
            return [response]
        } else {
            return response
        }
    }
}

const add_resource_ids = (mutation: any) => {
    mutation_entity_deep_for_each(mutation, (value, path) => {
        if (value?.$operation === 'create') {
            const resource_id = cuid()
            value.resource_id = resource_id
        }
    })
}
export const mutate_handler = (mutation: any, connection: any, trans: any, db_type: DbType) => {
    return trans(async connection => {
        apply_inherit_operations_macro(mutation)
        add_resource_ids(mutation)

        const errors = validate_mutation(mutation, orma_schema as unknown as OrmaSchema)
        if (errors.length > 0) {
            return Promise.reject(errors)
        }

        // Run orma mutation
        const mutation_results = await orma_mutate(
            mutation,
            sqls => byo_query_fn(sqls, connection, db_type),
            orma_schema as unknown as OrmaSchema
        )
        return mutation_results
    })
}

export const query_handler = (query: any, connection: any, db_type: DbType) => {
    return orma_query(query, orma_schema as unknown as OrmaSchema, sqls =>
        byo_query_fn(sqls, connection, db_type)
    )
}

export const introspect_handler = (db: string, connection: any, db_type: DbType) => {
    return orma_introspect(db, sqls => byo_query_fn(sqls, connection, db_type), { db_type })
}

export const get_pool_trans = async (req_query: { db_type: DbType; mysql?: any; pg?: any }) => {
    const db_type = req_query.db_type
    const mysql = JSON.parse(req_query.mysql || '{}')
    const pg = JSON.parse(req_query.pg || '{}')

    if (db_type === 'mysql') {
        const pool = await get_pool_mysql(mysql)
        return { pool, trans: mysql_trans(pool), db: mysql.database, db_type }
    }
    if (db_type === 'postgres') {
        const pool = get_pool_pg(pg.connection_string || process.env.pg)
        return { pool, trans: pg_trans(pool), db: pg.database, db_type }
    }
}
