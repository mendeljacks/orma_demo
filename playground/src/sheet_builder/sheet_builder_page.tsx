import Editor, { Monaco } from '@monaco-editor/react'
import { Card, TextField, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Center } from '../sheet_builder_old/center'
import { QueryBuilder } from '../sheet_builder_old/query_builder'
import { store } from '../store'
import { try_parse_json } from '../try_parse_json'

export const SheetBuilderPage = observer(() => {
    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
                height: '100vh'
            }}
        >
            <Typography variant={'h4'}>Orma Playground</Typography>
            <Card
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr'
                }}
            >
                <Center>
                    <Typography>Visual Query</Typography>
                    <QueryBuilder path_array={[]} query={store.query} />
                </Center>

                <Center>
                    <Typography>Query Input Text</Typography>

                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='json'
                        value={store.query_input_text}
                        onChange={action(val => {
                            const json = try_parse_json(val || '', undefined)
                            if (json) {
                                store.query = json
                            }
                            store.query_input_text = val || ''
                        })}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>
                <Center>
                    <Typography>Orma Schema</Typography>

                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='json'
                        value={store.schema_input_text}
                        onChange={action(val => {
                            const json = try_parse_json(val || '', undefined)
                            if (json) {
                                store.schema = json
                            }
                            store.schema_input_text = val || ''
                        })}
                        theme={true ? 'vs-light' : 'vs-dark'}
                    />
                </Center>
                <Center>
                    <Typography>SQL Query</Typography>
                    <TextField multiline minRows={10} maxRows={10} />
                </Center>
            </Card>
        </div>
    )
})
