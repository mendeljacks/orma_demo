import { orma_mutate } from 'orma'
import { clone } from 'orma/build/helpers/helpers'
import { apply_inherit_operations_macro } from 'orma/build/mutate/macros/inherit_operations_macro'
import { orma_schema } from '../../generated/orma_schema'
import { pool, trans } from './pg'

/**
 * Standardizes the output so it is always an array of arrays
 */
export const byo_query_fn = async (sqls: string[], connection = pool) => {
    const sql = sqls.join(';\n')
    const response = await connection.query(sql)

    // pg driver returns array only when multiple statements detected
    if (!Array.isArray(response)) {
        return [response.rows]
    } else {
        return response.map(row => row.rows)
    }
}

export const byo_mutate_fn = (user_mutation: any) => {
    return trans(async connection => {
        // Add resource_ids so that every table has at least one unique column for retrieving data
        const mutation = clone(user_mutation)
        apply_inherit_operations_macro(mutation)

        // Kick out users who don't have perms
        // await authorize_create(mutation, auth_data)

        // Validate the mutation
        // const errors = validate_mutation(mutation, orma_schema)
        // if (errors.length > 0) {
        //     return Promise.reject(errors)
        // }

        // Run orma mutation
        const mutation_results = await orma_mutate(
            mutation,
            async vals => {
                const results = await byo_query_fn(
                    vals.map(({ sql_string }) => sql_string),
                    connection
                )
                return results
            },
            orma_schema
        )

        return mutation_results
    })
}
