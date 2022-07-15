/**
 * Notice: Some code was adapted from Material-UI's text field.
 *         Copyright (c) 2014 Call-Em-All (https://github.com/callemall/material-ui)
 */
import Chip from '@mui/material/Chip'
import FilledInput from '@mui/material/FilledInput/FilledInput'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import withStyles from '@mui/styles/withStyles'
import PropTypes from 'prop-types'
import React from 'react'
import { blue } from '@mui/material/colors'

// @ts-ignore
const cx = (...params) =>
    params
        .flatMap((el: any) => {
            if (typeof el === 'object') {
                return Object.keys(el)
            }
            return el
        })
        .join(' ')

const variantComponent = {
    standard: Input,
    filled: FilledInput,
    outlined: OutlinedInput
}

const styles = (theme: any) => {
    const light = theme.palette.mode === 'light'
    const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)'

    return {
        root: {},
        inputRoot: {
            display: 'inline-flex',
            flexWrap: 'wrap',
            flex: 1,
            marginTop: 0,
            minWidth: 70,
            '&$outlined,&$filled': {
                boxSizing: 'border-box'
            },
            '&$outlined': {
                paddingTop: 14
            },
            '&$filled': {
                paddingTop: 28
            }
        },
        input: {
            display: 'inline-block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            appearance: 'none', // Remove border in Safari, doesn't seem to break anything in other browsers
            WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated style).
            float: 'left',
            flex: 1
        },
        chipContainer: {
            display: 'flex',
            flexFlow: 'row wrap',
            cursor: 'text',
            marginBottom: -2,
            minHeight: 40,
            '&$labeled&$standard': {
                marginTop: 18
            }
        },
        outlined: {
            '& input': {
                height: 16,
                paddingTop: 4,
                paddingBottom: 12,
                marginTop: 4,
                marginBottom: 4
            }
        },
        standard: {},
        filled: {
            '& input': {
                height: 22,
                marginBottom: 4,
                marginTop: 4,
                paddingTop: 0
            },
            '$marginDense & input': {
                height: 26
            }
        },
        labeled: {},
        label: {
            top: 4,
            '&$outlined&:not($labelShrink)': {
                top: 2,
                '$marginDense &': {
                    top: 5
                }
            },
            '&$filled&:not($labelShrink)': {
                top: 15,
                '$marginDense &': {
                    top: 20
                }
            }
        },
        labelShrink: {
            top: 0
        },
        helperText: {
            marginBottom: -20
        },
        focused: {},
        disabled: {},
        underline: {
            '&:after': {
                borderBottom: `2px solid ${theme.palette.primary[light ? 'dark' : 'light']}`,
                left: 0,
                bottom: 0,
                // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
                content: '""',
                position: 'absolute',
                right: 0,
                transform: 'scaleX(0)',
                transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeOut
                }),
                pointerEvents: 'none' // Transparent to the hover style.
            },
            '&$focused:after': {
                transform: 'scaleX(1)'
            },
            '&$error:after': {
                borderBottomColor: theme.palette.error.main,
                transform: 'scaleX(1)' // error is always underlined in red
            },
            '&:before': {
                borderBottom: `1px solid ${bottomLineColor}`,
                left: 0,
                bottom: 0,
                // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
                content: '"\\00a0"',
                position: 'absolute',
                right: 0,
                transition: theme.transitions.create('border-bottom-color', {
                    duration: theme.transitions.duration.shorter
                }),
                pointerEvents: 'none' // Transparent to the hover style.
            },
            '&:hover:not($disabled):not($focused):not($error):before': {
                borderBottom: `2px solid ${theme.palette.text.primary}`,
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    borderBottom: `1px solid ${bottomLineColor}`
                }
            },
            '&$disabled:before': {
                borderBottomStyle: 'dotted'
            }
        },
        error: {
            '&:after': {
                backgroundColor: theme.palette.error.main,
                transform: 'scaleX(1)' // error is always underlined in red
            }
        },
        chip: {
            margin: '0 8px 8px 0',
            float: 'left'
        },
        marginDense: {}
    }
}

const keyCodes = {
    BACKSPACE: 8,
    DELETE: 46,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
}

class ChipInput extends React.Component {
    state = {
        chips: [],
        errorText: undefined,
        focusedChip: null,
        inputValue: '',
        isClean: true,
        isFocused: false,
        chipsUpdated: false,
        prevPropsValue: []
    }

    constructor(props: any) {
        super(props)
        if (props.defaultValue) {
            this.state.chips = props.defaultValue
        }
        // @ts-ignore
        this.labelRef = React.createRef()
        // @ts-ignore
        this.input = React.createRef()
    }

    componentDidMount() {
        // @ts-ignore
        if (this.props.variant === 'outlined') {
            // @ts-ignore
            this.labelNode = this.labelRef.current
            this.forceUpdate()
        }
    }

    componentWillUnmount() {
        // @ts-ignore
        clearTimeout(this.inputBlurTimeout)
    }

    static getDerivedStateFromProps(props: any, state: any) {
        let newState: any = null

        if (props.value && props.value.length !== state.prevPropsValue.length) {
            newState = { prevPropsValue: props.value }
            if (props.clearInputValueOnChange) {
                newState.inputValue = ''
            }
        }

        // if change detection is only needed for clearInputValueOnChange
        if (
            props.clearInputValueOnChange &&
            props.value &&
            props.value.length !== state.prevPropsValue.length
        ) {
            newState = { prevPropsValue: props.value, inputValue: '' }
        }

        if (props.disabled) {
            newState = { ...newState, focusedChip: null }
        }

        if (!state.chipsUpdated && props.defaultValue) {
            newState = { ...newState, chips: props.defaultValue }
        }

        return newState
    }

    /**
     * Blurs this component.
     * @public
     */
    blur() {
        // @ts-ignore
        if (this.input) this.actualInput.blur()
    }

    /**
     * Focuses this component.
     * @public
     */
    focus = () => {
        // @ts-ignore
        this.actualInput.focus()
        if (this.state.focusedChip != null) {
            this.setState({ focusedChip: null })
        }
    }

    handleInputBlur = (event: any) => {
        // @ts-ignore
        if (this.props.onBlur) {
            // @ts-ignore
            this.props.onBlur(event)
        }
        this.setState({ isFocused: false })
        if (this.state.focusedChip != null) {
            this.setState({ focusedChip: null })
        }
        const value = event.target.value
        let addChipOptions: any
        // @ts-ignore
        switch (this.props.blurBehavior) {
            // @ts-ignore
            case 'add-or-clear':
                addChipOptions = { clearInputOnFail: true }
            // falls through
            case 'add':
                // @ts-ignore
                if (this.props.delayBeforeAdd) {
                    // Lets assume that we only want to add the existing content as chip, when
                    // another event has not added a chip within 200ms .
                    // e.g. onSelection Callback in Autocomplete case
                    const numChipsBefore = // @ts-ignore
                        (this.props.value || this.state.chips).length
                    // @ts-ignore
                    this.inputBlurTimeout = setTimeout(() => {
                        const numChipsAfter = // @ts-ignore
                            (this.props.value || this.state.chips).length
                        if (numChipsBefore === numChipsAfter) {
                            this.handleAddChip(value, addChipOptions)
                        } else {
                            this.clearInput()
                        }
                    }, 150)
                } else {
                    this.handleAddChip(value, addChipOptions)
                }
                break
            case 'clear':
                this.clearInput()
                break
        }
    }

    handleInputFocus = (event: any) => {
        this.setState({ isFocused: true })
        // @ts-ignore
        if (this.props.onFocus) {
            // @ts-ignore
            this.props.onFocus(event)
        }
    }

    handleKeyDown = (event: any) => {
        const { focusedChip } = this.state
        // @ts-ignore
        this._keyPressed = false
        // @ts-ignore
        this._preventChipCreation = false
        // @ts-ignore
        if (this.props.onKeyDown) {
            // Needed for arrow controls on menu in autocomplete scenario
            // @ts-ignore
            this.props.onKeyDown(event)
            // Check if the callback marked the event as isDefaultPrevented() and skip further actions
            // enter key for example should not always add the current value of the inputField
            if (event.isDefaultPrevented()) {
                return
            }
        }
        // @ts-ignore
        const chips = this.props.value || this.state.chips
        if (
            // @ts-ignore
            this.props.newChipKeyCodes.indexOf(event.keyCode) >= 0 ||
            // @ts-ignore
            this.props.newChipKeys.indexOf(event.key) >= 0
        ) {
            // @ts-ignore
            const result = this.handleAddChip(event.target.value)
            if (result !== false) {
                event.preventDefault()
            }
            return
        }

        switch (event.keyCode) {
            case keyCodes.BACKSPACE:
                if (event.target.value === '') {
                    if (focusedChip != null) {
                        this.handleDeleteChip(chips[focusedChip], focusedChip)
                        if (focusedChip > 0) {
                            this.setState({ focusedChip: focusedChip - 1 })
                        }
                    } else {
                        this.setState({ focusedChip: chips.length - 1 })
                    }
                }
                break
            case keyCodes.DELETE:
                if (event.target.value === '' && focusedChip != null) {
                    this.handleDeleteChip(chips[focusedChip], focusedChip)
                    if (focusedChip <= chips.length - 1) {
                        this.setState({ focusedChip })
                    }
                }
                break
            case keyCodes.LEFT_ARROW:
                if (focusedChip == null && event.target.value === '' && chips.length) {
                    this.setState({ focusedChip: chips.length - 1 })
                } else if (focusedChip != null && focusedChip > 0) {
                    this.setState({ focusedChip: focusedChip - 1 })
                }
                break
            case keyCodes.RIGHT_ARROW:
                if (focusedChip != null && focusedChip < chips.length - 1) {
                    this.setState({ focusedChip: focusedChip + 1 })
                } else {
                    this.setState({ focusedChip: null })
                }
                break
            default:
                this.setState({ focusedChip: null })
                break
        }
    }

    handleKeyUp = (event: any) => {
        if (
            // @ts-ignore
            !this._preventChipCreation &&
            // @ts-ignore
            (this.props.newChipKeyCodes.indexOf(event.keyCode) >= 0 ||
                // @ts-ignore
                this.props.newChipKeys.indexOf(event.key) >= 0) &&
            // @ts-ignore
            this._keyPressed
        ) {
            this.clearInput()
        } else {
            this.updateInput(event.target.value)
        }
        // @ts-ignore
        if (this.props.onKeyUp) {
            // @ts-ignore
            this.props.onKeyUp(event)
        }
    }

    // @ts-ignore
    handleKeyPress = event => {
        // @ts-ignore
        this._keyPressed = true
        // @ts-ignore
        if (this.props.onKeyPress) {
            // @ts-ignore
            this.props.onKeyPress(event)
        }
    }

    handleUpdateInput = (e: any) => {
        // @ts-ignore
        if (this.props.inputValue == null) {
            this.updateInput(e.target.value)
        }

        // @ts-ignore
        if (this.props.onUpdateInput) {
            // @ts-ignore
            this.props.onUpdateInput(e)
        }
    }

    /**
     * Handles adding a chip.
     * @param {string|object} chip Value of the chip, either a string or an object (if dataSourceConfig is set)
     * @param {object=} options Additional options
     * @param {boolean=} options.clearInputOnFail If `true`, and `onBeforeAdd` returns `false`, clear the input
     * @returns True if the chip was added (or at least `onAdd` was called), false if adding the chip was prevented
     */
    handleAddChip(chip: any, options: any) {
        // @ts-ignore
        if (this.props.onBeforeAdd && !this.props.onBeforeAdd(chip)) {
            // @ts-ignore
            this._preventChipCreation = true
            if (options != null && options.clearInputOnFail) {
                this.clearInput()
            }
            return false
        }
        this.clearInput()
        // @ts-ignore
        const chips = this.props.value || this.state.chips
        // @ts-ignore
        if (this.props.dataSourceConfig) {
            if (typeof chip === 'string') {
                chip = {
                    // @ts-ignore
                    [this.props.dataSourceConfig.text]: chip,
                    // @ts-ignore
                    [this.props.dataSourceConfig.value]: chip
                }
            }

            if (
                // @ts-ignore
                this.props.allowDuplicates ||
                !chips.some(
                    (c: any) =>
                        // @ts-ignore
                        c[this.props.dataSourceConfig.value] ===
                        // @ts-ignore
                        chip[this.props.dataSourceConfig.value]
                )
            ) {
                // @ts-ignore
                if (this.props.value && this.props.onAdd) {
                    // @ts-ignore
                    this.props.onAdd(chip)
                } else {
                    this.updateChips([...this.state.chips, chip])
                }
            }
            return true
        }

        if (chip.trim().length > 0) {
            // @ts-ignore
            if (this.props.allowDuplicates || chips.indexOf(chip) === -1) {
                // @ts-ignore
                if (this.props.value && this.props.onAdd) {
                    // @ts-ignore
                    this.props.onAdd(chip)
                } else {
                    this.updateChips([...this.state.chips, chip])
                }
            }
            return true
        }
        return false
    }

    handleDeleteChip(chip: any, i: any) {
        // @ts-ignore
        if (!this.props.value) {
            const chips = this.state.chips.slice()
            const changed = chips.splice(i, 1) // remove the chip at index i
            if (changed) {
                let focusedChip = this.state.focusedChip
                if (this.state.focusedChip === i) {
                    focusedChip = null
                    // @ts-ignore
                } else if (this.state.focusedChip > i) {
                    // @ts-ignore
                    focusedChip = this.state.focusedChip - 1
                }
                this.updateChips(chips, { focusedChip })
            }
            // @ts-ignore
        } else if (this.props.onDelete) {
            // @ts-ignore
            this.props.onDelete(chip, i)
        }
    }

    updateChips(chips: any, additionalUpdates = {}) {
        this.setState({ chips, chipsUpdated: true, ...additionalUpdates })
        // @ts-ignore
        if (this.props.onChange) {
            // @ts-ignore
            this.props.onChange(chips)
        }
    }

    /**
     * Clears the text field for adding new chips.
     * This only works in uncontrolled input mode, i.e. if the inputValue prop is not used.
     * @public
     */
    clearInput() {
        this.updateInput('')
    }

    updateInput(value: any) {
        this.setState({ inputValue: value })
    }

    /**
     * Set the reference to the actual input, that is the input of the Input.
     * @param {object} ref - The reference
     */
    setActualInputRef = (ref: any) => {
        // @ts-ignore
        this.actualInput = ref
        // @ts-ignore
        if (this.props.inputRef) {
            // @ts-ignore
            this.props.inputRef(ref)
        }
    }

    render() {
        const {
            // allowDuplicates,
            alwaysShowPlaceholder,
            // blurBehavior,
            // children,
            chipRenderer = defaultChipRenderer,
            classes,
            className,
            // clearInputValueOnChange,
            // dataSource,
            dataSourceConfig,
            // defaultValue,
            // delayBeforeAdd,
            disabled,
            disableUnderline,
            error,
            // filter,
            FormHelperTextProps,
            fullWidth,
            fullWidthInput,
            helperText,
            id,
            InputProps = {},
            // inputRef,
            InputLabelProps = {},
            inputValue,
            label,
            // newChipKeyCodes,
            // newChipKeys,
            // onBeforeAdd,
            // onAdd,
            // onBlur,
            // onDelete,
            // onChange,
            // onFocus,
            // onKeyDown,
            // onKeyPress,
            // onKeyUp,
            // onUpdateInput,
            placeholder,
            readOnly,
            required,
            rootRef,
            value,
            variant,
            ...other
        } = this.props as any

        const chips = value || this.state.chips
        const actualInputValue = inputValue != null ? inputValue : this.state.inputValue

        const hasInput =
            // @ts-ignore
            (this.props.value || actualInputValue).length > 0 || actualInputValue.length > 0
        const shrinkFloatingLabel =
            InputLabelProps.shrink != null
                ? InputLabelProps.shrink
                : label != null && (hasInput || this.state.isFocused || chips.length > 0)

        const chipComponents = chips.map((chip: any, i: number) => {
            const value = dataSourceConfig ? chip[dataSourceConfig.value] : chip
            return chipRenderer(
                {
                    value,
                    text: dataSourceConfig ? chip[dataSourceConfig.text] : chip,
                    chip,
                    isDisabled: !!disabled,
                    isReadOnly: readOnly,
                    isFocused: this.state.focusedChip === i,
                    handleClick: () => this.setState({ focusedChip: i }),
                    handleDelete: () => this.handleDeleteChip(chip, i),
                    className: classes.chip
                },
                i
            )
        })

        const InputMore: any = {}
        if (variant === 'outlined') {
            InputMore.notched = shrinkFloatingLabel
            InputMore.labelWidth =
                (shrinkFloatingLabel &&
                    // @ts-ignore
                    this.labelNode &&
                    // @ts-ignore
                    this.labelNode.offsetWidth) ||
                0
        }

        if (variant !== 'standard') {
            InputMore.startAdornment = <React.Fragment>{chipComponents}</React.Fragment>
        } else {
            InputProps.disableUnderline = true
        }

        // @ts-ignore
        const InputComponent = variantComponent[variant]

        return (
            <FormControl
                ref={rootRef}
                fullWidth={fullWidth}
                className={cx(className, classes.root, {
                    [classes.marginDense]: other.margin === 'dense'
                })}
                error={error}
                required={chips.length > 0 ? undefined : required}
                onClick={this.focus}
                disabled={disabled}
                variant={variant}
                {...other}
            >
                {label && (
                    <InputLabel
                        htmlFor={id}
                        classes={{
                            root: cx(classes[variant], classes.label),
                            shrink: classes.labelShrink
                        }}
                        shrink={shrinkFloatingLabel}
                        focused={this.state.isFocused}
                        variant={variant}
                        // @ts-ignore
                        ref={this.labelRef}
                        required={required}
                        {...InputLabelProps}
                    >
                        {label}
                    </InputLabel>
                )}
                <div
                    className={cx(classes[variant], classes.chipContainer, {
                        [classes.focused]: this.state.isFocused,
                        [classes.underline]: !disableUnderline && variant === 'standard',
                        [classes.disabled]: disabled,
                        [classes.labeled]: label != null,
                        [classes.error]: error
                    })}
                >
                    {variant === 'standard' && chipComponents}
                    <InputComponent
                        // @ts-ignore
                        ref={this.input}
                        classes={{
                            input: cx(classes.input, classes[variant]),
                            root: cx(classes.inputRoot, classes[variant])
                        }}
                        id={id}
                        value={actualInputValue}
                        onChange={this.handleUpdateInput}
                        onKeyDown={this.handleKeyDown}
                        onKeyPress={this.handleKeyPress}
                        onKeyUp={this.handleKeyUp}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputBlur}
                        inputRef={this.setActualInputRef}
                        disabled={disabled}
                        fullWidth={fullWidthInput}
                        placeholder={
                            (!hasInput && (shrinkFloatingLabel || label == null)) ||
                            alwaysShowPlaceholder
                                ? placeholder
                                : null
                        }
                        readOnly={readOnly}
                        {...InputProps}
                        {...InputMore}
                    />
                </div>
                {helperText && (
                    <FormHelperText
                        {...FormHelperTextProps}
                        className={
                            FormHelperTextProps
                                ? cx(FormHelperTextProps.className, classes.helperText)
                                : classes.helperText
                        }
                    >
                        {helperText}
                    </FormHelperText>
                )}
            </FormControl>
        )
    }
}

// @ts-ignore
ChipInput.propTypes = {
    /** Allows duplicate chips if set to true. */
    allowDuplicates: PropTypes.bool,
    /** If true, the placeholder will always be visible. */
    alwaysShowPlaceholder: PropTypes.bool,
    /** Behavior when the chip input is blurred: `'clear'` clears the input, `'add'` creates a chip and `'ignore'` keeps the input. */
    blurBehavior: PropTypes.oneOf(['clear', 'add', 'add-or-clear', 'ignore']),
    /** A function of the type `({ value, text, chip, isFocused, isDisabled, isReadOnly, handleClick, handleDelete, className }, key) => node` that returns a chip based on the given properties. This can be used to customize chip styles.  Each item in the `dataSource` array will be passed to `chipRenderer` as arguments `chip`, `value` and `text`. If `dataSource` is an array of objects and `dataSourceConfig` is present, then `value` and `text` will instead correspond to the object values defined in `dataSourceConfig`. If `dataSourceConfig` is not set and `dataSource` is an array of objects, then a custom `chipRenderer` must be set. `chip` is always the raw value from `dataSource`, either an object or a string. */
    chipRenderer: PropTypes.func,
    /** Whether the input value should be cleared if the `value` prop is changed. */
    clearInputValueOnChange: PropTypes.bool,
    /** Data source for auto complete. This should be an array of strings or objects. */
    dataSource: PropTypes.array,
    /** Config for objects list dataSource, e.g. `{ text: 'text', value: 'value' }`. If not specified, the `dataSource` must be a flat array of strings or a custom `chipRenderer` must be set to handle the objects. */
    dataSourceConfig: PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }),
    /** The chips to display by default (for uncontrolled mode). */
    defaultValue: PropTypes.array,
    /** Whether to use `setTimeout` to delay adding chips in case other input events like `onSelection` need to fire first */
    delayBeforeAdd: PropTypes.bool,
    /** Disables the chip input if set to true. */
    disabled: PropTypes.bool,
    /** Disable the input underline. Only valid for 'standard' variant */
    disableUnderline: PropTypes.bool,
    /** Props to pass through to the `FormHelperText` component. */
    FormHelperTextProps: PropTypes.object,
    /** If true, the chip input will fill the available width. */
    fullWidth: PropTypes.bool,
    /** If true, the input field will always be below the chips and fill the available space. By default, it will try to be beside the chips. */
    fullWidthInput: PropTypes.bool,
    /** Helper text that is displayed below the input. */
    helperText: PropTypes.node,
    /** Props to pass through to the `InputLabel`. */
    InputLabelProps: PropTypes.object,
    /** Props to pass through to the `Input`. */
    InputProps: PropTypes.object,
    /** Use this property to pass a ref callback to the native input component. */
    inputRef: PropTypes.func,
    /** The input value (enables controlled mode for the text input if set). */
    inputValue: PropTypes.string,
    /* The content of the floating label. */
    label: PropTypes.node,
    /** The key codes (`KeyboardEvent.keyCode`) used to determine when to create a new chip. */
    newChipKeyCodes: PropTypes.arrayOf(PropTypes.number),
    /** The keys (`KeyboardEvent.key`) used to determine when to create a new chip. */
    newChipKeys: PropTypes.arrayOf(PropTypes.string),
    /** Callback function that is called when a new chip was added (in controlled mode). */
    onAdd: PropTypes.func,
    /** Callback function that is called with the chip to be added and should return true to add the chip or false to prevent the chip from being added without clearing the text input. */
    onBeforeAdd: PropTypes.func,
    /** Callback function that is called when the chips change (in uncontrolled mode). */
    onChange: PropTypes.func,
    /** Callback function that is called when a new chip was removed (in controlled mode). */
    onDelete: PropTypes.func,
    /** Callback function that is called when the input changes. */
    onUpdateInput: PropTypes.func,
    /** A placeholder that is displayed if the input has no values. */
    placeholder: PropTypes.string,
    /** Makes the chip input read-only if set to true. */
    readOnly: PropTypes.bool,
    /** The chips to display (enables controlled mode if set). */
    value: PropTypes.array,
    /** The variant of the Input component */
    variant: PropTypes.oneOf(['outlined', 'standard', 'filled'])
}

// @ts-ignore
ChipInput.defaultProps = {
    allowDuplicates: false,
    blurBehavior: 'clear',
    clearInputValueOnChange: false,
    delayBeforeAdd: false,
    disableUnderline: false,
    newChipKeyCodes: [13],
    newChipKeys: ['Enter'],
    variant: 'standard'
}
// @ts-ignore
export const MuiChipInput = withStyles(styles, { name: 'WAMuiChipInput' })(ChipInput)

const defaultChipRenderer = (
    { text, isFocused, isDisabled, isReadOnly, handleClick, handleDelete, className }: any,
    key: any
) => (
    <Chip
        key={key}
        className={className}
        style={{
            pointerEvents: isDisabled || isReadOnly ? 'none' : undefined,
            backgroundColor: isFocused ? blue[300] : undefined
        }}
        onClick={handleClick}
        onDelete={handleDelete}
        label={text}
    />
)
