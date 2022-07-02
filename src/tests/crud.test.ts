import { expect } from 'chai'
import cuid from 'cuid'
import { describe, test, beforeEach } from 'mocha'
import { mutate_handler, query_handler } from '../config/orma'
import { reset } from '../scripts/reset'

describe('Crud Orma', () => {
    beforeEach(async () => {
        await reset()
    })
    test('Create a user', async () => {
        const user = {
            id: { $guid: cuid() },
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

        const mutate_response = await mutate_handler(mutation)
        expect(mutate_response.users.length).to.equal(1)
    })
    test('Create a user select created_at updated_at', async () => {
        const user = {
            id: { $guid: cuid() },
            email: 'mendeljacks@gmail.com',
            password: 'password'
        }
        const mutation = {
            $operation: 'create',
            users: [user]
        }

        const mutate_response = await mutate_handler(mutation)

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

        expect(result?.users[0].created_at).to.be.a('string')
        expect(result?.users[0].updated_at).to.be.a('string')
    })
    test('Create a user nested', async () => {
        const user = {
            // id: { $guid: cuid() },
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890',
            user_has_roles: [
                {
                    // id: { $guid: cuid() },
                    roles: [
                        {
                            // id: { $guid: cuid() },
                            name: 'admin'
                        }
                    ]
                }
            ]
        }
        const mutation = {
            $operation: 'create',
            users: [user]
        }

        const mutate_response = await mutate_handler(mutation)
        expect(mutate_response.users.length).to.equal(1)
    })
})
