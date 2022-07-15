import jwt from 'jsonwebtoken'
import * as env from '../../env.json'
import { query_handler } from '../config/orma'

export const login_user = async (email, password) => {
    if (!email) {
        return Promise.reject('Must enter an email')
    }
    if (!password) {
        return Promise.reject('Must enter a password')
    }

    const $where: any = {
        $eq: ['email', { $escape: email }]
    }
    const query = {
        users: {
            id: true,
            email: true,
            password: true,
            $where
        }
    }

    const { users } = (await query_handler(query)) as any
    if (users.length !== 1) {
        return Promise.reject('Incorrect email')
    }
    if (users[0].password !== password) {
        return Promise.reject('Incorrect password')
    }

    const token = await new Promise((resolve, reject) => {
        jwt.sign(
            { username: email },
            env.jwt_secret,
            /*{expiresIn: 60},*/ (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(`${email} Logged in`)
                    resolve(token)
                }
            }
        )
    })

    return { token, user_id: users[0].id }
}
