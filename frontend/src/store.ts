import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { orma_query } from 'orma'
import type { OrmaSchema } from 'orma/build/types/schema/schema_types'
import { format } from 'sql-formatter'
import { orma_schema } from '../../common/orma_schema'
import { OrmaStatement } from 'orma'
import { AlertColor } from '@mui/material'
import ReactDataSheet from 'react-datasheet'
import { orma_mutate } from 'orma'
import { json_to_aoa } from 'yay_json'

const default_query = { users: { id: true, first_name: true, last_name: true } }
const default_mutation = {
    $operation: 'create',
    users: [{ email: 'user@example.com', first_name: 'John', last_name: 'Doe', password: 'password' }]
}

export const store = observable({
    tab: 'Connect' as 'Connect' | 'Query' | 'Mutate',
    introspect: {
        db: 'Postgres' as 'Postgres' | 'Mysql',
        pg: { connection_string: '', database: 'public' },
        mysql: {
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        },
        schema: orma_schema as unknown as OrmaSchema,
        schema_input_text: ''
    },
    query: {
        query_input_text: JSON.stringify(default_query, null, 2),
        query: default_query as any,
        response: '',
        sql_queries: ''
    },
    mutate: {
        sql_queries: '',
        paste_grid: [] as { value: '' }[][],
        mutation: default_mutation as any,
        mutation_input_text: JSON.stringify(default_mutation, null, 2),
        response: {}
    },
    toast: {
        toast_content: '',
        toast_severity: 'success' as AlertColor,
        toast_auto_hide_duration: 0,
        toast_is_open: false
    },
    shared: {
        token: ''
    }
})

export const reset_query_log = action((query: any, schema: any) => {
    store.query.sql_queries = ''
    if (!query || Object.keys(query).filter(k => !k.startsWith('$')).length === 0) return
    try {
        orma_query(query, schema, sqls => fake_sql_fn(sqls, store.query))
    } catch (e) {
        // ignore invalid query during editing
    }
})

const fake_sql_fn = async (sqls: any, query: any) => {
    const sql_strings = sqls
        .map((sql: OrmaStatement) => {
            return (
                format(sql.sql_string, {
                    language: 'postgresql',
                    tabWidth: 2,
                    keywordCase: 'upper',
                    linesBetweenQueries: 2
                }) + ';\n---------------------------------------\n'
            )
        })
        .join('\n')
    query.sql_queries += sql_strings
    return sqls.map((sql: any) => {
        if (sql.operation === 'query') {
            const rows = [
                sql.ast.$select.reduce((acc: any, val: string) => ((acc[val] = ''), acc), {})
            ]
            return rows
        }
        if (sql.operation === 'create') {
            const rows = sql.ast.$values.map((values: string[], i: number) => {
                return { id: i }
            }, {})

            return rows
        }
        return []
    })
}

export const reset_mutation_log = action((mutation: any, schema: any) => {
    store.mutate.sql_queries = ''
    if (!mutation || Object.keys(mutation).filter(k => !k.startsWith('$')).length === 0) return
    try {
        orma_mutate(mutation, sqls => fake_sql_fn(sqls, store.mutate), schema)
    } catch (e) {
        // ignore invalid mutation during editing
    }
})
// Exported action to sync schema text (called when schema changes externally, e.g. introspect)
export const sync_schema_text = action(() => {
    store.introspect.schema_input_text = JSON.stringify(toJS(store.introspect.schema), null, 2)
})

// Exported action to sync mutation paste grid from mutation object
export const sync_mutation_grid = action(() => {
    const mutation = toJS(store.mutate.mutation)
    const entityKeys = Object.keys(mutation).filter(k => !k.startsWith('$'))
    if (entityKeys.length === 0) {
        store.mutate.paste_grid = []
        return
    }
    // json_to_aoa expects a single-root object without $ keys
    const entityOnly: any = {}
    for (const k of entityKeys) entityOnly[k] = mutation[k]
    try {
        store.mutate.paste_grid = json_to_aoa(entityOnly).map(_ => _.map((x: any) => ({ value: x })))
    } catch (e) {
        store.mutate.paste_grid = []
    }
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS

// Text-only autoruns: sync query/mutation objects to their text editors
// These do NOT generate SQL — that stays manual via the convert buttons
autorun(() => {
    const query = toJS(store.query.query)
    const text = JSON.stringify(query, null, 2)
    runInAction(() => {
        store.query.query_input_text = text
    })
})

autorun(() => {
    const mutation = toJS(store.mutate.mutation)
    const text = JSON.stringify(mutation, null, 2)
    runInAction(() => {
        store.mutate.mutation_input_text = text
        // Also sync the paste grid so DataSheet reflects the current mutation
        const entityKeys = Object.keys(mutation).filter(k => !k.startsWith('$'))
        if (entityKeys.length === 0) {
            store.mutate.paste_grid = []
            return
        }
        const entityOnly: any = {}
        for (const k of entityKeys) entityOnly[k] = mutation[k]
        try {
            store.mutate.paste_grid = json_to_aoa(entityOnly).map(_ => _.map((x: any) => ({ value: x })))
        } catch (e) {
            store.mutate.paste_grid = []
        }
    })
})
