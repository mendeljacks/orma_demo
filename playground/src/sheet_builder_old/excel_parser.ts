// import eachDeep from 'deepdash/eachDeep'
// import saveAs from 'file-saver'
// import { toJS } from 'mobx'
// import { dropLast, intersperse, values } from 'ramda'
// import * as xlsx from 'xlsx/xlsx.mjs'
// import { json_to_aoa } from 'yay_json'
// import { assoc_path_mutate } from './helpers'

// export const force_array = (obj) => (Array.isArray(obj) ? obj : [obj])
// /**
//  * Turn a no3rd query into an aoa template
//  */
// export const query_to_aoa_template = (no3rd_query) => {
//     const template_json = {}
//     eachDeep(
//         toJS(no3rd_query),
//         (value, key, parent_value, { path }) => {
//             const key_is_select = key === 'select'

//             if (key_is_select) {
//                 const route = dropLast(1, path)
//                 const template_object_path = [...intersperse(0, route), 0]
//                 for (const selected_field of force_array(value)) {
//                     assoc_path_mutate(
//                         [...template_object_path, selected_field],
//                         null,
//                         template_json
//                     )
//                 }
//                 return
//             }
//         },
//         { leavesOnly: false, pathFormat: 'array' }
//     )

//     const aoa_template = json_to_aoa(template_json)
//     return aoa_template
// }

// export const excel_file_to_aoa = async (excel_file) => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = (e: any) => {
//             try {
//                 var data = new Uint8Array(e.target.result)
//                 var workbook = xlsx.read(data, { type: 'array' })
//                 const sheet = values(workbook.Sheets)[0]
//                 if (!sheet) {
//                     return reject('No sheet found')
//                 }
//                 const sheet_aoa = xlsx.utils.sheet_to_json(sheet, {
//                     header: 1,
//                     defval: '',
//                 })
//                 const columns_length = sheet_aoa[1].filter(
//                     (el) => el !== ''
//                 ).length
//                 sheet_aoa.forEach((row, i) => {
//                     const current_length = row.length
//                     const number_to_add = Math.max(
//                         0,
//                         columns_length - current_length
//                     )
//                     const cells_to_add = new Array(number_to_add).fill('')
//                     row.push(...cells_to_add)
//                     sheet_aoa[i] = row
//                         .slice(0, columns_length)
//                         .map((cell) => cell?.toString() ?? '')
//                 })
//                 return resolve(sheet_aoa)
//             } catch (error) {
//                 reject(error)
//             }
//         }
//         reader.readAsArrayBuffer(excel_file)
//     })
// }

// export const aoa_to_excel_file = (aoa, sheet_name) => {
//     var wb = xlsx.utils.book_new()
//     wb.Props = {
//         Title: sheet_name,
//         Subject: new Date().toDateString(),
//         Author: 'No3rd Api',
//         CreatedDate: new Date(),
//     }

//     wb.SheetNames.push(sheet_name)
//     wb.Sheets[sheet_name] = xlsx.utils.aoa_to_sheet(aoa)
//     wb.Sheets[sheet_name]['!cols'] = aoa[0].map(() => ({ wch: 30 })) // set column widths

//     var wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'array' })
//     return wbout
// }

// export const save_excel_file = (excel_file, file_name) => {
//     saveAs(
//         new Blob([excel_file], { type: 'application/octet-stream' }),
//         `${file_name}.xlsx`
//     )
// }
