// import mapValuesDeep from 'deepdash/mapValuesDeep'
// import { makeAutoObservable, runInAction } from 'mobx'
// import { aoa_to_json, json_to_aoa } from 'yay_json'
// import { store } from '../store'
// import { aoa_to_excel_file, excel_file_to_aoa, save_excel_file } from './excel_parser'
// import { wrap_loading } from './is_loading'

// export const copy_query_to_clipboard = () => {
//     navigator.clipboard.writeText(JSON.stringify(store.query, undefined, 4))
// }

// export const download_sheet = wrap_loading(async () => {
//     try {
//         const results = await company_query(store.sheet_builder.query)
//         delete results.meta
//         const aoa = json_to_aoa(results)
//         const excel_file = aoa_to_excel_file(aoa, 'custom_sheet')
//         save_excel_file(excel_file, 'custom_sheet')
//     } catch (error: any) {
//         if (error.errors) {
//             runInAction(() => {
//                 store.sheet_builder.query_errors = error.errors
//             })
//         }
//     }
// })
// export const create_from_sheet = wrap_loading(async excel_file => {
//     try {
//         let aoa = await excel_file_to_aoa(excel_file)
//         const json = aoa_to_json(aoa)
//         const json_with_undefined = mapValuesDeep(json, value =>
//             value === null ? undefined : value
//         )
//         if (json_with_undefined.variant_has_categories) {
//             const confirmation = await vhc_uniqueness_hack(json_with_undefined)
//             if (confirmation !== true) {
//                 return
//             }
//         }

//         await company_mutate({
//             meta: { operation: 'create' },
//             ...json_with_undefined
//         })
//         show_toast('success', 'Uploaded sheet')
//     } catch (error) {
//         console.error(error)
//     }
// })

// export const vhc_uniqueness_hack = wrap_loading(async mutation => {
//     // store.sheet_builder is bad code and should be replaced with proper uniqueness checking once orma is ready
//     const query1 = {
//         variant_has_categories: {
//             select: ['id'],
//             where: {
//                 or: mutation.variant_has_categories.map(el => ({
//                     and: [
//                         {
//                             eq: ['variant_id', Number(el.variant_id)]
//                         },
//                         {
//                             eq: ['category_id', Number(el.category_id)]
//                         }
//                     ]
//                 }))
//             }
//         }
//     }

//     const hero_categories = mutation.variant_has_categories.filter(
//         el => el.is_hero === '1' || el.is_hero === true || el.is_hero === 1
//     )
//     let res2: any = { variant_has_categories: [] }
//     if (hero_categories.length > 0) {
//         const query2 = {
//             variant_has_categories: {
//                 select: ['id'],
//                 where: {
//                     or: hero_categories.map(el => ({
//                         and: [
//                             {
//                                 eq: ['variant_id', el.variant_id]
//                             },
//                             {
//                                 eq: ['is_hero', 1]
//                             }
//                         ]
//                     }))
//                 }
//             }
//         }
//         res2 = await company_query_paginated(query2, 'variant_has_categories')
//     }

//     const res1: any = await company_query_paginated(query1, 'variant_has_categories')

//     if (res2.variant_has_categories.length === 0 && res1.variant_has_categories.length === 0) {
//         return true
//     }

//     const confirmation = await new Promise((resolve, reject) => {
//         store.sheet_builder.uniqueness_dialog.resolver = resolve
//         store.sheet_builder.uniqueness_dialog.is_open = true
//         store.sheet_builder.uniqueness_dialog.duplicate_count = res1.variant_has_categories.length
//         store.sheet_builder.uniqueness_dialog.hero_category_count =
//             res2.variant_has_categories.length
//     })

//     if (confirmation !== true) {
//         return false
//     }

//     if (res2.variant_has_categories.length > 0) {
//         await company_mutate({
//             meta: { operation: 'update' },
//             variant_has_categories: res2.variant_has_categories.map(el => ({
//                 id: el.id,
//                 is_hero: null
//             }))
//         })
//     }

//     await company_mutate({
//         meta: { operation: 'delete' },
//         variant_has_categories: res1.variant_has_categories
//     })

//     return true
// })

// export const update_from_sheet = wrap_loading(async excel_file => {
//     try {
//         const aoa = await excel_file_to_aoa(excel_file)
//         const json = aoa_to_json(aoa)
//         await company_mutate({
//             meta: { operation: 'update' },
//             ...json
//         })
//         show_toast('success', 'Uploaded sheet')
//     } catch (error) {
//         console.error(error)
//     }
// })
