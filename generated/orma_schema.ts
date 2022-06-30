export const orma_schema = {
    users: {
        id: {
            data_type: 'int',
            not_null: true,
            indexed: true,
            auto_increment: true,
            primary_key: true
        },
        email: { data_type: 'varchar', not_null: true },
        password: { data_type: 'varchar', not_null: true },
        first_name: { data_type: 'varchar' },
        last_name: { data_type: 'varchar' },
        phone: { data_type: 'varchar' },
        created_at: {
            data_type: 'timestamp',
            not_null: true,
            default: 'CURRENT_TIMESTAMP'
        },
        updated_at: {
            data_type: 'timestamp',
            not_null: true,
            default: 'CURRENT_TIMESTAMP'
        },
        $indexes: [
            {
                index_name: 'users_un',
                is_unique: true,
                fields: ['email']
            },
            {
                index_name: 'users_un2',
                is_unique: true,
                fields: ['phone']
            },
            {
                index_name: 'PRIMARY',
                is_unique: true,
                fields: ['id']
            }
        ]
    }
} as const
