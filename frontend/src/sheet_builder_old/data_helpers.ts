import eachDeep from 'deepdash/eachDeep'
import filterDeep from 'deepdash/filterDeep'
import findValueDeep from 'deepdash/findValueDeep'
import mapValuesDeep from 'deepdash/mapValuesDeep'
import { action } from 'mobx'
import { Path } from 'orma/src/types'
import { assoc, assocPath, dropLast, last, reverse, type } from 'ramda'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'
/**
 * Just like pathOr from ramda, except it wont throw errors when used with mobx arrays
 */
export const safe_path_or = (
    default_value: string | never[] | null | undefined,
    path_array: any[],
    obj: { [x: string]: any[] }
) => {
    let pointer: any = obj

    for (const path_el of path_array) {
        const is_array = Array.isArray(pointer)
        const is_object = type(pointer) === 'Object'

        // if (is_array && type(path_el) !== 'Number') {
        //     throw new Error('Trying to path into an array without a number index')
        // }

        const contains_path_el = is_array
            ? path_el < pointer.length
            : is_object
            ? path_el in pointer
            : false

        if (contains_path_el) {
            pointer = pointer[path_el]
            continue
        } else {
            return default_value
        }
    }

    return pointer
}

/**
 * If the path points to an array, append the given item to that array. If the path points to undefined, create an array at the path with
 * just the given item. If the path points to something else, do nothing
 */
export const assoc_append = action((path_array: any, obj: any, item: any) => {
    const existing_value = safe_path_or(undefined, path_array, obj)
    if (existing_value === undefined) {
        assoc_path_mutate(path_array, [item], obj)
        return 1
    }

    if (Array.isArray(existing_value)) {
        return existing_value.push(item)
    }
})

/**
 * If the path points to an array, splice the given index out of the array. If after splicing there is nothing in the array, delete the array
 */
export const assoc_splice = action((path_array: Path, obj: any, delete_if_empty = true) => {
    const splice_index: any = last(path_array)
    if (type(splice_index) !== 'Number') {
        throw new Error('Cannot splice from something that is not an array')
    }

    const path_to_array = dropLast(1, path_array)
    const existing_array: any = safe_path_or(undefined, path_to_array, obj)

    const is_array = Array.isArray(existing_array)
    if (is_array && existing_array.length >= 1) {
        existing_array.splice(splice_index, 1)
    }

    if (is_array && existing_array.length === 0 && delete_if_empty) {
        path_delete(obj, path_to_array)
    }
})

/**
 * Delete if path points to an object key, splice if it points to an array element
 */
export const delete_or_splice = action(
    (path_array: any, obj: any, delete_if_empty: boolean | undefined) => {
        if (isNaN(last(path_array) as any)) {
            path_delete(obj, path_array)
        } else {
            assoc_splice(path_array, obj, delete_if_empty)
        }
    }
)

/**
 * A regular pathed append, but also sets the operation to create if an object is being appended
 */
export const mutation_append = action(
    (path_array: any, item: { meta: { operation?: any } }, mutation: any) => {
        if (type(item) === 'Object') {
            if (!item.meta) {
                item.meta = {}
            }

            item.meta.operation = 'create'
        }

        return assoc_append(path_array, mutation, item)
    }
)

/**
 * Restore a deleted object by setting the operation back to update
 */
export const mutation_restore = action((path_array: any, mutation: any) => {
    const operation_path = get_operation_path(path_array)
    assoc_path_mutate(operation_path, 'update', mutation)
})

/**
 * Adds meta.operation to the end of a path
 */
const get_operation_path = action((path_array: any) => {
    return [...path_array, 'meta', 'operation']
})

export const get_local_meta_path = (path_array: Path[], meta_name: any, obj: any) => {
    const item = safe_path_or(undefined, path_array, obj)
    const base_path = is_primitive(item) ? dropLast(1, path_array) : path_array

    const local_meta_path = [...base_path, 'local_meta', meta_name]
    if (type(last(path_array)) !== 'Number') {
        local_meta_path.push(last(path_array))
    }
    return local_meta_path
}

/**
 * Call javascript delete on whatevers at the given path in the given object
 */
export const path_delete = action((obj: any, path_array: Path) => {
    if (path_array.length === 0) {
        throw new Error('Cant delete root object')
    }

    const path_to_parent = dropLast(1, path_array)
    const parent = safe_path_or(undefined, path_to_parent, obj)

    if (parent && !is_primitive(parent)) {
        const last_path_el = last(path_array)
        if (last_path_el) {
            delete parent[last_path_el]
        }
    }
})

/**
 * Changes the name of a key at a specified path. Note that the path array should include the old key name as the last element
 */
export const assoc_key_name = action(
    (path_array: Path, new_key_name: string | number, obj: any) => {
        const parent_path = dropLast(1, path_array)
        const parent = safe_path_or(undefined, parent_path, obj)
        const old_key_name = last(path_array)
        parent[new_key_name] = parent[old_key_name as any]
        delete parent[old_key_name as any]
    }
)

export const deep_set_operation = action((operation: any, mutation_object: any) => {
    eachDeep(mutation_object, (value: any, key: number, parent_value: undefined) => {
        const is_object = type(value) === 'Object'
        const is_child_of_array = !isNaN(key) || parent_value === undefined // root level object is considered as a child of array (since it can have meta operation)
        if (is_object && is_child_of_array) {
            assoc_path_mutate(['meta', 'operation'], operation, value)
        }
    })

    return mutation_object
})

export const cleanup_mutation = (mutation_object: any) => {
    return filterDeep(
        mutation_object,
        (value: any, key: string) => {
            if (key === 'local_meta') {
                return false
            }

            if (!is_primitive(value)) {
                return undefined
            }

            return true
        },
        { leavesOnly: false }
    )
}

export const is_primitive = (el: any) => type(el) !== 'Object' && type(el) !== 'Array'

// I think this can be replaced with:
//   - diff primitive fields
//   - cascade metas
//   - for each object/array:
//       - only keep it if it has, as a descendant either a) a create or delete operation or b) a non-id primitive field
export const diff_mutation_old = (original_object: any, mutation_object: any) => {
    if (is_primitive(mutation_object)) {
        return mutation_object
    }

    // 1st step filters primitive keys. Creation keys are always included, update keys are included if they make a change to the original, and deletions only get id and meta
    const step1 = filterDeep(
        mutation_object,
        (
            value: { toString: () => any } | null | undefined,
            key: string,
            parent_value: { meta: { operation: any } },
            { path }: any
        ) => {
            const path_array = path.map((el: number) => (isNaN(el) ? el : Number(el)))

            const operation = parent_value?.meta?.operation
            if (operation === 'update') {
                const original_value = safe_path_or(undefined, path_array, original_object)
                const value_is_same = original_value?.toString() === value?.toString()
                return !value_is_same
            }

            if (operation === 'create') {
                return value !== null && value !== undefined
            }

            if (operation === 'delete') {
                return key === 'id' || key === 'meta'
            }

            return true
        },
        { pathFormat: 'array', leavesOnly: true }
    )

    // cascade metas down
    const step2 = mapValuesDeep(
        step1,
        (
            value: { meta: { operation: any } },
            key: string,
            parentValue: any,
            { parents }: { parents: any }
        ) => {
            if (type(value) === 'Object' && type(parentValue) === 'Array') {
                for (const parent of reverse(parents) as any) {
                    const parent_operation = parent.value?.meta?.operation
                    if (parent_operation === 'create' || parent_operation === 'delete') {
                        return assocPath(['meta', 'operation'], parent_operation, value)
                    }
                }

                const operation = value?.meta?.operation
                if (!operation) {
                    return assocPath(['meta', 'operation'], 'create', value)
                }
            }

            if (key === 'operation') {
                for (const parent of reverse(parents) as any) {
                    const parent_operation = parent.value?.meta?.operation
                    if (parent_operation === 'create' || parent_operation === 'delete') {
                        return parent_operation
                    }
                }
            }

            return value
        },
        { leavesOnly: false }
    )

    // add ids for all the update and delete operations
    const step3 = mapValuesDeep(
        step2,
        (value: { meta: { operation: any } }, key: any, parent_value: any, { path }: any) => {
            const operation = value?.meta?.operation
            if (operation === 'update' || operation === 'delete') {
                const path_array = (path ?? []).map((el: number) => (isNaN(el) ? el : Number(el)))
                const id = safe_path_or(undefined, [...path_array, 'id'], original_object)
                return assoc('id', id, value)
            }

            return value
        },
        { leavesOnly: false, pathFormat: 'array' }
    )

    // now we filter all the 'dead ends' (objects with no creates/deletes and no data in any child updates)
    const step4 = filterDeep(
        step3,
        (value: any, key: string) => {
            const is_array = type(value) === 'Array'

            if (is_array) {
                return undefined
            }

            if (is_primitive(value)) {
                return true
            }

            if (key === 'meta') {
                return true
            }

            const has_nontrivial_key = findValueDeep(value, (value: string, key: string) => {
                const child_is_primitive = is_primitive(value)
                const child_is_data = key !== 'id' && key !== 'meta' && key !== 'operation'
                const child_is_primitive_data = child_is_primitive && child_is_data
                const is_create_or_delete =
                    key === 'operation' && (value === 'create' || value === 'delete')

                if (child_is_primitive_data || is_create_or_delete) {
                    return true
                }
            })

            return has_nontrivial_key !== undefined
        },
        { leavesOnly: false, onTrue: { skipChildren: false } }
    )

    return step4
}

export const deep_delete_key = (key_to_delete: any, obj: any) => {
    eachDeep(obj, (value: any, key: any, parent_value: { error: any }) => {
        if (key === key_to_delete) {
            delete parent_value.error
        }
    })
}

/**
 * Recursively delete object and arrays that are empty, from the given path all the way up to the root
 */
export const delete_if_empty = (path_array: Path, obj: any) => {
    if (path_array.length === 0) {
        return
    }

    const value = safe_path_or(undefined, path_array, obj)
    const parent_is_object = isNaN(last(path_array) as any)
    const parent_is_array = !isNaN(last(path_array) as any)
    if (parent_is_object && Object.keys(value).length === 0) {
        path_delete(obj, path_array)
    }

    if (parent_is_array && value.length === 0) {
        assoc_splice(path_array, obj, false)
    }

    const parent_path = dropLast(1, path_array)
    delete_if_empty(parent_path, obj)
}

/**
 * If i + 1 is a valid index, return i + 1, otherwise return undefined
 */
export const get_next_index = (array_length: number, i: number) => {
    return i + 1 < array_length ? i + 1 : undefined
}

/**
 * If i - 1 is a valid index, return i - 1, otherwise return undefined
 */
export const get_previous_index = (i: number) => {
    return i - 1 >= 0 ? i - 1 : undefined
}

// removes the item from the set if its inside, otherwise adds the item to the set
export const toggle_in_set = (
    set: { has: (arg0: any) => any; delete: (arg0: any) => void; add: (arg0: any) => void },
    item: any
) => {
    if (set.has(item)) {
        set.delete(item)
    } else {
        set.add(item)
    }
}
