import { Pool, types } from 'pg'
import * as env from '../../env.json'

// Enable postgres numbers to cast into JS numbers
types.setTypeParser(20, function (val) {
    return parseInt(val, 10)
})

types.setTypeParser(1084, date => date)
types.setTypeParser(1114, date => date)

export const pool = new Pool({
    connectionString: env.pg,
    types,
    ssl: { rejectUnauthorized: false }
})

export const trans = async fn => {
    const connection = await pool
        .connect()
        .catch(err => Promise.reject({ message: 'Could not start connection', err }))
    try {
        await connection.query('BEGIN')
        const res = await fn(connection)
        await connection.query('COMMIT')
        await connection.release()
        return res
    } catch (err) {
        await connection.query('ROLLBACK')
        await connection.release()
        return Promise.reject(err)
    }
}
