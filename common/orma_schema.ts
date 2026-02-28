export const orma_schema = {
  "$entities": {
    "migrations": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "'nextval('migrations_id_seq'::regclass)'",
          "$not_null": true
        },
        "name": {
          "$data_type": "character varying",
          "$precision": 255,
          "$not_null": true
        },
        "run_on": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$unique_keys": [
        {
          "$name": "migrations_pkey",
          "$fields": [
            "id"
          ]
        }
      ]
    },
    "users": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "email": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        },
        "password": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        },
        "first_name": {
          "$data_type": "character varying",
          "$precision": 10485760
        },
        "last_name": {
          "$data_type": "character varying",
          "$precision": 10485760
        },
        "phone": {
          "$data_type": "character varying",
          "$precision": 10485760
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$unique_keys": [
        {
          "$name": "users_email_uq",
          "$fields": [
            "email"
          ]
        },
        {
          "$name": "users_phone_uq",
          "$fields": [
            "phone"
          ]
        },
        {
          "$name": "users_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "users_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        }
      ]
    },
    "user_has_roles": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "user_id": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "role_id": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$foreign_keys": [
        {
          "$name": "user_has_roles_role_id_fk",
          "$fields": [
            "role_id"
          ],
          "$references": {
            "$entity": "roles",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "user_has_roles_user_id_fk",
          "$fields": [
            "user_id"
          ],
          "$references": {
            "$entity": "users",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": [
        {
          "$name": "user_has_roles_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "user_has_roles_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        },
        {
          "$name": "user_has_roles_user_id_role_id_uq",
          "$fields": [
            "user_id",
            "role_id"
          ]
        }
      ]
    },
    "roles": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "name": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$unique_keys": [
        {
          "$name": "roles_name_uq",
          "$fields": [
            "name"
          ]
        },
        {
          "$name": "roles_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "roles_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        }
      ]
    },
    "role_has_permissions": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "role_id": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "permission_id": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$foreign_keys": [
        {
          "$name": "role_has_permissions_permission_id_fk",
          "$fields": [
            "permission_id"
          ],
          "$references": {
            "$entity": "permissions",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "role_has_permissions_role_id_fk",
          "$fields": [
            "role_id"
          ],
          "$references": {
            "$entity": "roles",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": [
        {
          "$name": "role_has_permissions_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "role_has_permissions_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        },
        {
          "$name": "role_has_permissions_role_id_permission_id_uq",
          "$fields": [
            "role_id",
            "permission_id"
          ]
        }
      ]
    },
    "permissions": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "name": {
          "$data_type": "character varying",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$unique_keys": [
        {
          "$name": "permissions_name_uq",
          "$fields": [
            "name"
          ]
        },
        {
          "$name": "permissions_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "permissions_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        }
      ]
    },
    "groups": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": "BY DEFAULT",
          "$not_null": true
        },
        "name": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "resource_id": {
          "$data_type": "character varying",
          "$precision": 10485760,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": []
      },
      "$unique_keys": [
        {
          "$name": "groups_name_uq",
          "$fields": [
            "name"
          ]
        },
        {
          "$name": "groups_pkey",
          "$fields": [
            "id"
          ]
        },
        {
          "$name": "groups_resource_id_uq",
          "$fields": [
            "resource_id"
          ]
        }
      ]
    }
  },
  "$cache": {
    "$reversed_foreign_keys": {
      "roles": [
        {
          "from_field": "id",
          "to_entity": "user_has_roles",
          "to_field": "role_id"
        },
        {
          "from_field": "id",
          "to_entity": "role_has_permissions",
          "to_field": "role_id"
        }
      ],
      "users": [
        {
          "from_field": "id",
          "to_entity": "user_has_roles",
          "to_field": "user_id"
        }
      ],
      "permissions": [
        {
          "from_field": "id",
          "to_entity": "role_has_permissions",
          "to_field": "permission_id"
        }
      ]
    }
  }
} as const