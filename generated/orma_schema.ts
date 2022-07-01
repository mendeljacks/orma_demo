export const orma_schema = {
  "migrations": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "name": {
      "data_type": "character varying",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "255"
    },
    "run_on": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "3",
      "not_null": true,
      "decimal_places": "6"
    },
    "$indexes": [
      {
        "index_name": "primary",
        "is_unique": true,
        "fields": [
          "id",
          "name",
          "run_on"
        ],
        "invisible": false
      }
    ]
  },
  "users": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "email": {
      "data_type": "character varying",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "10485760"
    },
    "password": {
      "data_type": "character varying",
      "ordinal_position": "3",
      "not_null": true,
      "character_count": "10485760"
    },
    "first_name": {
      "data_type": "character varying",
      "ordinal_position": "4",
      "character_count": "10485760"
    },
    "last_name": {
      "data_type": "character varying",
      "ordinal_position": "5",
      "character_count": "10485760"
    },
    "phone": {
      "data_type": "character varying",
      "ordinal_position": "6",
      "character_count": "10485760"
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "7",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "8",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "9",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "users_pk",
        "is_unique": true,
        "fields": [
          "id",
          "email",
          "password",
          "first_name",
          "last_name",
          "phone",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_phone_un",
        "is_unique": true,
        "fields": [
          "phone",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_email_un",
        "is_unique": true,
        "fields": [
          "email",
          "id"
        ],
        "invisible": false
      }
    ]
  },
  "roles": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "name": {
      "data_type": "character varying",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "10485760"
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "3",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "4",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "5",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "roles_pk",
        "is_unique": true,
        "fields": [
          "id",
          "name",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "roles_name_un",
        "is_unique": true,
        "fields": [
          "name",
          "id"
        ],
        "invisible": false
      }
    ]
  },
  "user_has_roles": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "user_id": {
      "data_type": "bigint",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "references": {
        "users": {
          "id": {}
        }
      }
    },
    "role_id": {
      "data_type": "bigint",
      "ordinal_position": "3",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "references": {
        "roles": {
          "id": {}
        }
      }
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "4",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "5",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "6",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "user_has_roles_pk",
        "is_unique": true,
        "fields": [
          "id",
          "user_id",
          "role_id",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "user_has_roles_un",
        "is_unique": true,
        "fields": [
          "user_id",
          "role_id",
          "id"
        ],
        "invisible": false
      }
    ]
  },
  "permissions": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "name": {
      "data_type": "character varying",
      "ordinal_position": "2",
      "not_null": true
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "3",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "4",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "5",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "permissions_pk",
        "is_unique": true,
        "fields": [
          "id",
          "name",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "permissions_un",
        "is_unique": true,
        "fields": [
          "name",
          "id"
        ],
        "invisible": false
      }
    ]
  },
  "role_has_permissions": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "role_id": {
      "data_type": "bigint",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "references": {
        "roles": {
          "id": {}
        }
      }
    },
    "permission_id": {
      "data_type": "bigint",
      "ordinal_position": "3",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "references": {
        "permissions": {
          "id": {}
        }
      }
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "4",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "5",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "6",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "role_has_pemissions_pk",
        "is_unique": true,
        "fields": [
          "id",
          "role_id",
          "permission_id",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "role_has_pemissions_un",
        "is_unique": true,
        "fields": [
          "role_id",
          "permission_id",
          "id"
        ],
        "invisible": false
      }
    ]
  },
  "groups": {
    "id": {
      "data_type": "bigint",
      "ordinal_position": "1",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0",
      "default": "unique_rowid()"
    },
    "name": {
      "data_type": "bigint",
      "ordinal_position": "2",
      "not_null": true,
      "character_count": "64",
      "decimal_places": "0"
    },
    "created_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "3",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "updated_at": {
      "data_type": "timestamp without time zone",
      "ordinal_position": "4",
      "not_null": true,
      "decimal_places": "6",
      "default": "now():::TIMESTAMP"
    },
    "resource_id": {
      "data_type": "character varying",
      "ordinal_position": "5",
      "not_null": true,
      "character_count": "10485760"
    },
    "$indexes": [
      {
        "index_name": "role_has_pemissions_pk",
        "is_unique": true,
        "fields": [
          "id",
          "name",
          "created_at",
          "updated_at",
          "resource_id"
        ],
        "invisible": false
      },
      {
        "index_name": "users_resource_id_uq",
        "is_unique": true,
        "fields": [
          "resource_id",
          "id"
        ],
        "invisible": false
      },
      {
        "index_name": "role_has_pemissions_un",
        "is_unique": true,
        "fields": [
          "name",
          "id"
        ],
        "invisible": false
      }
    ]
  }
} as const