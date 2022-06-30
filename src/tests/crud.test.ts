import { describe, test } from 'mocha'
import { expect } from 'chai'
import { byo_query_fn } from '../config/orma'
import { orma_schema } from '../../generated/orma_schema'
import { orma_mutate, orma_query, orma_introspect } from 'orma'
import { validate_mutation } from 'orma/build/mutate/verifications/mutate_validation'
import { validate_query } from 'orma/build/query/validation/query_validation'

describe('Crud Orma', () => {
    test('Crud', async () => {
        const body = {
            users: {
                id: true,
                email: true,
                password: true,
                first_name: true,
                last_name: true,
                phone: true,
                created_at: true,
                updated_at: true
            }
        }

        const result: any = await orma_query(
            body,
            orma_schema,
            strings => byo_query_fn(strings.map(s => ({ sql_string: s }))),
            i => i
        )
        if (result?.users.length) {
            await orma_mutate(
                { $operation: 'delete', users: result?.users },
                byo_query_fn,
                orma_schema
            )
        }

        const user = {
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890'
        }
        const mutation = {
            $operation: 'create',
            users: [user]
        }
        const mutate_response = await orma_mutate(mutation, byo_query_fn, orma_schema)

        expect(mutate_response.users.length).to.equal(1)
    })
})
