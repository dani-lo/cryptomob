import { ActionACL, ActionTypes } from './action'
import { Application, Request } from "express"
import 'dotenv/config'
import { connectionString } from "../db/pgPool"
import { dataSources } from '../graphql/datasources';

const jwt = require('jsonwebtoken')

export type RequestWithUser = Request & { user ?:any }

export class User {

    tok: string | null
    aclRole: keyof (typeof ActionACL)

    constructor (aclRole: keyof (typeof ActionACL)) {
        this.aclRole = aclRole
        this.tok = null
    }

    can (action: ActionTypes) { 

        if (this.tok === null) {
            return false
        }

        const aclRole = ActionACL[this.aclRole]  as ActionTypes[]

        return aclRole.includes(action)
    }

    async login (userEmail: string, userPass: string) {

        const userData = await dataSources.userService.pgGetUserByEmail(userEmail)

    }
}