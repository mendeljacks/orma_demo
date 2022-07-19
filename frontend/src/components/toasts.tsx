import { Alert, Snackbar, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { title_case } from '../helpers/helpers'
import { store } from '../store'

export const Toasts = observer(() => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={store.toast.toast_is_open || false}
            autoHideDuration={store.toast.toast_auto_hide_duration}
            onClose={action(_ => (store.toast.toast_is_open = false))}
        >
            <Alert
                variant='filled'
                severity={store.toast.toast_severity}
                onClose={action(_ => (store.toast.toast_is_open = false))}
            >
                {store.toast.toast_content}
            </Alert>
        </Snackbar>
    )
})

export const get_error_toast_message = (error: any) => {
    const error_code = error?.response?.data?.error_code || error?.response?.data?.code // code comes in the dup_entry resopnse
    const summary = error?.response?.data?.summary ||
        error?.response?.data?.errors || [error?.response?.data?.message]

    if (!error_code && !summary?.[0]) {
        console.log(error)
        return <span>'Unable to reach server'</span>
    }

    return (
        <span>
            <Typography variant='h6'>{title_case(error_code)}</Typography>
            {summary
                ?.map((el: any) => el?.message || String(el))
                .map((msg: any, i: any) => (
                    <li key={i}>
                        <Typography variant='caption'>{msg}</Typography>
                    </li>
                ))}
        </span>
    )
}
