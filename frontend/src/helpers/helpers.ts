import { action } from 'mobx'
import { assoc_path_mutate } from 'yay_json/build/assoc_path_mutate'
import { safe_path_or } from '../sheet_builder_old/data_helpers'

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
