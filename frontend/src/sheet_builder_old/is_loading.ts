import { action, observable, runInAction } from 'mobx'
import { getLoader, wrapLoader, AddWildcardTypeToTuple  } from 'mobx-loader'

export const loaders_store = observable({
    global: new Map(),
})

//@ts-ignore
window.loaders_store = loaders_store



export const is_loading = <A extends any[]>(
    fn: (...args: A) => any,
    functionArgs?:  AddWildcardTypeToTuple<A> | undefined
): boolean => {
    return getLoader(loaders_store.global, fn, functionArgs)
}

export const wrap_loading = <A extends any[]>(fn: (...args: A) => any) => {
    return wrapLoader(loaders_store.global, fn)
}
