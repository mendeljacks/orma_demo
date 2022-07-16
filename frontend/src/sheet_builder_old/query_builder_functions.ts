import { action } from 'mobx'
import { difference, dropLast, isNil, last, range } from 'ramda'
import { safe_path_or } from './data_helpers'
import { store } from '../store'
import {
    get_child_edges,
    get_entity_names,
    get_field_names,
    get_parent_edges,
    is_entity_name
} from 'orma/src/helpers/schema_helpers'
import { OrmaSchema } from 'orma/src/introspector/introspector'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'

// Clauses are categorized based on parameters they take, so that cluases in the same category can be swapped without changing anything else.
// This also helps categorize and talk about groups of clauses
const clause_types = {
    simple: ['$eq', '$lt', '$gt', '$lte', '$gte', '$like'],
    array: ['$in'],
    joined: ['$and', '$or'],
    nested: ['$any_path'],
    none: ['none']
} as const

// Given a path to some location in the query, returns the name of the closest parent table. I.e. if the path points to a subquery, it will return the table of that subquery,
// while if the path points to a nested clause (e.g. an 'any' clause), it will return the table name that is being searched on (first parameter of the nested clause)
export const query_path_to_entity_name = (path_array: any, query: any) => {
    let entity_name

    for (const i of range(0, path_array.length)) {
        const path_el = path_array[i]

        if (path_el === '$any_path') {
            const any_route_path = [...path_array.slice(0, i + 1), 0]
            const any_route = safe_path_or('', any_route_path, query)

            entity_name = last(any_route.split('.').filter((el: any) => el !== ''))
            continue
        }

        const path_el_is_table_name = is_entity_name(path_el, store.introspect.schema)
        if (path_el_is_table_name) {
            entity_name = path_el
            continue
        }
    }

    return entity_name
}

// this is of form clause_mappings[from_type][to_type] = (from_clause_object, new_clause_name) => new_clause_object
// This is used to convert clause types, for example when turning an eq into an and, we want to keep the eq as the first item in the and.
const clause_mappings = {
    simple: {
        array: (from_object: any, new_clause: any, old_clause: any) => {
            const array_elements: any = []
            if (!isNil(from_object[old_clause][1])) {
                array_elements.push(from_object[old_clause][1])
            }

            return {
                [new_clause]: [from_object[old_clause][0], array_elements]
            }
        },
        joined: (from_object: any, new_clause: any) => ({
            [new_clause]: [from_object]
        }),
        nested: (from_object: any, new_clause: any) => ({
            [new_clause]: ['', from_object]
        })
    },
    array: {
        // array -> simple is a lossy mapping
        simple: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => ({
            [new_clause]: [
                from_object[old_clause][0],
                safe_path_or(null, [old_clause, 1, 0], from_object)
            ]
        }),
        joined: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => ({
            [new_clause]: from_object[old_clause][1].map((el: any) => ({
                eq: [from_object[old_clause][0], el]
            }))
        }),
        nested: (from_object: any, new_clause: any) => ({
            [new_clause]: ['', from_object]
        })
    },
    joined: {
        nested: (from_object: any, new_clause: any, old_clause: any) => ({
            [new_clause]: ['', from_object]
        }),
        // joined -> none is a lossy mapping
        none: (from_object: { [x: string]: any[] }, new_clause: any, old_clause: string | number) =>
            from_object[old_clause][0]
    },
    nested: {
        joined: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => ({
            [new_clause]: [from_object[old_clause][1]]
        }),
        none: (from_object: { [x: string]: any[] }, new_clause: any, old_clause: string | number) =>
            from_object[old_clause][1]
    }
}

const get_clause_type = (clause_name: any) => {
    for (const clause_type of Object.keys(clause_types)) {
        // @ts-ignore
        if (clause_types[clause_type].includes(clause_name)) {
            return clause_type
        }
    }
}

// changes one clause into another, for example an eq clause into an and clause
export const switch_clause = action((path_to_clause: any, new_clause: string, query: any) => {
    const old_clause = last(path_to_clause)
    const path_to_clause_object = dropLast(1, path_to_clause)
    const old_clause_object = safe_path_or(undefined, path_to_clause_object, query)

    if (old_clause === new_clause) return

    const old_clause_type: any = get_clause_type(old_clause)
    const new_clause_type: any = get_clause_type(new_clause)

    const clause_mapping =
        old_clause_type === new_clause_type
            ? (from_object: { [x: string]: any }, new_clause: any) => ({
                  [new_clause]: from_object[old_clause]
              })
            : // @ts-ignore
              clause_mappings[old_clause_type][new_clause_type]

    const new_clause_object = clause_mapping(old_clause_object, new_clause, old_clause)
    assoc_path_mutate(path_to_clause_object, new_clause_object, query)
})

// gets a list of valid edge entities for a 'nested' clause type, for example an any clause.
// Some edge entities are invalid if they are not connected, or if they have already been used in this clause
export const get_nested_path_edge_tables = (path_to_nested_path: any[], query: any) => {
    const nested_path = safe_path_or(undefined, path_to_nested_path, query)
        .split('.')
        .filter((el: string) => el !== '')
    const path_to_any_object = dropLast(2, path_to_nested_path)

    const this_table_name = query_path_to_entity_name(path_to_any_object, query)
    const edges =
        nested_path.length === 0
            ? get_edges(this_table_name, store.introspect.schema)
            : get_edges(last(nested_path), store.introspect.schema)

    const edge_tables = edges
        .map(el => el.to_entity)
        .filter(entity_name => !nested_path.includes(entity_name))

    return edge_tables
}

export const delete_nested_path_element = action(
    (path_to_nested_path: any, element_index: any, query: any) => {
        const nested_path = safe_path_or(undefined, path_to_nested_path, query)
            .split('.')
            .filter((el: string) => el !== '')

        nested_path.splice(element_index, Infinity)

        assoc_path_mutate(path_to_nested_path, nested_path.join('.'), query)
    }
)

// gets a list of valid entity names that can be joined at a particular location in the query
export const get_possible_edge_entity_names = (
    path_to_subquery: any[],
    query: any,
    schema: any
) => {
    const this_entity_name = query_path_to_entity_name(path_to_subquery, query)

    if (!this_entity_name) {
        return get_entity_names(schema)
    }

    const subquery = safe_path_or(undefined, path_to_subquery, query)
    const existing_subquery_entity_names = Object.keys(subquery).filter(el =>
        is_entity_name(el, schema)
    )

    const edges = get_edges(this_entity_name, schema)
    const entity_names = edges
        .map(edge => edge.to_entity)
        .filter(entity_name => !existing_subquery_entity_names.includes(entity_name))

    return entity_names
}

export const get_select_fields = (path_to_select: any[], query: any, schema: any) => {
    const current_selects = safe_path_or([], path_to_select, query)
    const entity_name = query_path_to_entity_name(path_to_select, query)
    const all_field_names = get_field_names(entity_name, schema)
    const possible_field_names = difference(all_field_names, current_selects)

    return possible_field_names
}

const get_edges = (entity_name: string, schema: OrmaSchema) => {
    const parent_edges = get_parent_edges(entity_name, schema)
    const child_edges = get_child_edges(entity_name, schema)
    return [...parent_edges, ...child_edges]
}

export const get_order_by_field = (order_by: any): string => {
    return order_by?.$asc ?? order_by?.$desc
}

export const swap_order_by_type = (order_by: any) => {
    if (order_by.$asc !== undefined) {
        order_by.$desc = order_by.$asc
        delete order_by.$asc
    } else {
        order_by.$asc = order_by.$desc
        delete order_by.$desc
    }
}