import { type } from 'ramda'

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
