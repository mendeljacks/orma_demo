import dbMigrate from 'db-migrate'
import env from '../../env.json'

export const reset = async () => {
    try {
        var dbm = dbMigrate.getInstance(true, {
            config: {
                dev: {
                    driver: 'pg',
                    connectionString: env.pg,
                    ssl: true
                }
            }
        })
        await dbm.silence(true)
        await dbm.reset()
        await dbm.up()
    } catch (error) {
        console.log(error)
    }
}
