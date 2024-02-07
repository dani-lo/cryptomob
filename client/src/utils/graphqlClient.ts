import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from '@/src/config'


export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  
  headers: () => {

    const authHeaders : { authorization ?: string } = {} 

    const storedUser = localStorage.getItem('user')
    const user = storedUser ? JSON.parse(storedUser) : null

    console.log(user)
    if (user && user.token) {
        authHeaders['authorization'] = `Bearer ${ user.token }`
    }

    return {
      'Content-Type': 'application/json',
      ...authHeaders,
    }
  },
})