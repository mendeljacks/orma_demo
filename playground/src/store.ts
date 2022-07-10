import { observable, toJS } from 'mobx'
import { orma_schema } from '../../generated/orma_schema'

export const store = observable({
    query: {},
    schema: {
        entities: {
            account_has_roles: {
                comment: 'Specifies which accounts have which roles',
                fields: {
                    id: {
                        required: true,
                        indexed: true,
                        unique: true,
                        primary_key: true
                    },
                    account_id: {
                        references: {
                            accounts: {
                                id: {}
                            }
                        },
                        required: true,
                        indexed: true
                    },
                    account_role_id: {
                        references: {
                            account_roles: {
                                id: {}
                            }
                        },
                        required: true,
                        indexed: true
                    },
                    vendor_id: {
                        references: {
                            vendors: {
                                id: {}
                            }
                        },
                        indexed: true
                    },
                    updated_at: {
                        required: true
                    },
                    created_at: {
                        required: true
                    },
                    resource_id: {
                        required: true,
                        indexed: true,
                        unique: true
                    }
                }
            },
            account_permissions: {
                comment: 'A list of different permissions that are available to be given to roles',
                fields: {
                    id: {
                        required: true,
                        indexed: true,
                        unique: true,
                        primary_key: true
                    },
                    label: {
                        required: true
                    },
                    updated_at: {
                        required: true
                    },
                    created_at: {
                        required: true
                    },
                    resource_id: {
                        required: true,
                        indexed: true,
                        unique: true
                    }
                }
            },
            account_role_has_permissions: {
                comment: 'A list specifying which roles have which permissions',
                fields: {
                    id: {
                        required: true,
                        indexed: true,
                        unique: true,
                        primary_key: true
                    },
                    account_role_id: {
                        references: {
                            account_roles: {
                                id: {}
                            }
                        },
                        required: true,
                        indexed: true
                    },
                    account_permission_id: {
                        references: {
                            account_permissions: {
                                id: {}
                            }
                        },
                        required: true,
                        indexed: true
                    },
                    updated_at: {
                        required: true
                    },
                    created_at: {
                        required: true
                    },
                    resource_id: {
                        required: true,
                        indexed: true,
                        unique: true
                    }
                }
            },
            account_roles: {
                comment: 'A list of the different account roles available to be given to users',
                fields: {
                    id: {
                        required: true,
                        indexed: true,
                        unique: true,
                        primary_key: true
                    },
                    label: {
                        required: true
                    },
                    updated_at: {
                        required: true
                    },
                    created_at: {
                        required: true
                    },
                    resource_id: {
                        required: true,
                        indexed: true,
                        unique: true
                    }
                }
            },
            accounts: {
                comment:
                    'A list of accounts registered (including vendors, admins and shoppers etc...)',
                fields: {
                    id: {
                        required: true,
                        indexed: true,
                        unique: true,
                        primary_key: true
                    },
                    vendor_id: {
                        references: {
                            vendors: {
                                id: {}
                            }
                        },
                        indexed: true
                    },
                    email: {
                        required: true,
                        indexed: true,
                        unique: true
                    },
                    first_name: {
                        required: true
                    },
                    last_name: {
                        required: true
                    },
                    phone: {},
                    email_inbound_shipments: {},
                    email_orders: {},
                    email_inventory: {},
                    hash: {},
                    updated_at: {
                        required: true
                    },
                    created_at: {
                        required: true
                    },
                    resource_id: {
                        required: true,
                        indexed: true,
                        unique: true
                    }
                }
            }
        }
    }
})

// To interact with store from console
// @ts-ignore
window.store = store
// @ts-ignore
window.toJS = toJS
