export const get_entity_names = company_schema => {
    return Object.keys(company_schema.entities ?? [])
}
export const get_field_names = (entity_name, company_schema) => {
    return Object.keys(company_schema.entities?.[entity_name]?.fields ?? {})
}

export const is_entity_name = (entity_name, company_schema) =>
    !!company_schema.entities?.[entity_name]

export const is_field_name = (entity_name, field_name, company_schema) =>
    !!company_schema.entities?.[entity_name]?.fields?.[field_name]

const get_parent_edges = (entity_name, company_schema) => {
    const fields_schema = company_schema.entities?.[entity_name]?.fields ?? {}
    const parent_edges = Object.keys(fields_schema).flatMap(field_name => {
        if (fields_schema[field_name]) {
            const parent_entity_name = Object.keys(fields_schema[field_name].references ?? {})[0]
            if (!parent_entity_name) {
                return []
            }
            const parent_field_name = Object.keys(
                fields_schema[field_name].references[parent_entity_name]
            )[0]

            return [
                {
                    from_entity: entity_name,
                    from_field: field_name,
                    to_entity: parent_entity_name,
                    to_field: parent_field_name
                }
            ]
        } else {
            return []
        }
    })

    return parent_edges
}

const get_child_edges = (entity_name, company_schema) => {
    const child_edges: any = []

    for (const check_entity_name of get_entity_names(company_schema)) {
        const check_entity_schema = company_schema.entities[check_entity_name]
        const field_names = Object.keys(check_entity_schema.fields)
        for (const check_field_name of field_names) {
            const check_field_schema = check_entity_schema.fields[check_field_name]
            if (check_field_schema.references?.[entity_name]) {
                const referenced_field_name = Object.keys(
                    check_field_schema.references[entity_name]
                )[0]
                child_edges.push({
                    from_entity: entity_name,
                    from_field: referenced_field_name,
                    to_entity: check_entity_name,
                    to_field: check_field_name
                })
            }
        }
    }

    return child_edges
}

export const get_edges = (entity_name, company_schema) => {
    const parent_edges = get_parent_edges(entity_name, company_schema)
    const child_edges = get_child_edges(entity_name, company_schema)
    return [...parent_edges, ...child_edges]
}
