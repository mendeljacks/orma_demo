import { QueryBuilder } from './sheet_builder/query_builder'
import { store } from './store'

export const App = () => {
    return (
        <span>
            <QueryBuilder path_array={[]} query={store.query} />
        </span>
    )
}
