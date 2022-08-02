import Editor from '@monaco-editor/react'
import { Button, Card, Typography } from '@mui/material'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { DataSheet } from '../components/data_sheet'
import { orma_mutate } from '../helpers/api_helpers'
import { Center } from '../sheet_builder_old/center'
import { is_loading } from '../sheet_builder_old/is_loading'
import { store } from '../store'
import { try_parse_json } from '../try_parse_json'

export const MutatePage = observer(() => {
    return (
        <div>
            <Card
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr'
                }}
            >
                <Center>
                    <DataSheet />
                </Center>
                <Center>
                    <Typography>JSON</Typography>

                    <Editor
                        height='50vh'
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
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>

                <Center>
                    <Typography>SQL</Typography>
                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='sql'
                        value={store.mutate.sql_queries}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                    <Button
                        variant='outlined'
                        onClick={action(async () => {
                            const response = await orma_mutate(store.mutate.mutation)
                            runInAction(() => {
                                store.query.response = response
                            })
                        })}
                    >
                        {is_loading(orma_mutate, [store.mutate.mutation])
                            ? 'Loading...'
                            : 'Execute Mutation'}
                    </Button>
                </Center>
                <Center>
                    <Typography>Response</Typography>
                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='json'
                        value={JSON.stringify(store.mutate.response, null, 2)}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>
            </Card>
        </div>
    )
})
