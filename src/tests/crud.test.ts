import { expect } from 'chai'
import { describe, test } from 'mocha'
import { mutate_handler, query_handler } from '../config/orma'

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

        const result: any = await query_handler(body)
        if (result?.users.length) {
            await mutate_handler({ $operation: 'delete', users: result?.users })
        }

        const user = {
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890'
            // user_has_roles: [
            //     {
            //         roles: [
            //             {
            //                 name: 'admin'
            //             }
            //         ]
            //     }
            // ]
        }
        const mutation = {
            $operation: 'create',
            users: [user]
        }

        const mutate_response = await mutate_handler(mutation)

        expect(mutate_response.users.length).to.equal(1)
    })
})
