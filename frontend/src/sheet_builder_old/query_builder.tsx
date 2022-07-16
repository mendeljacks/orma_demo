import { Box, Chip, Grid, IconButton, ListSubheader, MenuItem, TextField } from '@mui/material'
import { action, observable, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { get_field_names, is_entity_name, is_field_name } from 'orma/src/helpers/schema_helpers'
import { get_select } from 'orma/src/query/macros/select_macro'
import { dropLast, last } from 'ramda'
import React from 'react'
import { MdAdd, MdChevronRight, MdClose } from 'react-icons/md'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'
import { store } from '../store'
import {
    assoc_append,
    assoc_key_name,
    assoc_splice,
    delete_or_splice,
    path_delete,
    safe_path_or
} from './data_helpers'
import { title_case } from './helpers'
import { MuiChipInput } from './mui_chip_input'
import {
    delete_nested_path_element,
    get_nested_path_edge_tables,
    get_possible_edge_entity_names,
    query_path_to_entity_name,
    switch_clause
} from './query_builder_functions'

const QueryBuilder_ = ({
    path_array = observable([]),
    query
}: {
    path_array: any[]
    query: any
}) => {
    return (
        <QueryObject>
            <QuerySubqueries path_array={path_array} query={query} />
            <QueryAddSubqueryButton
                path_array={path_array}
                query={query}
                // limit_to_one_subquery={true}
            />
        </QueryObject>
    )
}

export const QueryBuilder = observer(QueryBuilder_)

const Query = observer(
    ({ query, path_array = observable([]) }: { query: any; path_array: any }) => {
        return (
            <>
                <QueryObject>
                    <QuerySelect path_array={path_array} query={query} />
                    {path_array.length === 1 && (
                        <QueryPagination path_array={path_array} query={query} />
                    )}
                    <QueryWhere path_array={path_array} query={query} />
                    <QuerySubqueries path_array={path_array} query={query} />
                    <QueryAddSubqueryButton path_array={path_array} query={query} />
                </QueryObject>
            </>
        )
    }
)

const QueryObject = observer(({ children }: { children?: any }) => {
    return (
        <table>
            <tbody>
                {React.Children.map(children, (child, i) => (
                    <React.Fragment key={i}>
                        {i !== 0 && <tr style={{ height: '0px' }} />}
                        {child}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    )
})

const QueryKeyValue = observer(({ children }: { children: any }) => {
    return (
        <tr>
            <td style={{ verticalAlign: 'middle' }}>
                <Box marginRight={1}>{children[0]}</Box>
            </td>
            <td style={{ verticalAlign: 'middle' }}>
                <Box borderLeft='3px solid grey' paddingLeft={0.5}>
                    {children[1]}
                </Box>
            </td>
        </tr>
    )
})

const QueryArray = observer(({ children }: { children: any }) => {
    return (
        <>
            <Grid container direction='column'>
                {React.Children.map(children, (child, i) => (
                    <Grid item>
                        <Box
                            marginTop={i === 0 ? 0 : 1}
                            borderLeft='3px solid grey'
                            paddingLeft={1}
                        >
                            {child}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    )
})

const QuerySelect = observer(({ path_array, query }: { path_array: any; query: any }) => {
    const subquery = safe_path_or({} as any, path_array, query)
    const selects = get_select(subquery, path_array, store.introspect.schema).filter(
        el => typeof el === 'string'
    ) as string[]

    const possible_fields = get_field_names(last(path_array), store.introspect.schema)

    return (
        <QueryKeyValue>
            Select:
            <Grid container alignItems='center'>
                {selects.map((select: string, i: number) => (
                    <Grid item key={i}>
                        <Box paddingRight={1}>
                            <Chip
                                label={title_case(select)}
                                onDelete={action(e => {
                                    const val = safe_path_or({} as any, path_array, query)
                                    delete val[select]
                                    assoc_path_mutate(path_array, val, query)
                                })}
                            />
                        </Box>
                    </Grid>
                ))}
                <Grid item>
                    <TextField
                        select
                        value={''}
                        onChange={action(e => {
                            if (!e.target.value) return
                            assoc_path_mutate(
                                path_array,
                                {
                                    ...safe_path_or({} as any, path_array, query),
                                    [e.target.value]: true
                                },
                                query
                            )
                        })}
                        variant='outlined'
                        size='small'
                    >
                        {possible_fields.map((possible_field: any) => (
                            <MenuItem key={possible_field} value={possible_field}>
                                {title_case(possible_field)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        </QueryKeyValue>
    )
})

const QueryPagination = observer(({ path_array, query }: { path_array: any; query: any }) => {
    const limit_path = [...path_array, '$limit']
    const offset_path = [...path_array, '$offset']

    const limit = safe_path_or(undefined, limit_path, query)
    const offset = safe_path_or(undefined, offset_path, query)

    const limit_input = (
        <TextField
            value={limit ?? ''}
            onChange={action(e => {
                if (e.target.value === '') {
                    path_delete(query, limit_path)
                } else {
                    assoc_path_mutate(limit_path, e.target.value, query)
                }
            })}
            variant='outlined'
            label='Limit'
            style={{ width: '80px' }}
            type='number'
            size='small'
        />
    )

    const offset_input = (
        <TextField
            value={offset ?? ''}
            onChange={action(e => {
                if (e.target.value === '') {
                    path_delete(query, offset_path)
                } else {
                    assoc_path_mutate(offset_path, e.target.value, query)
                }
            })}
            variant='outlined'
            label='Offset'
            style={{ width: '80px' }}
            type='number'
            size='small'
        />
    )

    return (
        <QueryKeyValue>
            Pagination:
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div>{limit_input}</div>
                <div>{offset_input}</div>
            </div>
        </QueryKeyValue>
    )
})

export const QueryWhere = observer(({ path_array, query }: { path_array: any; query: any }) => {
    return (
        <QueryKeyValue>
            Where:
            <QueryWhereValue path_array={[...path_array, '$where']} query={query} />
        </QueryKeyValue>
    )
})

const default_where_clause = {
    $eq: ['id', { $escape: null }]
}

const QueryWhereValue = observer(
    ({ path_array, query }: { path_array?: any; query?: any }): any => {
        const where_value = safe_path_or(undefined, path_array, query)

        const add_where_button = (
            <IconButton
                style={{ border: '2px dashed grey', borderRadius: '0px' }}
                onClick={action((e: any) =>
                    assoc_path_mutate(path_array, default_where_clause, query)
                )}
                size='large'
            >
                <MdAdd />
            </IconButton>
        )

        if (where_value === undefined) {
            return add_where_button
        }

        const clause_type = Object.keys(where_value)[0]
        const clause_path = [...path_array, clause_type]

        if (['$eq', '$gt', '$lt', '$gte', '$lte', '$like'].includes(clause_type)) {
            return <QuerySimpleClause path_array={clause_path} query={query} />
        }

        // return <>Not implemented</>

        if (['$in'].includes(clause_type)) {
            return <QueryArrayClause path_array={clause_path} query={query} />
        }

        if (['$and', '$or'].includes(clause_type)) {
            return <QueryJoinedClause path_array={clause_path} query={query} />
        }

        if (['$any'].includes(clause_type)) {
            return <QueryNestedClause path_array={clause_path} query={query} />
        }

        return 'Not implemented'
    }
)

const QuerySimpleClause = observer(({ path_array, query }: { path_array: any; query: any }) => {
    return (
        <Grid container alignItems='center'>
            <Grid item>
                <Box paddingRight={1}>
                    <QueryClauseFieldSelect path_array={[...path_array, 0]} query={query} />
                </Box>
            </Grid>
            <Grid item>
                <Box paddingRight={1}>
                    <QueryClauseOperationSelect path_array={path_array} query={query} />
                </Box>
            </Grid>
            <Grid item>
                <QueryClauseValueEditor path_array={[...path_array, 1, '$escape']} query={query} />
            </Grid>
            <Grid item>
                <QueryClauseDeleteButton path_array={dropLast(1, path_array)} query={query} />
            </Grid>
        </Grid>
    )
})

const QueryArrayClause = observer(({ path_array, query }: { path_array: any; query: any }) => {
    return (
        <Grid container alignItems='center'>
            <Grid item>
                <Box paddingRight={1}>
                    <QueryClauseFieldSelect path_array={[...path_array, 0]} query={query} />
                </Box>
            </Grid>
            <Grid item>
                <Box paddingRight={1}>
                    <QueryClauseOperationSelect path_array={path_array} query={query} />
                </Box>
            </Grid>
            {/* <Grid item>
                <QueryClauseArrayEditor path_array={[...path_array, 1]} query={query} />
            </Grid> */}
            <Grid item>
                <BatchLineInput path_array={[...path_array, 1]} query={query} />
            </Grid>
            <Grid item>
                <QueryClauseDeleteButton path_array={dropLast(1, path_array)} query={query} />
            </Grid>
        </Grid>
    )
})

const BatchLineInput = observer(({ path_array, query }: { path_array: any; query: any }) => {
    return (
        <TextField
            value={safe_path_or([], path_array, query)
                .map((el: any) => el?.$escape)
                .join('\n')}
            onChange={action(e => {
                const val = e?.target?.value?.split('\n')?.map(el => ({ $escape: el }))
                return assoc_path_mutate(path_array, val, query)
            })}
            fullWidth
            variant='outlined'
            label='One value per line no commas'
            multiline
            style={{ margin: '10px' }}
            minRows={10}
            maxRows={50}
        />
    )
})

const QueryClauseFieldSelect = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        const entity_name = query_path_to_entity_name(path_array, query)
        const field_name = safe_path_or(undefined, path_array, query)

        return (
            <TextField
                select
                value={
                    is_field_name(entity_name, field_name, store.introspect.schema)
                        ? field_name
                        : ''
                }
                onChange={action(e => assoc_path_mutate(path_array, e.target.value, query))}
                variant='outlined'
                size='small'
            >
                {get_field_names(entity_name, store.introspect.schema).map(field_name => (
                    <MenuItem key={field_name} value={field_name}>
                        {title_case(field_name)}
                    </MenuItem>
                ))}
            </TextField>
        )
    }
)

const QueryClauseOperationSelect = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        const operation_name = last(path_array)

        return (
            <TextField
                select
                value={operation_name}
                onChange={e => {
                    if (!e.target.value) return
                    switch_clause(path_array, e.target.value, query)
                }}
                variant='outlined'
                size='small'
            >
                <ListSubheader>Operations</ListSubheader>
                <MenuItem value={'$eq'}>=</MenuItem>
                <MenuItem value={'$lt'}>&lt;</MenuItem>
                <MenuItem value={'$gt'}>&gt;</MenuItem>
                <MenuItem value={'$lte'}>&lt;=</MenuItem>
                <MenuItem value={'$gte'}>&gt;=</MenuItem>
                <MenuItem value={'$like'}>Like</MenuItem>
                <MenuItem value={'$in'}>In</MenuItem>
                <ListSubheader>Connectives</ListSubheader>
                <MenuItem value={'$and'}>And</MenuItem>
                <MenuItem value={'$or'}>Or</MenuItem>
                <MenuItem value={'$any_path'}>Any</MenuItem>
            </TextField>
        )
    }
)

const QueryClauseValueEditor = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        return (
            <TextField
                value={safe_path_or(undefined, path_array, query) ?? ''}
                onChange={action(e => {
                    const value = e.target.value === '' ? null : e.target.value
                    assoc_path_mutate(path_array, value, query)
                })}
                variant='outlined'
                helperText={safe_path_or(undefined, path_array, query) === null ? '' : undefined}
                size='small'
            />
        )
    }
)

const QueryClauseDeleteButton = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        return (
            <IconButton
                onClick={action((e: any) => {
                    delete_or_splice(path_array, query, false)
                })}
                size='large'
            >
                <MdClose style={{ color: 'rebeccapurple' }} fontSize='20' />
            </IconButton>
        )
    }
)

const QueryClauseArrayEditor = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        return (
            <>
                {/* @ts-ignore */}
                <MuiChipInput
                    value={toJS(safe_path_or([], path_array, query))}
                    onAdd={action((chip: any) => assoc_append(path_array, query, chip))}
                    onDelete={action((chip: any, chip_index: any) =>
                        assoc_splice([...path_array, chip_index], query, false)
                    )}
                />
            </>
        )
    }
)

const QueryJoinedClause = observer(({ path_array, query }: { path_array: any; query: any }) => {
    const joined_clause = safe_path_or(undefined, path_array, query)

    return (
        <QueryObject>
            <QueryKeyValue>
                <QueryJoinedClauseChooser path_array={path_array} query={query} />
                <QueryArray>
                    {joined_clause.map((clause: any, i: any) => (
                        <QueryWhereValue key={i} path_array={[...path_array, i]} query={query} />
                    ))}
                    <QueryJoinedClauseAddButton path_array={path_array} query={query} />
                </QueryArray>
            </QueryKeyValue>
        </QueryObject>
    )
})

const QueryJoinedClauseChooser = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        const operation_name = last(path_array)
        const subquery_count = safe_path_or(undefined, [...path_array, 1], query)?.length || 0

        return (
            <TextField
                select
                value={operation_name}
                onChange={e => {
                    if (!e.target.value) return
                    switch_clause(path_array, e.target.value, query)
                }}
                variant='outlined'
                size='small'
            >
                <MenuItem value={'none'} disabled={subquery_count > 1}>
                    <em>None</em> {subquery_count > 1 && <>&nbsp;(Delete terms to remove)</>}
                </MenuItem>
                <MenuItem value={'$and'}>And</MenuItem>
                <MenuItem value={'$or'}>Or</MenuItem>
                <MenuItem value={'$any'}>Any</MenuItem>
            </TextField>
        )
    }
)

const QueryJoinedClauseAddButton = observer(
    ({ path_array, query }: { path_array: any; query: any }) => {
        return (
            <IconButton
                style={{ border: '2px dashed grey', borderRadius: '0px' }}
                onClick={action((e: any) => assoc_append(path_array, query, default_where_clause))}
                size='large'
            >
                <MdAdd />
            </IconButton>
        )
    }
)

const QueryNestedClause = observer(({ path_array, query }: { path_array: any; query: any }) => {
    return (
        <QueryObject>
            <QueryKeyValue>
                <QueryJoinedClauseChooser path_array={path_array} query={query} />
                <>
                    <QueryArray>
                        <QueryNestedPath path_array={[...path_array, 0]} query={query} />
                        <QueryWhereValue path_array={[...path_array, 1]} query={query} />
                    </QueryArray>
                </>
            </QueryKeyValue>
        </QueryObject>
    )
})

const QueryNestedPath = observer(({ path_array, query }: { path_array: any; query: any }) => {
    const nested_path = safe_path_or(undefined, path_array, query)
        .split('.')
        .filter((el: any) => el !== '')
    const edge_tables = get_nested_path_edge_tables(path_array, query)

    return (
        <>
            <Grid container alignItems='center'>
                {nested_path.map((table_name: string, i: number) => (
                    <React.Fragment key={i}>
                        <Grid item>
                            <Box paddingRight={1}>
                                <Chip
                                    label={title_case(table_name)}
                                    onDelete={e => delete_nested_path_element(path_array, i, query)}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box paddingRight={1}>
                                <MdChevronRight fontSize='large' />
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}
                <Grid item>
                    <TextField
                        select
                        value={''}
                        onChange={action(e => {
                            const new_nested_path = [...nested_path, e.target.value]
                            assoc_path_mutate(path_array, new_nested_path.join('.'), query)
                        })}
                        variant='outlined'
                        size='small'
                    >
                        {edge_tables.map((entity_name_option: any) => (
                            <MenuItem key={entity_name_option} value={entity_name_option}>
                                {title_case(entity_name_option)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        </>
    )
})

const QuerySubqueries = observer(({ path_array, query }: { path_array: any; query: any }): any => {
    const query_object = safe_path_or(undefined, path_array, query)
    const child_entities = Object.keys(query_object).filter(key =>
        is_entity_name(key, store.introspect.schema)
    )

    return child_entities.map((child_entity, i) => (
        <QuerySubquery path_array={[...path_array, child_entity]} query={query} key={i} />
    ))
})

const QuerySubquery = observer(({ path_array, query }: { path_array: any; query: any }) => {
    let possible_edge_entity_names = get_possible_edge_entity_names(
        dropLast(1, path_array),
        query,
        store.introspect.schema
    )
    const current_table = last(path_array)
    if (current_table && !possible_edge_entity_names.includes(current_table)) {
        possible_edge_entity_names.push(current_table)
    }

    return (
        <QueryKeyValue>
            <TextField
                select
                value={last(path_array) ?? ''}
                onChange={action(e => {
                    if (!e.target.value) return
                    if (e.target.value === 'none') {
                        path_delete(query, path_array)
                    } else {
                        assoc_key_name(path_array, e.target.value, query)
                    }
                })}
                variant='outlined'
                size='small'
            >
                <MenuItem value='none'>
                    <em>None (will delete subquery)</em>
                </MenuItem>
                {possible_edge_entity_names.map((entity_name_option: any) => (
                    <MenuItem key={entity_name_option} value={entity_name_option}>
                        {title_case(entity_name_option)}
                    </MenuItem>
                ))}
            </TextField>
            <Query path_array={path_array} query={query} />
        </QueryKeyValue>
    )
})

const QueryAddSubqueryButton = observer(
    ({
        path_array,
        query
    }: // limit_to_one_subquery = false
    {
        path_array: any
        query: any
        // limit_to_one_subquery?: boolean
    }) => {
        const possible_edge_entity_names = get_possible_edge_entity_names(
            path_array,
            query,
            store.introspect.schema
        )

        // if (limit_to_one_subquery) {
        //     const query_object = safe_path_or(undefined, path_array, query)
        //     const child_entities = Object.keys(query_object).filter(key =>
        //         is_entity_name(key, store.introspect.schema)
        //     )
        //     if (child_entities.length >= 1) {
        //         return null
        //     }
        // }

        return possible_edge_entity_names.length > 0 ? (
            <tr>
                <td>
                    <IconButton
                        style={{
                            border: '2px dashed grey',
                            borderRadius: '0px'
                        }}
                        onClick={action((e: any) =>
                            assoc_path_mutate(
                                [...path_array, possible_edge_entity_names[0]],
                                {},
                                query
                            )
                        )}
                        size='large'
                    >
                        <MdAdd />
                    </IconButton>
                </td>
            </tr>
        ) : null
    }
)
