import { action } from 'mobx'
import { isNil } from 'ramda'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'
import { safe_path_or } from '../sheet_builder_old/data_helpers'
import { store } from '../store'

export const commonTabProps = (str: string) => {
    return {
        value: str,
        label: str
    }
}
export const commonTabGroupProps = (store: any, path: any) => {
    const primaryColor: 'primary' = 'primary'
    const variant: 'standard' = 'standard'
    return {
        value: safe_path_or('', path, store),
        onChange: action((_: any, new_val: any) => assoc_path_mutate(path, new_val, store)),
        variant,
        indicatorColor: primaryColor,
        textColor: primaryColor
    }
}

/**
 * Show a toast
 * @param {('success'|'error'|'info'|'warning')} variant
 * @param {*} message
 * @param {*} auto_hide_duration
 */
export const show_toast = action((variant: any, message: any, auto_hide_duration: any = null) => {
    store.toast.toast_content = message
    store.toast.toast_severity = variant
    store.toast.toast_auto_hide_duration = auto_hide_duration
    store.toast.toast_is_open = true
})

export const title_case = (string: string) => {
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
