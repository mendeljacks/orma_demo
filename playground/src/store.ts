import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { orma_query } from 'orma/src/query/query'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { orma_schema } from '../../generated/orma_schema'
import { format } from 'sql-formatter'

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
    orma_query(query, schema, async (sqls: any[]) => {
        sqls.map(sql => {
            store.sql_queries +=
                format(sql, {
                    language: 'spark',
                    tabWidth: 2,
                    keywordCase: 'upper',
                    linesBetweenQueries: 2
                }) + ';\n\n'
        })
        return []
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
