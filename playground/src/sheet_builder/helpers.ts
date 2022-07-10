import axios from 'axios'
import { compose, isNil, map, Path, range, split, test, type } from 'ramda'

export const to_currency = (price) =>
    '$' + Number(Number(price).toFixed(2)).toLocaleString()

export const image_url_to_b64 = async (url) => {
    const b64 = await axios
        .get(url, { responseType: 'arraybuffer' })
        .then((response) => {
            let image = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            )
            return `data:${response.headers[
                'content-type'
            ].toLowerCase()};base64,${image}`
        })
    return b64
}

export const title_case = (string) => {
    if (isNil(string)) return string
    return (
        string
            .toString()
            .replace(/([^A-Z])([A-Z])/g, '$1 $2') // split cameCase
            // eslint-disable-next-line no-useless-escape
            .replace(/[_\-]+/g, ' ') // split snake_case and lisp-case
            .toLowerCase()
            .replace(/(^\w|\b\w)/g, function (m) {
                return m.toUpperCase()
            }) // title case words
            .replace(/\s+/g, ' ') // collapse repeated whitespace
            .replace(/^\s+|\s+$/, '')
    ) // remove leading/trailing whitespace
}

const is_numeric_string = test(/^0$|^[1-9][0-9]*$/)
export const key_to_path = (path) =>
    type(path) === 'String'
        ? compose(
              map((el) => (is_numeric_string(el) ? Number(el) : el)),
              split('.')
          )(path)
        : path

export const json_to_html = (json) => json //<pre>{JSON.stringify(json, undefined, 4)}</pre>

// // just like assocPath, but mutates the input argument and so is more performant
// export const assoc_path_mutate = (path, value, obj) => {
//     var p = clone(path) // path which gets smaller for each while loop iteration
//     var o = obj // object which moves with p
//     while (p.length - 1) {
//         var p_el = p.shift()
//         var next_p_el = p[0]

//         const o_type = type(o)
//         const o_is_array = o_type === 'Array'
//         const o_is_indexible = o_is_array || o_type === 'Object'
//         // if (o_is_array && isNaN(p_el)) {
//         //     throw Error('Trying to acces an array with a non numeric index')
//         // }

//         const contains_path_el = o_is_array
//             ? p_el < o.length
//             : p_el in o

//         if (o_is_array && !contains_path_el) {
//             const add_items_count = p_el - o.length
//             if (add_items_count > 0) {
//                 for (let i = 0; i < add_items_count; i++) {
//                     o.push(undefined)
//                 }
//             }
//         }

//         if (!contains_path_el || !o_is_indexible) { // create obj/array if not there yet
//             if (type(next_p_el) !== 'Number') {
//                 o[p_el] = {}
//             } else {
//                 o[p_el] = []
//             }
//         }

//         o = o[p_el]
//     }

//     o[p[0]] = value
// }

export const assoc_path_mutate = (path_array, value, obj) => {
    if (path_array.length === 0) return obj

    let pointer = obj

    for (let i = 0; i < path_array.length; i++) {
        const path_el = path_array[i]
        const next_path_el =
            i !== path_array.length - 1 ? path_array[i + 1] : undefined

        const next_el_default = type(next_path_el) === 'Number' ? [] : {}

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

        if (!contains_path_el) {
            if (is_array) {
                const items_to_add = range(0, path_el - pointer.length).map(
                    () => undefined
                )
                pointer.push(...items_to_add)
            }

            pointer[path_el] = next_el_default
        }

        const child_type = type(pointer[path_el])
        const child_is_primitive =
            child_type !== 'Object' && child_type !== 'Array'
        if (!contains_path_el || child_is_primitive) {
            pointer[path_el] = next_el_default
        }

        if (i === path_array.length - 1) {
            pointer[path_el] = value
        }

        pointer = pointer[path_el]
    }
}

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function extractHostname(url) {
    var hostname
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2]
    } else {
        hostname = url.split('/')[0]
    }

    //find & remove port number
    hostname = hostname.split(':')[0]
    //find & remove "?"
    hostname = hostname.split('?')[0]

    return hostname
}

export const stamp_markup = (from, to) => {
    const pdf_markup = {
        pageSize: {
            width: 4 * 72,
            height: 2 * 72,
        },
        pageMargins: [10, 10, 10, 10],
        content: [
            {
                pageBreak: 'after',
                stack: [
                    { text: 'From:', alignment: 'left', fontSize: 12 },
                    {
                        text: from,
                        alignment: 'left',
                        fontSize: 12,
                        marginLeft: 20,
                    },
                ],
            },
            {
                stack: [
                    { text: 'To:', alignment: 'left', fontSize: 12 },
                    {
                        text: to,
                        alignment: 'left',
                        fontSize: 12,
                        marginLeft: 20,
                    },
                ],
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 0],
                padding: 0,
                alignment: 'center',
                color: 'black',
            },
            subheader: {
                fontSize: 13,
                bold: true,
                margin: [0, 10, 0, 5],
            },
            table: {
                margin: [0, 0, 0, 0],
                padding: 0,
                // fontSize: 15,
                alignment: 'center',
            },
        },
        defaultStyle: {
            alignment: 'justify',
        },
    }

    return pdf_markup
}

const get_type = (something) => {
    if (something === null) {
        return 'Null'
    }
    if (something === undefined) {
        return 'Undefined'
    }

    return Object.prototype.toString.call(something).slice(8, -1)
}

// calls fn on every object in input array. Also moves into any arrays it finds and calls
// walk recursively on those.
// fn is a function of (object, path_to_object) -> null
export const walk_object = (fn: any, obj: any, current_path: any = []) => {
    const obj_type: any = get_type(obj)

    if (obj_type === 'Object') {
        fn(obj, current_path)
        for (const prop in obj) {
            walk_object(fn, obj[prop], [...current_path, prop])
        }
    }

    if (obj_type === 'Array') {
        fn(obj, current_path)
        obj.forEach((el, i) => {
            walk_object(fn, el, [...current_path, i])
        })
    }
}

export const round_to = (num, places) =>
    Math.round((num + Number.EPSILON) * 10 ** places) / 10 ** places

export const key_by = (custom_fn) => (arr) =>
    arr.reduce((acc, val, i) => ((acc[custom_fn(val, i)] = val), acc), {})
