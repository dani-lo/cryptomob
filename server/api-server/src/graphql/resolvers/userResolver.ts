import { PaginationQueryParams } from '.'
import { dataSources } from '../datasources'

export default {
    Query: {

        async users() {

            return await dataSources.userService.getUsers()
        }
    },
    Mutation: {
        
    },
    User: {
        
    }
}