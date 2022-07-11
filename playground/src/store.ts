import { autorun, observable, runInAction, toJS } from 'mobx'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { orma_schema } from '../../generated/orma_schema'

export const store = observable({
    query_input_text: '',
    schema_input_text: '',
    query: {},
    schema: orma_schema as unknown as OrmaSchema
})

autorun(() => {
    let query = store.query
    let schema = store.schema
    store.query_input_text = JSON.stringify(query, null, 2)
    store.schema_input_text = JSON.stringify(schema, null, 2)
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS
