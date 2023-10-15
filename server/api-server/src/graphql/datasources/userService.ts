import { DataSource } from 'apollo-datasource'

import prisma from '../../db/prisma'

export class UserService extends DataSource {

    constructor() {
        super();
    }

    initialize() {}

    async getUsers() {
        return await prisma.user.findMany()
    }

    async getUser(userId: number) {

        return await prisma.user.findFirst({
            where : {
                user_id: userId
            }
        })
    }

}
