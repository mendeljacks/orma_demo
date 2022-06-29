import { writeFileSync } from 'fs'
import { orma_introspect } from 'orma/build/introspector/introspector'
import { byo_query_fn } from '../config/orma'

export const introspect = async db => {
    const orma_schema = await orma_introspect(db, byo_query_fn)
    try {
        const str = `export const orma_schema = ${JSON.stringify(orma_schema, null, 2)} as const`
        writeFileSync('./generated/orma_schema.ts', str)
    } catch (error) {
        console.log('Could not save the orma schema')
    }
}
