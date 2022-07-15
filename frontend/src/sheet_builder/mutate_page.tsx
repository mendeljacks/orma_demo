import Editor, { Monaco } from '@monaco-editor/react'
import { Button, Card, TextField, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Center } from '../sheet_builder_old/center'
import { QueryBuilder } from '../sheet_builder_old/query_builder'
import { store } from '../store'
import { try_parse_json } from '../try_parse_json'

export const MutatePage = observer(() => {
    return (
        <div>
            <Card
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr'
                }}
            >
                <Button>Create from Excel</Button>
                <Button>Update from Excel</Button>
                <Button>Create from JSON</Button>
                <Button>Update from JSON</Button>
            </Card>
        </div>
    )
})
