import dbMigrate from 'db-migrate'
import env from '../../env.json'

export const reset = () => {
    var dbmigrate = dbMigrate.getInstance(true, {
        config: {
            dev: {
                driver: 'pg',
                connectionString: env.pg,
                ssl: true
            }
        }
    })

    dbmigrate.reset().then(() => dbmigrate.up())
}
