import { Tab, Tabs, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { Toasts } from './components/toasts'
import { commonTabGroupProps, commonTabProps } from './helpers/helpers'
import { IntrospectPage } from './pages/introspect_page'
import { MutatePage } from './pages/mutate_page'
import { QueryPage } from './pages/query_page'
import { Center } from './sheet_builder_old/center'
import { store } from './store'

export const App = observer(() => {
    return (
        <Center>
            <Typography variant={'h4'}>Orma Playground</Typography>

            <Tabs {...commonTabGroupProps(store, ['tab'])}>
                <Tab {...commonTabProps('Introspect')} />
                <Tab {...commonTabProps('Query')} />
                <Tab {...commonTabProps('Mutate')} />
            </Tabs>
            <div>
                {store.tab === 'Introspect' && <IntrospectPage />}
                {store.tab === 'Query' && <QueryPage />}
                {store.tab === 'Mutate' && <MutatePage />}
            </div>
            <Toasts />
        </Center>
    )
})
