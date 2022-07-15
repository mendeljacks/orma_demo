import { Tab, Tabs, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'
import { IntrospectPage } from './sheet_builder/introspect_page'
import { MutatePage } from './sheet_builder/mutate_page'
import { QueryPage } from './sheet_builder/query_page'
import { Center } from './sheet_builder_old/center'
import { safe_path_or } from './sheet_builder_old/data_helpers'
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
        </Center>
    )
})

const commonTabProps = (str: string) => {
    return {
        value: str,
        label: str
    }
}
const commonTabGroupProps = (store: any, path: any) => {
    const primaryColor: 'primary' = 'primary'
    const variant: 'standard' = 'standard'
    return {
        value: safe_path_or('', path, store),
        onChange: action((_: any, new_val: any) => assoc_path_mutate(path, new_val, store)),
        variant,
        indicatorColor: primaryColor,
        textColor: primaryColor
    }
}
