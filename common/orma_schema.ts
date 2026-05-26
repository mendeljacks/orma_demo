export const orma_schema = {
  "$entities": {
    "_prisma_migrations": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "character varying",
          "$precision": 36,
          "$not_null": true
        },
        "checksum": {
          "$data_type": "character varying",
          "$precision": 64,
          "$not_null": true
        },
        "finished_at": {
          "$data_type": "timestamp with time zone",
          "$precision": 6
        },
        "migration_name": {
          "$data_type": "character varying",
          "$precision": 255,
          "$not_null": true
        },
        "logs": {
          "$data_type": "text"
        },
        "rolled_back_at": {
          "$data_type": "timestamp with time zone",
          "$precision": 6
        },
        "started_at": {
          "$data_type": "timestamp with time zone",
          "$precision": 6,
          "$default": "'now()'",
          "$not_null": true
        },
        "applied_steps_count": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 0,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "utility": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "asset_status": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "current_soc": {
          "$data_type": "integer",
          "$precision": 32
        },
        "charging_status": {
          "$data_type": "text"
        },
        "last_status_update": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "plugged_in": {
          "$data_type": "boolean"
        },
        "net_input_watts": {
          "$data_type": "integer",
          "$precision": 32
        },
        "net_input_watts_configured": {
          "$data_type": "integer",
          "$precision": 32
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "asset_status_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "wallbox_schedule": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "wallbox_charger_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "wallbox_schedule_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "start": {
          "$data_type": "text",
          "$not_null": true
        },
        "stop": {
          "$data_type": "text",
          "$not_null": true
        },
        "monday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "tuesday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "wednesday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "thursday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "friday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "saturday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "sunday": {
          "$data_type": "boolean",
          "$default": "'false'",
          "$not_null": true
        },
        "name": {
          "$data_type": "text"
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "wallbox_schedule_wallbox_charger_id_fkey",
          "$fields": [
            "wallbox_charger_id"
          ],
          "$references": {
            "$entity": "wallbox_charger",
            "$fields": [
              "wallbox_charger_id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "dcbel_charger": {
      "$database_type": "postgres",
      "$fields": {
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "dcbel_charger_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "model": {
          "$data_type": "text"
        },
        "serial_number": {
          "$data_type": "text"
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "charger_id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "dcbel_charger_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "invite": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "expiry_date": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "'(now() + '2 years'::interval)'"
        },
        "charger_link_date": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "participant_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "charger_brand": {
          "$data_type": "user-defined",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "invite_participant_id_fkey",
          "$fields": [
            "participant_id"
          ],
          "$references": {
            "$entity": "participant",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "enrollment": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "status": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "energy_program_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "enrollment_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "enrollment_energy_program_id_fkey",
          "$fields": [
            "energy_program_id"
          ],
          "$references": {
            "$entity": "energy_program",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "energy_program": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "description": {
          "$data_type": "text"
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "participant": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "designation_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "dr_event": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "event_start": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "event_end": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "event_type": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "event_status": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "value_per_kwh": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "energy_program_id": {
          "$data_type": "uuid",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "dr_event_energy_program_id_fkey",
          "$fields": [
            "energy_program_id"
          ],
          "$references": {
            "$entity": "energy_program",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "wallbox_charger": {
      "$database_type": "postgres",
      "$fields": {
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "wallbox_charger_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "max_available_current": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "model": {
          "$data_type": "text",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "phase": {
          "$data_type": "integer",
          "$precision": 32
        },
        "serial_number": {
          "$data_type": "text",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "line_voltage": {
          "$data_type": "integer",
          "$precision": 32
        }
      },
      "$primary_key": {
        "$fields": [
          "charger_id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "wallbox_charger_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "charge_plan_request": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "requested_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "completed_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "status": {
          "$data_type": "text",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "charge_plan_slots": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charge_plan_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "start_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "end_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "net_power_w": {
          "$data_type": "integer",
          "$precision": 32
        },
        "projected_soc": {
          "$data_type": "double precision",
          "$precision": 53,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "charge_plan_slots_charge_plan_id_fkey",
          "$fields": [
            "charge_plan_id"
          ],
          "$references": {
            "$entity": "charge_plan",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "mobility_needs": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "time_of_planned_disconnection": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "soc_to_target": {
          "$data_type": "integer",
          "$precision": 32
        },
        "external_vehicle_id": {
          "$data_type": "text"
        },
        "vehicle_brand": {
          "$data_type": "text"
        },
        "vehicle_model_name": {
          "$data_type": "text"
        },
        "vehicle_model_id": {
          "$data_type": "uuid"
        },
        "max_soc": {
          "$data_type": "integer",
          "$precision": 32
        },
        "min_soc": {
          "$data_type": "integer",
          "$precision": 32
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "mobility_needs_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "mobility_needs_vehicle_model_id_fkey",
          "$fields": [
            "vehicle_model_id"
          ],
          "$references": {
            "$entity": "vehicle_model",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "charger_override": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "start_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "end_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "net_power_w": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "status": {
          "$data_type": "user-defined",
          "$default": "''ACTIVE'::charger_override_status'",
          "$not_null": true
        },
        "reason": {
          "$data_type": "text",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "charger_override_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "site": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "max_import_w": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 1000000,
          "$not_null": true
        },
        "max_export_w": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 1000000,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "tariff_rate": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "tariff_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "price": {
          "$data_type": "double precision",
          "$precision": 53,
          "$not_null": true
        },
        "unit": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "rate_type": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "time_of_use_type": {
          "$data_type": "text",
          "$default": "''flat'::text'",
          "$not_null": true
        },
        "start_time": {
          "$data_type": "text",
          "$not_null": true
        },
        "end_time": {
          "$data_type": "text",
          "$not_null": true
        },
        "days_of_week": {
          "$data_type": "array"
        },
        "start_month": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "start_day": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "end_month": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "end_day": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "tariff_rate_tariff_id_fkey",
          "$fields": [
            "tariff_id"
          ],
          "$references": {
            "$entity": "tariff",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "meter": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "utility_id": {
          "$data_type": "uuid"
        },
        "asset_type": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "energy": {
          "$data_type": "integer",
          "$precision": 32
        },
        "power": {
          "$data_type": "integer",
          "$precision": 32
        },
        "last_updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "meter_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "meter_utility_id_fkey",
          "$fields": [
            "utility_id"
          ],
          "$references": {
            "$entity": "utility",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "site_forecast": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "site_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "net_load_forecast_w": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "pv_forecast_w": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "site_forecast_site_id_fkey",
          "$fields": [
            "site_id"
          ],
          "$references": {
            "$entity": "site",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "vehicle_model": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "brand": {
          "$data_type": "text",
          "$not_null": true
        },
        "model": {
          "$data_type": "text",
          "$not_null": true
        },
        "battery_capacity_kwh": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "max_charge_power_kw": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "max_discharge_power_kw": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "dcbel_transaction": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "dcbel_transaction_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "dcbel_charger_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "start_date": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "end_date": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "state": {
          "$data_type": "text"
        },
        "stopped_reason": {
          "$data_type": "text"
        },
        "transaction_type": {
          "$data_type": "text"
        },
        "phases": {
          "$data_type": "jsonb"
        },
        "request_time": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "tariff": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "site_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "name": {
          "$data_type": "text",
          "$not_null": true
        },
        "is_active": {
          "$data_type": "boolean",
          "$default": "'true'",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "tariff_site_id_fkey",
          "$fields": [
            "site_id"
          ],
          "$references": {
            "$entity": "site",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "charger": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "brand": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "external_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "participant_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "site_id": {
          "$data_type": "uuid"
        },
        "utility_id": {
          "$data_type": "uuid"
        },
        "charger_model_id": {
          "$data_type": "uuid"
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "charger_charger_model_id_fkey",
          "$fields": [
            "charger_model_id"
          ],
          "$references": {
            "$entity": "charger_model",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "charger_participant_id_fkey",
          "$fields": [
            "participant_id"
          ],
          "$references": {
            "$entity": "participant",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "charger_site_id_fkey",
          "$fields": [
            "site_id"
          ],
          "$references": {
            "$entity": "site",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "charger_utility_id_fkey",
          "$fields": [
            "utility_id"
          ],
          "$references": {
            "$entity": "utility",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "charger_model": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "vendor": {
          "$data_type": "text",
          "$not_null": true
        },
        "model": {
          "$data_type": "text",
          "$not_null": true
        },
        "max_charge_power_kw": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "max_discharge_power_kw": {
          "$data_type": "integer",
          "$precision": 32,
          "$not_null": true
        },
        "charge_efficiency": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "discharge_efficiency": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$unique_keys": []
    },
    "charge_plan": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charge_plan_request_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "external_vehicle_id": {
          "$data_type": "text"
        },
        "mobility_needs_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "status": {
          "$data_type": "text",
          "$not_null": true
        },
        "generated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "charge_plan_charge_plan_request_id_fkey",
          "$fields": [
            "charge_plan_request_id"
          ],
          "$references": {
            "$entity": "charge_plan_request",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "charge_plan_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "charge_plan_mobility_needs_id_fkey",
          "$fields": [
            "mobility_needs_id"
          ],
          "$references": {
            "$entity": "mobility_needs",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "raw_event": {
      "$database_type": "postgres",
      "$fields": {
        "global_position": {
          "$data_type": "bigint",
          "$precision": 64,
          "$default": "'nextval('event_global_position_seq'::regclass)'",
          "$not_null": true
        },
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "type": {
          "$data_type": "text",
          "$not_null": true
        },
        "occurred_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "payload": {
          "$data_type": "jsonb",
          "$not_null": true
        },
        "recorded_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "source_type": {
          "$data_type": "text",
          "$not_null": true
        },
        "source_event_id": {
          "$data_type": "text"
        }
      },
      "$primary_key": {
        "$fields": [
          "global_position"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "raw_event_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "domain_event": {
      "$database_type": "postgres",
      "$fields": {
        "global_position": {
          "$data_type": "bigint",
          "$precision": 64,
          "$default": "'nextval('domain_event_global_position_seq'::regclass)'",
          "$not_null": true
        },
        "id": {
          "$data_type": "uuid",
          "$default": "'gen_random_uuid()'",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "type": {
          "$data_type": "user-defined",
          "$not_null": true
        },
        "raw_event_position": {
          "$data_type": "bigint",
          "$precision": 64
        },
        "occurred_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "recorded_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "payload": {
          "$data_type": "jsonb",
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "global_position"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "domain_event_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "domain_event_raw_event_position_fkey",
          "$fields": [
            "raw_event_position"
          ],
          "$references": {
            "$entity": "raw_event",
            "$fields": [
              "global_position"
            ]
          }
        }
      ],
      "$unique_keys": []
    },
    "session": {
      "$database_type": "postgres",
      "$fields": {
        "id": {
          "$data_type": "text",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "site_id": {
          "$data_type": "uuid"
        },
        "vehicle_id": {
          "$data_type": "text"
        },
        "plug_in_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "plug_out_timestamp": {
          "$data_type": "timestamp without time zone",
          "$precision": 3
        },
        "plugin_duration_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "net_energy_wh": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "charging_duration_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "discharging_duration_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "soc_start_percentage": {
          "$data_type": "integer",
          "$precision": 32
        },
        "soc_end_percentage": {
          "$data_type": "integer",
          "$precision": 32
        },
        "min_power_charging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "max_power_charging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "avg_power_charging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "min_power_discharging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "max_power_discharging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "avg_power_discharging_w": {
          "$data_type": "double precision",
          "$precision": 53
        },
        "idle_time_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "downtime_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "charge_status": {
          "$data_type": "text"
        },
        "demand_management_participation": {
          "$data_type": "boolean"
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "session_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "session_site_id_fkey",
          "$fields": [
            "site_id"
          ],
          "$references": {
            "$entity": "site",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": [
        {
          "$name": "session_charger_id_plug_in_timestamp_key",
          "$fields": [
            "charger_id",
            "plug_in_timestamp"
          ]
        }
      ]
    },
    "interval": {
      "$database_type": "postgres",
      "$fields": {
        "interval_id": {
          "$data_type": "text",
          "$not_null": true
        },
        "charger_id": {
          "$data_type": "uuid",
          "$not_null": true
        },
        "site_id": {
          "$data_type": "uuid"
        },
        "interval_start": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "interval_end": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        },
        "interval_duration_seconds": {
          "$data_type": "integer",
          "$precision": 32
        },
        "energy_charged_wh": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 0,
          "$not_null": true
        },
        "energy_discharged_wh": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 0,
          "$not_null": true
        },
        "net_energy_wh": {
          "$data_type": "integer",
          "$precision": 32,
          "$default": 0,
          "$not_null": true
        },
        "soc_start": {
          "$data_type": "integer",
          "$precision": 32
        },
        "soc_end": {
          "$data_type": "integer",
          "$precision": 32
        },
        "min_power_w": {
          "$data_type": "integer",
          "$precision": 32
        },
        "max_power_w": {
          "$data_type": "integer",
          "$precision": 32
        },
        "avg_power_w": {
          "$data_type": "integer",
          "$precision": 32
        },
        "vehicle_ids": {
          "$data_type": "array",
          "$default": "''{}'::text[]'",
          "$not_null": true
        },
        "session_ids": {
          "$data_type": "array",
          "$default": "''{}'::text[]'",
          "$not_null": true
        },
        "processed_event_ids": {
          "$data_type": "array",
          "$default": "''{}'::text[]'",
          "$not_null": true
        },
        "created_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$default": "CURRENT_TIMESTAMP",
          "$not_null": true
        },
        "updated_at": {
          "$data_type": "timestamp without time zone",
          "$precision": 3,
          "$not_null": true
        }
      },
      "$primary_key": {
        "$fields": [
          "charger_id",
          "interval_id"
        ]
      },
      "$foreign_keys": [
        {
          "$name": "interval_charger_id_fkey",
          "$fields": [
            "charger_id"
          ],
          "$references": {
            "$entity": "charger",
            "$fields": [
              "id"
            ]
          }
        },
        {
          "$name": "interval_site_id_fkey",
          "$fields": [
            "site_id"
          ],
          "$references": {
            "$entity": "site",
            "$fields": [
              "id"
            ]
          }
        }
      ],
      "$unique_keys": []
    }
  },
  "$cache": {
    "$reversed_foreign_keys": {
      "charger": [
        {
          "from_field": "id",
          "to_entity": "asset_status",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "dcbel_charger",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "enrollment",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "wallbox_charger",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "mobility_needs",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "charger_override",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "meter",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "charge_plan",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "raw_event",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "domain_event",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "session",
          "to_field": "charger_id"
        },
        {
          "from_field": "id",
          "to_entity": "interval",
          "to_field": "charger_id"
        }
      ],
      "wallbox_charger": [
        {
          "from_field": "wallbox_charger_id",
          "to_entity": "wallbox_schedule",
          "to_field": "wallbox_charger_id"
        }
      ],
      "participant": [
        {
          "from_field": "id",
          "to_entity": "invite",
          "to_field": "participant_id"
        },
        {
          "from_field": "id",
          "to_entity": "charger",
          "to_field": "participant_id"
        }
      ],
      "energy_program": [
        {
          "from_field": "id",
          "to_entity": "enrollment",
          "to_field": "energy_program_id"
        },
        {
          "from_field": "id",
          "to_entity": "dr_event",
          "to_field": "energy_program_id"
        }
      ],
      "charge_plan": [
        {
          "from_field": "id",
          "to_entity": "charge_plan_slots",
          "to_field": "charge_plan_id"
        }
      ],
      "vehicle_model": [
        {
          "from_field": "id",
          "to_entity": "mobility_needs",
          "to_field": "vehicle_model_id"
        }
      ],
      "tariff": [
        {
          "from_field": "id",
          "to_entity": "tariff_rate",
          "to_field": "tariff_id"
        }
      ],
      "utility": [
        {
          "from_field": "id",
          "to_entity": "meter",
          "to_field": "utility_id"
        },
        {
          "from_field": "id",
          "to_entity": "charger",
          "to_field": "utility_id"
        }
      ],
      "site": [
        {
          "from_field": "id",
          "to_entity": "site_forecast",
          "to_field": "site_id"
        },
        {
          "from_field": "id",
          "to_entity": "tariff",
          "to_field": "site_id"
        },
        {
          "from_field": "id",
          "to_entity": "charger",
          "to_field": "site_id"
        },
        {
          "from_field": "id",
          "to_entity": "session",
          "to_field": "site_id"
        },
        {
          "from_field": "id",
          "to_entity": "interval",
          "to_field": "site_id"
        }
      ],
      "charger_model": [
        {
          "from_field": "id",
          "to_entity": "charger",
          "to_field": "charger_model_id"
        }
      ],
      "charge_plan_request": [
        {
          "from_field": "id",
          "to_entity": "charge_plan",
          "to_field": "charge_plan_request_id"
        }
      ],
      "mobility_needs": [
        {
          "from_field": "id",
          "to_entity": "charge_plan",
          "to_field": "mobility_needs_id"
        }
      ],
      "raw_event": [
        {
          "from_field": "global_position",
          "to_entity": "domain_event",
          "to_field": "raw_event_position"
        }
      ]
    }
  }
} as const