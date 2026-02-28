import { Tab, Tabs, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { Toasts } from './components/toasts'
import { commonTabGroupProps, commonTabProps } from './helpers/helpers'
import { IntrospectPage } from './pages/introspect_page'
import { MutatePage } from './pages/mutate_page'
import { QueryPage } from './pages/query_page'
import { store } from './store'
import { styles } from './theme'

export const App = observer(() => {
    return (
        <div style={styles.pageWrapper as React.CSSProperties}>
            <div style={styles.header as React.CSSProperties}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography style={styles.title as React.CSSProperties}>Orma Playground</Typography>
                        
                        <Tabs 
                            {...commonTabGroupProps(store, ['tab'])} 
                            TabIndicatorProps={{ style: styles.tabIndicator }}
                            sx={{ minHeight: 40 }}
                        >
                            <Tab {...commonTabProps('Connect')} style={styles.tabLabel} />
                            <Tab {...commonTabProps('Query')} style={styles.tabLabel} />
                            <Tab {...commonTabProps('Mutate')} style={styles.tabLabel} />
                        </Tabs>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', width: '100%' }}>
                {store.tab === 'Connect' && <IntrospectPage />}
                {store.tab === 'Query' && <QueryPage />}
                {store.tab === 'Mutate' && <MutatePage />}
            </div>
            
            <Toasts />
        </div>
    )
})
