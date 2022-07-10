import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import React from 'react'
import {
    MdAdd,
    MdBuild,
    MdDescription,
    MdEdit,
    MdFileDownload,
} from 'react-icons/md'
import { cancel, open } from '../../helpers/dialog_helpers'
import { is_loading } from '../../helpers/is_loading'
import {
    copy_query_to_clipboard,
    create_from_sheet,
    download_sheet,
    update_from_sheet,
} from '../../helpers/sheet_builder_helpers'
import { store } from '../../stores/store'
import { Box } from '../reusables/box'
import { ErrorList } from '../reusables/error_list'
import { QueryBuilder } from './sheet_builder/query_builder'

export const SheetBuilderPage = observer(() => {
    const create_button_loading = is_loading(create_from_sheet)
    const update_button_loading = is_loading(update_from_sheet)

    return (
        <>
            {store.sheet_builder.query_errors.length > 0 && (
                <Box marginBottom={2}>
                    <Card>
                        <CardContent>
                            <ErrorList
                                errors={store.sheet_builder.query_errors}
                            />
                        </CardContent>
                    </Card>
                </Box>
            )}
            <Card>
                <CardContent>
                    <Toolbar>
                        <Typography
                            style={{ flexGrow: 1 }}
                            color="textSecondary"
                            variant="h5"
                        >
                            Custom sheet
                        </Typography>
                        <Tooltip title="View query">
                            <IconButton
                                onClick={(e) =>
                                    open(
                                        store.sheet_builder
                                            .inspect_query_dialog,
                                        undefined
                                    )
                                }
                                size="large"
                            >
                                <MdBuild />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download sheet">
                            <IconButton
                                onClick={(e) => download_sheet()}
                                size="large"
                            >
                                <MdFileDownload />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Create from excel">
                            <IconButton component="label" size="large">
                                {create_button_loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <MdAdd />
                                )}
                                <input
                                    type="file"
                                    hidden
                                    disabled={create_button_loading}
                                    onChange={(e: any) => {
                                        create_from_sheet(e.target.files[0])
                                        e.target.value = null
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="update from excel">
                            <IconButton component="label" size="large">
                                {update_button_loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <MdEdit />
                                )}
                                <input
                                    type="file"
                                    hidden
                                    disabled={update_button_loading}
                                    onChange={(e: any) => {
                                        update_from_sheet(e.target.files[0])
                                        e.target.value = null
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                    <QueryBuilder query={store.sheet_builder.query} />
                </CardContent>
            </Card>
            <Dialog
                onClose={(e) =>
                    cancel(store.sheet_builder.inspect_query_dialog)
                }
                open={store.sheet_builder.inspect_query_dialog.is_open}
            >
                <CardContent>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h5">Inspect query</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Copy to clipboard">
                                <Box paddingLeft={5}>
                                    <IconButton
                                        onClick={(e) =>
                                            copy_query_to_clipboard()
                                        }
                                        size="large"
                                    >
                                        <MdDescription />
                                    </IconButton>
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    <pre>
                        {JSON.stringify(
                            store.sheet_builder.query,
                            undefined,
                            4
                        )}
                    </pre>
                </CardContent>
            </Dialog>
            <Dialog
                onClose={(e) => {
                    // @ts-ignore
                    store.sheet_builder.uniqueness_dialog.resolver(false)
                    store.sheet_builder.uniqueness_dialog.is_open = false
                }}
                open={store.sheet_builder.uniqueness_dialog.is_open}
            >
                <CardContent>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h5">
                                Overwrite variant has categories
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    There are{' '}
                    {store.sheet_builder.uniqueness_dialog.duplicate_count}{' '}
                    variant has category records from the excel sheet already in
                    the database, do you want to delete these?
                    {store.sheet_builder.uniqueness_dialog.hero_category_count >
                    0
                        ? `There are ${store.sheet_builder.uniqueness_dialog.hero_category_count} variant has category records that are marked as hero categories in the excel sheet, but those variants already have a hero category, do you want to switch the hero category to the categories in the excel sheet?`
                        : ''}
                </CardContent>
                <DialogActions>
                    <Button
                        onClick={(e) => {
                            // @ts-ignore
                            store.sheet_builder.uniqueness_dialog.resolver(true)
                            store.sheet_builder.uniqueness_dialog.is_open =
                                false
                        }}
                    >
                        CONFIRM
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})
