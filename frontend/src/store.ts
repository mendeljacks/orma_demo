import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { orma_query } from 'orma/src/query/query'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { format } from 'sql-formatter'
import { orma_schema } from '../../common/orma_schema'
import { OrmaStatement } from 'orma'
import { AlertColor } from '@mui/material'
import ReactDataSheet from 'react-datasheet'
import { orma_mutate } from 'orma/src/mutate/mutate'
import { json_to_aoa } from 'yay_json'

export const store = observable({
    tab: 'Mutate' as 'Introspect' | 'Query' | 'Mutate',
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
        query_input_text: '',
        query: {},
        response: '',
        sql_queries: ''
    },
    mutate: {
        sql_queries: '',
        paste_grid: [] as { value: '' }[][],
        mutation: {},
        mutation_input_text: '',
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

const reset_query_log = action((query: any, schema: any) => {
    store.query.sql_queries = ''
    orma_query(query, schema, sqls => fake_sql_fn(sqls, query))
})

const fake_sql_fn = async (sqls: any, query: any) => {
    const sql_strings = sqls
        .map((sql: OrmaStatement) => {
            return (
                format(sql.sql_string, {
                    language: 'spark',
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

const reset_mutation_log = action((mutation: any, schema: any) => {
    store.mutate.sql_queries = ''
    orma_mutate(mutation, sqls => fake_sql_fn(sqls, store.mutate), schema)
})
// When query or schema changes, automatically update the text input versions
autorun(() => {
    let query = toJS(store.query.query)
    let schema = toJS(store.introspect.schema)
    runInAction(() => {
        store.query.query_input_text = JSON.stringify(query, null, 2)
        store.introspect.schema_input_text = JSON.stringify(schema, null, 2)
        reset_query_log(query, schema)
    })
})

// When mutation changes, automatically update the text version
autorun(() => {
    let mutation = toJS(store.mutate.mutation)
    let schema = toJS(store.introspect.schema)
    runInAction(() => {
        store.mutate.mutation_input_text = JSON.stringify(mutation, null, 2)
        store.mutate.paste_grid = json_to_aoa(mutation).map(_ => _.map((x: any) => ({ value: x })))
        reset_mutation_log(store.mutate.mutation, schema)
    })
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS
