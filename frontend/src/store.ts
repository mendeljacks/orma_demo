import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { orma_query } from 'orma/src/query/query'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { format } from 'sql-formatter'
import { orma_schema } from '../../common/orma_schema'
import { OrmaStatement } from 'orma'

export const store = observable({
    tab: 'Query' as 'Introspect' | 'Query' | 'Mutate',
    query_input_text: '',
    schema_input_text: '',
    query: {},
    schema: orma_schema as unknown as OrmaSchema,
    sql_queries: ''
})

const reset_query_log = action((query: any, schema: any) => {
    store.sql_queries = ''
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
        store.sql_queries += sql_strings
        return sqls.map(sql => {
            if (sql.operation === 'query') {
                const rows = [sql.ast.$select.reduce((acc, val) => ((acc[val] = ''), acc), {})]
                return rows
            }
            return []
        })
    })
})

autorun(() => {
    let query = toJS(store.query)
    let schema = toJS(store.schema)
    runInAction(() => {
        store.query_input_text = JSON.stringify(query, null, 2)
        store.schema_input_text = JSON.stringify(schema, null, 2)
        reset_query_log(query, schema)
    })
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS
