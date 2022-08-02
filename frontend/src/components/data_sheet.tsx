import { Typography } from '@mui/material'
import { action } from 'mobx'
import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'
import { Center } from '../sheet_builder_old/center'
import { store } from '../store'

export const DataSheet = () => {
    if (store.mutate.paste_grid.length === 0) {
        return (
            <Center>
                <Typography style={{ margin: '20px' }} variant='h5'>
                    Populate mutation to begin editing
                </Typography>
            </Center>
        )
    }
    return (
        <div
            style={{
                width: '400px',
                height: '50vh',
                display: 'grid',
                justifyContent: 'center',
                overflow: 'scroll'
            }}
        >
            <ReactDataSheet
                data={store.mutate.paste_grid as any}
                valueRenderer={(cell: any) => String(cell.value)}
                sheetRenderer={(props: any) => (
                    <table className={props.className + ' my-awesome-extra-class'}>
                        {/* <thead>
                            <tr>
                                <th className='action-cell' />
                                <th style={{ width: '200px' }}>Sku</th>
                                <th style={{ width: '100px' }}>Quantity</th>
                            </tr>
                        </thead> */}
                        <tbody>{props.children}</tbody>
                    </table>
                )}
                rowRenderer={(props: any) => (
                    <tr>
                        <td className='action-cell'>{props.row + 1}&nbsp;&nbsp;</td>
                        {props.children}
                    </tr>
                )}
                onCellsChanged={action((changes: any, additions: any) => {
                    const grid: any = store.mutate.paste_grid.map(row => [...row])
                    changes.forEach(({ cell, row, col, value }: any) => {
                        grid[row][col] = { ...grid[row][col], value }
                    })
                    additions?.forEach(({ cell, row, col, value }: any) => {
                        if (!grid[row]) grid[row] = []
                        grid[row][col] = { ...grid[row][col], value }
                    })
                    store.mutate.paste_grid = grid
                })}
            />
        </div>
    )
}
