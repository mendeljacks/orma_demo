import { expect } from 'chai'
import cuid from 'cuid'
import { describe, test } from 'mocha'
import { mutate_handler, query_handler } from '../config/orma'

describe('Crud Orma', () => {
    test('Create a user', async () => {
        const body = {
            users: {
                id: true,
                email: true,
                password: true,
                first_name: true,
                last_name: true,
                phone: true
                // created_at: true
                // updated_at: true
            }
        }

        const result: any = await query_handler(body)
        if (result?.users.length) {
            await mutate_handler({ $operation: 'delete', users: result?.users })
        }

        const user = {
            id: { $guid: cuid() },
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890'
            // user_has_roles: [
            //     {
            //         id: { $guid: 2 },
            //         roles: [
            //             {
            //                 id: { $guid: 3 },
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
    })
    test('Create a user select created_at updated_at', async () => {
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
            id: { $guid: cuid() },
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890'
            // user_has_roles: [
            //     {
            //         id: { $guid: 2 },
            //         roles: [
            //             {
            //                 id: { $guid: 3 },
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
    })
    test('Create a user nested', async () => {
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
            id: { $guid: cuid() },
            email: 'mendeljacks@gmail.com',
            password: 'password',
            first_name: 'Mendel',
            last_name: 'Jackson',
            phone: '1234567890',
            user_has_roles: [
                {
                    id: { $guid: cuid() },
                    roles: [
                        {
                            id: { $guid: cuid() },
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
    })
})
