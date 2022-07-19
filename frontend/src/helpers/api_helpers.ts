import axios from 'axios'
import { keys, type } from 'ramda'
import { get_error_toast_message } from '../components/toasts'
import { wrap_loading } from '../sheet_builder_old/is_loading'
import { store } from '../store'
import { show_toast } from './helpers'

const get_base_url = (host: string) => {
    if (host.includes(':3000')) {
        return 'http://localhost:3001'
    }

    const base_urls = {
        'myfrontend.ca': 'https://mybackend.com'
    } as { [key: string]: string }

    return base_urls[host]
}

export const axios_post = wrap_loading(async (url, body) => {
    const params: any = {
        method: 'POST',
        url: get_base_url(window.location.host) + url,
        data: body,
        headers: { Authorization: 'Bearer ' + store.shared.token }
    }

    const response = await axios(params)

    return response.data
})

const get_mutation_root_table = (mutation: any) =>
    keys(mutation).filter(key => type(mutation[key]) === 'Array' && key !== 'meta')[0]

const get_query_root_tables = (query: any) =>
    keys(query).filter((key: any) => type(query[key]) === 'Object' && key?.[0] !== '$')

export const orma_query = wrap_loading(async (query: any) => {
    const table_name = get_query_root_tables(query)

    const start = window.performance.now()
    try {
        const res = await axios_post(`/query`, query)
        const end = window.performance.now()
        const time = Math.round(end - start)
        console.info(
            '%c%s',
            `color: green; font-size: 16px;`,
            `QUERY (${time}ms)`,
            table_name,
            query,
            res
        )
        return res
    } catch (error: any) {
        const end = window.performance.now()
        const time = Math.round(end - start)
        console.info(
            '%c%s',
            `color: red; font-size: 16px;`,
            `QUERY (${time}ms)`,
            table_name,
            query,
            error?.response?.data || error
        )

        const toast_message = get_error_toast_message(error)
        if (toast_message) {
            show_toast('error', toast_message)
        }

        return Promise.reject(error)
    }
})

export const orma_mutate = async (mutation: any) => {
    const table_name = get_mutation_root_table(mutation)

    const start = window.performance.now()
    try {
        const res = await axios_post(`/mutate`, mutation)
        const end = window.performance.now()
        const time = Math.round(end - start)
        console.info(
            '%c%s',
            `color: green; font-size: 16px;`,
            `MUTATE (${time}ms)`,
            table_name,
            mutation,
            res
        )
        return res
    } catch (error: any) {
        const end = window.performance.now()
        const time = Math.round(end - start)
        console.info(
            '%c%s',
            `color: red; font-size: 16px;`,
            `MUTATE (${time}ms)`,
            table_name,
            mutation,
            error?.response?.data || error
        )

        const toast_message = get_error_toast_message(error)
        if (toast_message) {
            show_toast('error', toast_message)
        }

        return Promise.reject(error)
    }
}
