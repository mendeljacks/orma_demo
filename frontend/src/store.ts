import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { orma_query } from 'orma/src/query/query'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { format } from 'sql-formatter'
import { orma_schema } from '../../common/orma_schema'
import { OrmaStatement } from 'orma'
import { AlertColor } from '@mui/material'

export const store = observable({
    tab: 'Query' as 'Introspect' | 'Query' | 'Mutate',
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
    mutate: {},
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
    orma_query(query, schema, async sqls => {
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
        store.query.sql_queries += sql_strings
        return sqls.map(sql => {
            if (sql.operation === 'query') {
                const rows = [
                    sql.ast.$select.reduce((acc: any, val: string) => ((acc[val] = ''), acc), {})
                ]
                return rows
            }
            return []
        })
    })
})

autorun(() => {
    let query = toJS(store.query.query)
    let schema = toJS(store.introspect.schema)
    runInAction(() => {
        store.query.query_input_text = JSON.stringify(query, null, 2)
        store.introspect.schema_input_text = JSON.stringify(schema, null, 2)
        reset_query_log(query, schema)
    })
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS
