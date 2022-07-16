import Editor from '@monaco-editor/react'
import { Button, Card, Tab, Tabs, TextField, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { commonTabGroupProps, commonTabProps } from '../helpers/helpers'
import { Center } from '../sheet_builder_old/center'
import { store } from '../store'
import { try_parse_json } from '../try_parse_json'
import { MutatePage } from './mutate_page'
import { QueryPage } from './query_page'
// @ts-ignore
import mysql from '../assets/mysql.png'
// @ts-ignore
import postgres from '../assets/postgres.png'

export const IntrospectPage = observer(() => {
    return (
        <div>
            <Card
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr'
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateRows: '100px auto 100px',
                        placeItems: 'center'
                    }}
                >
                    <Tabs {...commonTabGroupProps(store.introspect, ['db'])}>
                        <Tab value='Mysql' label={<img width='100px' src={mysql} />} />
                        <Tab value='Postgres' label={<img width='60px' src={postgres} />} />
                    </Tabs>
                    <Center>
                        {store.introspect.db === 'Mysql' && <MysqlAuth />}
                        {store.introspect.db === 'Postgres' && <PostgresAuth />}
                    </Center>
                    <Button variant='outlined'>Introspect Database</Button>
                </div>
                <Center>
                    <Typography>Orma Schema</Typography>

                    <Editor
                        height='50vh'
                        width='100%'
                        defaultLanguage='json'
                        value={store.introspect.schema_input_text}
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
            </Card>
        </div>
    )
})

const PostgresAuth = observer(() => {
    return (
        <div>
            <Typography>Pg Connection String</Typography>
            <TextField
                style={{ width: '800px' }}
                onChange={action(e => (store.introspect.pg_connection_string = e.target.value))}
                value={store.introspect.pg_connection_string}
            />
        </div>
    )
})

const MysqlAuth = observer(() => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', placeItems: 'center' }}>
            <Typography>Host</Typography>
            <TextField
                onChange={action(e => (store.introspect.mysql.host = e.target.value))}
                value={store.introspect.mysql.host}
            />
            <Typography>Password</Typography>
            <TextField
                type='password'
                onChange={action(e => (store.introspect.mysql.password = e.target.value))}
                value={store.introspect.mysql.password}
            />
            <Typography>Port</Typography>
            <TextField
                onChange={action(e => (store.introspect.mysql.port = e.target.value))}
                value={store.introspect.mysql.port}
            />
            <Typography>User</Typography>
            <TextField
                onChange={action(e => (store.introspect.mysql.user = e.target.value))}
                value={store.introspect.mysql.user}
            />
            <Typography>Database</Typography>
            <TextField
                onChange={action(e => (store.introspect.mysql.database = e.target.value))}
                value={store.introspect.mysql.database}
            />
        </div>
    )
})
