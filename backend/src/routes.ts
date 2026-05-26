import { FastifyRequest } from 'fastify'
import { mutate_handler, query_handler } from 'biab/src/config/orma'
import { resolve_db } from './db'

const noop = () => {}

export const routes = [
    { method: 'GET', url: '/', handler: async () => ({ ok: true }) },
    { method: 'GET', url: '/health', handler: async () => 'ok' },

    {
        method: 'POST',
        url: '/introspect',
        handler: async (req: FastifyRequest) => {
            const db = await resolve_db(req.headers as Record<string, any>)
            return db.refresh_schema()
        }
    },
    {
        method: 'POST',
        url: '/query',
        handler: async (req: FastifyRequest) => {
            const db = await resolve_db(req.headers as Record<string, any>)
            const schema = await db.get_schema()
            return query_handler(req.body, schema, db.db_adapter(db.pool), [] as any)
        }
    },
    {
        method: 'POST',
        url: '/mutate',
        handler: async (req: FastifyRequest) => {
            const db = await resolve_db(req.headers as Record<string, any>)
            const schema = await db.get_schema()
            return mutate_handler(req.body, db.pool, schema, db.db_adapter, db.trans, noop)
        }
    }
] as const
