import cors from 'cors'
import express from 'express'
import { handler } from 'express_phandler'
import { orma_query } from 'orma'
import { orma_schema } from '../../generated/orma_schema'
import { byo_query_fn } from '../config/orma'
import { introspect } from '../scripts/introspect'
import { login_user } from './login'

const port = process.env.PORT || 2000

export const start = async (env: 'production' | 'development') => {
    const app = express()
    // await introspect(env)

    app.use(cors())
    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ extended: true, limit: '50mb' }))

    app.post(
        '/login',
        handler((req, res) => {
            return login_user(req.body.email, req.body.password)
        })
    )

    app.post(
        '/query',
        handler(async (req, res) => {
            const results = await orma_query(req.body, orma_schema, byo_query_fn)
            return results
        })
    )

    // app.post(
    //     '/mutate',
    //     handler(async req => mutateHandler(req.body, orma_schema))
    // )

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
