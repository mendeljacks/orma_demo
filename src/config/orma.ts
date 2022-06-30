import { orma_mutate } from 'orma'
import { clone } from 'orma/build/helpers/helpers'
import { apply_inherit_operations_macro } from 'orma/build/mutate/macros/inherit_operations_macro'
import { validate_mutation } from 'orma/build/mutate/verifications/mutate_validation'
import { orma_schema } from '../../generated/orma_schema'
import { pool, trans } from './pg'

/**
 * Standardizes the output so it is always an array of arrays
 */
export const byo_query_fn = async (sqls: { sql_string }[], connection = pool) => {
    const sql = sqls.map(el => el.sql_string).join(';\n')
    const response = await connection.query(sql)

    // pg driver returns array only when multiple statements detected
    if (!Array.isArray(response)) {
        return [response.rows]
    } else {
        return response.map(row => row.rows)
    }
}

export const mutate_handler = (mutation, orma_schema) => {
    return trans(async connection => {
        const errors = validate_mutation(mutation, orma_schema)
        if (errors.length > 0) {
            return Promise.reject(errors)
        }

        // Run orma mutation
        const mutation_results = await orma_mutate(mutation, byo_query_fn, orma_schema)
        return mutation_results
    })
}
