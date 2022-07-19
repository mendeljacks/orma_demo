import Editor, { Monaco } from '@monaco-editor/react'
import { Button, Card, TextField, Typography } from '@mui/material'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { orma_query } from '../helpers/api_helpers'
import { Center } from '../sheet_builder_old/center'
import { is_loading } from '../sheet_builder_old/is_loading'
import { QueryBuilder } from '../sheet_builder_old/query_builder'
import { store } from '../store'
import { try_parse_json } from '../try_parse_json'

export const QueryPage = observer(() => {
    return (
        <div>
            <Card
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr'
                }}
            >
                <Center>
                    <Typography>Visual Query</Typography>
                    <QueryBuilder path_array={[]} query={store.query.query} />
                </Center>

                <Center>
                    <Typography>Query Input Text</Typography>

                    <Editor
                        height='50vh'
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
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>

                <Center>
                    <Typography>SQL Query</Typography>
                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='sql'
                        value={store.query.sql_queries}
                        onChange={action(val => {
                            const json = try_parse_json(val || '', undefined)
                            if (json) {
                                store.introspect.schema = json
                            }
                            store.introspect.schema_input_text = val || ''
                        })}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>

                <Center>
                    <Button
                        variant='outlined'
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
                </Center>
                <Center>
                    <Typography>Response</Typography>
                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='json'
                        value={JSON.stringify(store.query.response, null, 2)}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>
            </Card>
        </div>
    )
})
