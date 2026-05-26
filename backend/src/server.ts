import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from './routes'

export const main = async () => {
    const app = Fastify({ logger: true, bodyLimit: 50 * 1024 * 1024 })

    await app.register(cors, {
        origin: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['content-type', 'x-database-type', 'x-db-config']
    })

    routes.map(route => app.route(route as any))

    const port = Number(process.env.PORT ?? 3001)
    await app.listen({ port, host: '0.0.0.0' })
}
