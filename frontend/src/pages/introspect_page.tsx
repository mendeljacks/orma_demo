import Editor from '@monaco-editor/react'
import { Button, CircularProgress, Tab, Tabs, TextField, Typography } from '@mui/material'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
// @ts-ignore
import mysql from '../assets/mysql.png'
// @ts-ignore
import postgres from '../assets/postgres.png'
import { orma_introspect } from '../helpers/api_helpers'
import { commonTabGroupProps } from '../helpers/helpers'
import { is_loading } from '../helpers/is_loading'
import { store, sync_schema_text } from '../store'
import { styles } from '../theme'
import { try_parse_json } from '../try_parse_json'

export const IntrospectPage = observer(() => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Database Connection */}
            <div style={styles.card as React.CSSProperties}>
                <Typography style={styles.sectionHeader as React.CSSProperties}>Database Connection</Typography>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                    <Tabs 
                        {...commonTabGroupProps(store.introspect, ['db'])}
                        TabIndicatorProps={{ style: styles.tabIndicator }}
                    >
                        <Tab value='Mysql' label={<img width='80px' src={mysql} alt="MySQL" />} style={{ padding: '12px 24px' }} />
                        <Tab value='Postgres' label={<img width='50px' src={postgres} alt="Postgres" />} style={{ padding: '12px 24px' }} />
                    </Tabs>
                    
                    <div style={{ width: '100%', maxWidth: '800px' }}>
                        {store.introspect.db === 'Mysql' && <MysqlAuth />}
                        {store.introspect.db === 'Postgres' && <PostgresAuth />}
                    </div>

                    <Button
                        {...styles.primaryButton}
                        onClick={action(async () => {
                            const result = await orma_introspect()
                            runInAction(() => {
                                store.introspect.schema = result
                                sync_schema_text()
                            })
                        })}
                        style={{ minWidth: 120 }}
                    >
                        {is_loading(orma_introspect, []) ? <CircularProgress size={20} color="inherit" /> : 'Introspect'}
                    </Button>
                </div>
            </div>

            {/* Orma Schema */}
            <div style={styles.card as React.CSSProperties}>
                <Typography style={styles.sectionHeader as React.CSSProperties}>Orma Schema</Typography>
                <div style={styles.editorWrapper as React.CSSProperties}>
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
                        theme='vs-dark'
                    />
                </div>
            </div>
        </div>
    )
})

const PostgresAuth = observer(() => {
    return (
        <div style={{ width: '100%' }}>
            <Typography style={styles.subLabel as React.CSSProperties}>Postgres Connection String</Typography>
            <TextField
                fullWidth
                size="small"
                variant="outlined"
                onChange={action(e => (store.introspect.pg.connection_string = e.target.value))}
                value={store.introspect.pg.connection_string}
                placeholder="postgresql://user:password@localhost:5432/dbname"
            />
        </div>
    )
})

const MysqlAuth = observer(() => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px 24px', alignItems: 'center' }}>
            <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>Host</Typography>
            <TextField
                fullWidth
                size="small"
                onChange={action(e => (store.introspect.mysql.host = e.target.value))}
                value={store.introspect.mysql.host}
            />
            
            <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>Port</Typography>
            <TextField
                fullWidth
                size="small"
                onChange={action(e => (store.introspect.mysql.port = e.target.value))}
                value={store.introspect.mysql.port}
            />
            
            <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>User</Typography>
            <TextField
                fullWidth
                size="small"
                onChange={action(e => (store.introspect.mysql.user = e.target.value))}
                value={store.introspect.mysql.user}
            />
            
            <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>Password</Typography>
            <TextField
                fullWidth
                size="small"
                type='password'
                onChange={action(e => (store.introspect.mysql.password = e.target.value))}
                value={store.introspect.mysql.password}
            />

            <Typography style={{ ...styles.subLabel as React.CSSProperties, marginBottom: 0 }}>Database</Typography>
            <TextField
                fullWidth
                size="small"
                onChange={action(e => (store.introspect.mysql.database = e.target.value))}
                value={store.introspect.mysql.database}
            />
        </div>
    )
})
