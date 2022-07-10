import { action } from 'mobx'
import { difference, dropLast, isNil, last, range } from 'ramda'
import { assoc_path_mutate } from './helpers'
import { get_edges, get_entity_names, get_field_names, is_entity_name } from './traversal'
import { safe_path_or } from './data_helpers'
import { store } from '../store'

// Clauses are categorized based on parameters they take, so that cluases in the same category can be swapped without changing anything else.
// This also helps categorize and talk about groups of clauses
const clause_types = {
    simple: ['eq', 'lt', 'gt', 'lte', 'gte', 'like'],
    array: ['in'],
    joined: ['and', 'or'],
    nested: ['any'],
    none: ['none']
} as const

// Given a path to some location in the query, returns the name of the closest parent table. I.e. if the path points to a subquery, it will return the table of that subquery,
// while if the path points to a nested clause (e.g. an 'any' clause), it will return the table name that is being searched on (first parameter of the nested clause)
export const query_path_to_entity_name = (path_array: any, query: any) => {
    let entity_name

    for (const i of range(0, path_array.length)) {
        const path_el = path_array[i]

        if (path_el === 'any') {
            const any_route_path = [...path_array.slice(0, i + 1), 0]
            const any_route = safe_path_or('', any_route_path, query)

            entity_name = last(any_route.split('.').filter((el: any) => el !== ''))
            continue
        }

        const path_el_is_table_name = is_entity_name(path_el, store.schema)
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
export const get_nested_path_edge_tables = (
    path_to_nested_path: readonly unknown[],
    query: any
) => {
    const nested_path = safe_path_or(undefined, path_to_nested_path, query)
        .split('.')
        .filter((el: string) => el !== '')
    const path_to_any_object = dropLast(2, path_to_nested_path)

    const this_table_name = query_path_to_entity_name(path_to_any_object, query)
    const edges =
        nested_path.length === 0
            ? get_edges(this_table_name, store.schema)
            : get_edges(last(nested_path), store.schema)

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
    path_to_subquery: unknown[],
    query: any,
    company_schema: {
        migrations: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly character_count: 64
                readonly default: 'unique_rowid()'
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 255
            }
            readonly run_on: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                }
            ]
        }
        users: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.users_id_seq'::REGCLASS)"
            }
            readonly email: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly password: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly first_name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 4
                readonly character_count: 10485760
            }
            readonly last_name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly character_count: 10485760
            }
            readonly phone: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly character_count: 10485760
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 7
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 8
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 9
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_email_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['email']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_phone_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['phone']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        roles: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.roles_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'roles_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'roles_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        user_has_roles: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.user_has_roles_id_seq'::REGCLASS)"
            }
            readonly user_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly users: { readonly id: {} } }
            }
            readonly role_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 64 // gets a list of valid edge entities for a 'nested' clause type, for example an any clause.
                // Some edge entities are invalid if they are not connected, or if they have already been used in this clause
                readonly references: { readonly roles: { readonly id: {} } }
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'user_has_roles_user_id_role_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['role_id', 'user_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'user_has_roles_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        permissions: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.permissions_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'permissions_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'permissions_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                }
            ]
        }
        role_has_permissions: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.role_has_permissions_id_seq'::REGCLASS)"
            }
            readonly role_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly roles: { readonly id: {} } }
            }
            readonly permission_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly permissions: { readonly id: {} } }
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'role_has_permissions_role_id_permission_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['permission_id', 'role_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'role_has_permissions_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        groups: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.groups_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'groups_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'groups_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
    }
) => {
    const this_entity_name = query_path_to_entity_name(path_to_subquery, query)

    if (!this_entity_name) {
        return get_entity_names(company_schema)
    }

    const subquery = safe_path_or(undefined, path_to_subquery, query)
    const existing_subquery_entity_names = Object.keys(subquery).filter(el =>
        is_entity_name(el, company_schema)
    )

    const edges = get_edges(this_entity_name, company_schema)
    const entity_names = edges
        .map(edge => edge.to_entity)
        .filter(entity_name => !existing_subquery_entity_names.includes(entity_name))

    return entity_names
}

export const get_select_fields = (
    path_to_select: any[],
    query: any,
    company_schema: {
        readonly migrations: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly character_count: 64
                readonly default: 'unique_rowid()'
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 255
            }
            readonly run_on: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                }
            ]
        } // Given a path to some location in the query, returns the name of the closest parent table. I.e. if the path points to a subquery, it will return the table of that subquery,
        // while if the path points to a nested clause (e.g. an 'any' clause), it will return the table name that is being searched on (first parameter of the nested clause)
        readonly users: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.users_id_seq'::REGCLASS)"
            }
            readonly email: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly password: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly first_name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 4
                readonly character_count: 10485760
            }
            readonly last_name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly character_count: 10485760
            }
            readonly phone: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly character_count: 10485760
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 7
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 8
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 9
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_email_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['email']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_phone_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['phone']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'users_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        readonly roles: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.roles_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'roles_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'roles_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        readonly user_has_roles: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.user_has_roles_id_seq'::REGCLASS)"
            }
            readonly user_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly users: { readonly id: {} } }
            }
            readonly role_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 64 // gets a list of valid edge entities for a 'nested' clause type, for example an any clause.
                // Some edge entities are invalid if they are not connected, or if they have already been used in this clause
                readonly references: { readonly roles: { readonly id: {} } }
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'user_has_roles_user_id_role_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['role_id', 'user_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'user_has_roles_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        readonly permissions: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.permissions_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 2
                readonly not_null: true
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'permissions_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'permissions_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                }
            ]
        }
        readonly role_has_permissions: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.role_has_permissions_id_seq'::REGCLASS)"
            }
            readonly role_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly roles: { readonly id: {} } }
            }
            readonly permission_id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly character_count: 64
                readonly references: { readonly permissions: { readonly id: {} } }
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 6
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'role_has_permissions_role_id_permission_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['permission_id', 'role_id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'role_has_permissions_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
        readonly groups: {
            readonly id: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 1
                readonly not_null: true
                readonly primary_key: true
                readonly character_count: 64
                readonly default: "nextval('public.groups_id_seq'::REGCLASS)"
            }
            readonly name: {
                readonly data_type: 'bigint'
                readonly ordinal_position: 2
                readonly not_null: true
                readonly character_count: 64
            }
            readonly created_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 3
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly updated_at: {
                readonly data_type: 'timestamp without time zone'
                readonly ordinal_position: 4
                readonly not_null: true
                readonly decimal_places: 6
                readonly default: 'now():::TIMESTAMP'
            }
            readonly resource_id: {
                readonly data_type: 'character varying'
                readonly ordinal_position: 5
                readonly not_null: true
                readonly character_count: 10485760
            }
            readonly $indexes: readonly [
                {
                    readonly index_name: 'primary'
                    readonly is_unique: true
                    readonly fields: readonly ['id']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'groups_name_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['name']
                    readonly invisible: false
                },
                {
                    readonly index_name: 'groups_resource_id_uq'
                    readonly is_unique: true
                    readonly fields: readonly ['resource_id']
                    readonly invisible: false
                }
            ]
        }
    }
) => {
    const current_selects = safe_path_or([], path_to_select, query)
    const entity_name = query_path_to_entity_name(path_to_select, query)
    const all_field_names = get_field_names(entity_name, company_schema)
    const possible_field_names = difference(all_field_names, current_selects)

    return possible_field_names
}
