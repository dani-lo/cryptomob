import { DataSource } from 'apollo-datasource'

// import { QueryResult } from 'pg'

// import prisma from '../../db/prisma'
// import { Article, Prisma, Tag, User } from '@prisma/client'

import { WhereParameters, articleWhere, whereClauseObjToSql } from '../resolvers'

import { hasAnyFilter } from '../../helpers/has';

import { getPool } from '../../db/pgPool'

export class UserService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    // async getUsers() {

        
    //     return await prisma.user.findMany()
    // }

    async pgGetUsers () {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM users;')
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching users')

        } finally {
            pgclient.release()
        }
        
    }

    async pgGetUser (userId: number) {

        const pgPool = getPool()
        const pgclient = await pgPool.connect()

        try {
             return pgclient.query('SELECT * FROM users WHERE user_id = $1;', [userId])
        } catch (err) {

            console.log(err)
            
            return Promise.reject('Error fetching user' + userId)

        } finally {
            pgclient.release()
        }
        
    }

}
