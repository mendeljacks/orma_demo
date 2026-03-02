import Editor from '@monaco-editor/react'
import { Button, Typography } from '@mui/material'
import { action, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { sql_to_orma_mutation } from 'orma'
import { DataSheet } from '../components/data_sheet'
import { orma_mutate } from '../helpers/api_helpers'
import { is_loading } from '../helpers/is_loading'
import { store, reset_mutation_log } from '../store'
import { styles } from '../theme'
import { try_parse_json } from '../try_parse_json'

const convert_json_to_sql = action(() => {
    const mutation = toJS(store.mutate.mutation)
    const schema = toJS(store.introspect.schema)
    reset_mutation_log(mutation, schema)
})

const convert_sql_to_json = action(() => {
    try {
        const sql = store.mutate.sql_queries
        const result = sql_to_orma_mutation(sql)
        store.mutate.mutation = result
    } catch (e: any) {
        // conversion may fail on partial SQL
    }
})

export const MutatePage = observer(() => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={styles.card as React.CSSProperties}>
                {/* Data Sheet */}
                <div style={{ ...styles.visualBuilderArea as React.CSSProperties, marginBottom: 24 }}>
                    <Typography style={styles.subLabel as React.CSSProperties}>Data Sheet</Typography>
                    <DataSheet />
                </div>

                {/* Editors: Mutation JSON ↔ SQL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                    {/* JSON Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography style={styles.subLabel as React.CSSProperties}>Mutation JSON</Typography>
                        <div style={styles.editorWrapper as React.CSSProperties}>
                            <Editor
                                height='35vh'
                                width='100%'
                                defaultLanguage='json'
                                value={store.mutate.mutation_input_text}
                                onChange={action(val => {
                                    const json = try_parse_json(val || '', undefined)
                                    if (json) {
                                        store.mutate.mutation = json
                                    }
                                    store.mutate.mutation_input_text = val || ''
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
                                value={store.mutate.sql_queries}
                                onChange={action(val => {
                                    store.mutate.sql_queries = val || ''
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
                                const response = await orma_mutate(store.mutate.mutation)
                                runInAction(() => {
                                    store.mutate.response = response
                                })
                            })}
                        >
                            {is_loading(orma_mutate, [store.mutate.mutation])
                                ? 'Loading...'
                                : 'Execute Mutation'}
                        </Button>
                    </div>
                    <div style={styles.editorWrapper as React.CSSProperties}>
                        <Editor
                            height='25vh'
                            width='100%'
                            defaultLanguage='json'
                            value={JSON.stringify(store.mutate.response, null, 2)}
                            theme='vs-dark'
                            options={{ readOnly: true }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})
