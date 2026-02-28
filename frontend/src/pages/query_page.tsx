import Editor from '@monaco-editor/react'
import { Button, Typography } from '@mui/material'
import { action, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { sql_to_orma_query } from 'orma'
import { orma_query } from '../helpers/api_helpers'
import { is_loading } from '../sheet_builder_old/is_loading'
import { QueryBuilder } from '../sheet_builder_old/query_builder'
import { store, reset_query_log } from '../store'
import { styles } from '../theme'
import { try_parse_json } from '../try_parse_json'

const convert_json_to_sql = action(() => {
    const query = toJS(store.query.query)
    const schema = toJS(store.introspect.schema)
    reset_query_log(query, schema)
})

const convert_sql_to_json = action(() => {
    try {
        const sql = store.query.sql_queries
        const result = sql_to_orma_query(sql)
        store.query.query = result
    } catch (e: any) {
        // conversion may fail on partial SQL
    }
})

export const QueryPage = observer(() => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={styles.card as React.CSSProperties}>
                {/* Visual Query Builder */}
                <div style={{ ...styles.visualBuilderArea as React.CSSProperties, marginBottom: 24 }}>
                    <Typography style={styles.subLabel as React.CSSProperties}>Visual Query Builder</Typography>
                    <QueryBuilder path_array={[]} query={store.query.query} />
                </div>

                {/* Editors: Orma JSON ↔ SQL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                    {/* JSON Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={styles.subLabel as React.CSSProperties}>Orma JSON</Typography>
                        <div style={styles.editorWrapper as React.CSSProperties}>
                            <Editor
                                height='35vh'
                                width='100%'
                                defaultLanguage='json'
                                value={store.query.query_input_text}
                                onChange={action(val => {
                                    const json = try_parse_json(val || '', undefined)
                                    if (json) {
                                        store.query.query = json
                                    }
                                    store.query.query_input_text = val || ''
                                })}
                                theme='vs-dark'
                            />
                        </div>
                    </div>

                    {/* SQL Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={styles.subLabel as React.CSSProperties}>SQL</Typography>
                        <div style={styles.editorWrapper as React.CSSProperties}>
                            <Editor
                                height='35vh'
                                width='100%'
                                defaultLanguage='sql'
                                value={store.query.sql_queries}
                                onChange={action(val => {
                                    store.query.sql_queries = val || ''
                                })}
                                theme='vs-dark'
                            />
                        </div>
                    </div>
                </div>

                {/* Convert Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                    <Button
                        {...styles.secondaryButton}
                        onClick={convert_json_to_sql}
                    >
                        JSON → SQL
                    </Button>
                    <Button
                        {...styles.secondaryButton}
                        onClick={convert_sql_to_json}
                    >
                        SQL → JSON
                    </Button>
                </div>

                {/* Response */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>Response</Typography>
                        <Button
                            {...styles.primaryButton}
                            onClick={action(async () => {
                                const response = await orma_query(store.query.query)
                                runInAction(() => {
                                    store.query.response = response
                                })
                            })}
                        >
                            {is_loading(orma_query, [store.query.query])
                                ? 'Loading...'
                                : 'Execute Query'}
                        </Button>
                    </div>
                    <div style={styles.editorWrapper as React.CSSProperties}>
                        <Editor
                            height='25vh'
                            width='100%'
                            defaultLanguage='json'
                            value={JSON.stringify(store.query.response, null, 2)}
                            theme='vs-dark'
                            options={{ readOnly: true }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})
