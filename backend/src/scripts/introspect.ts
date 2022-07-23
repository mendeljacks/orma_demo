import { writeFileSync } from 'fs'
import { orma_introspect } from 'orma/src/index'
import { byo_query_fn } from '../config/orma'
import { get_pool_pg } from '../config/pg'

export const introspect = async db => {
    const orma_schema = await orma_introspect(
        'public',
        sqls => byo_query_fn(sqls, get_pool_pg(process.env.pg)),
        { db_type: 'postgres' }
    )
    try {
        const str = `export const orma_schema = ${JSON.stringify(orma_schema, null, 2)} as const`
        writeFileSync('../common/orma_schema.ts', str)
    } catch (error) {
        console.log('Could not save the orma schema')
    }
}
