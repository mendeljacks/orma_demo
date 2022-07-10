export const try_parse_json = (
    json_string: string,
    default_value: any = undefined
) => {
    try {
        return JSON.parse(json_string)
    } catch (error) {
        return default_value
    }
}
