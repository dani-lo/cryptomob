import { dataSources } from '../datasources'

export default {
    Query: {

        async users() {

            const usersRows = await dataSources.userService.pgGetUsers()

            return usersRows.rows
        }
    },
    Mutation: {},
    User: {}
}