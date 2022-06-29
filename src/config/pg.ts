import { Pool } from 'pg'
import * as env from '../../env.json'

export const pool = new Pool({
    connectionString: env.pg,
    ssl: { rejectUnauthorized: false }
})

export const trans = async fn => {
    const connection = await pool
        .getConnection()
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
