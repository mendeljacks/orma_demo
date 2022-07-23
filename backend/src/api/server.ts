import cors from 'cors'
import express from 'express'
import { handler } from 'express_phandler'
import { get_pool_trans, introspect_handler, mutate_handler, query_handler } from '../config/orma'
import { introspect } from '../scripts/introspect'
import { login_user } from './login'

const port = process.env.PORT || 3001

export const start = async (env: 'production' | 'development') => {
    const app = express()
    await introspect(env)

    app.use(cors())
    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ extended: true, limit: '50mb' }))

    app.get(
        '/',
        handler(() => 'Welcome.')
    )
    app.post(
        '/login',
        handler((req, res) => {
            return login_user(req.body.email, req.body.password)
        })
    )

    app.post(
        '/query',
        handler(async (req, res) => {
            const { pool } = get_pool_trans(req.query)
            const results = await query_handler(req.body, pool)
            return results
        })
    )

    app.post(
        '/mutate',
        handler(async req => {
            const { pool, trans } = get_pool_trans(req.query)
            mutate_handler(req.body, pool, trans)
        })
    )

    app.post(
        '/introspect',
        handler(async req => {
            const { pool, db } = get_pool_trans(req.query)
            const result = await introspect_handler(db, pool, req.query.db_type)
            return result
        })
    )

    await new Promise(r => app.listen(port, r as any))
    console.log(`Listening at http://localhost:${port}`)
}

// Override default nodejs default uncaught exception behaviour
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
})

process.on('uncaughtException', e => {
    console.log(e)
    process.exit(1)
})

process.on('SIGINT', () => {
    console.log('Bye bye!')
    process.exit()
})
