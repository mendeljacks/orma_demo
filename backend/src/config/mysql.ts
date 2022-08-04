import mysql from 'promise-mysql'

export const get_pool_mysql = async ({
    host,
    user,
    password,
    port,
    database
}: {
    host: string
    user: string
    password: string
    port: string
    database: string
}) => {
    const config = {
        connectionLimit: 100,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host,
        user,
        password,
        database,
        multipleStatements: true,
        timezone: 'utc'
    }
    const pool = await mysql.createPool(config)
    return pool
}

export const mysql_trans = pool => async fn => {
    const connection = await pool
        .getConnection()
        .catch(err => Promise.reject({ message: 'Could not start connection', err }))
    try {
        await connection.query('START TRANSACTION')
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
