import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from '../queries'


export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: () => {
    // const authHeaders = {} as AuthHeaderProps

    // if (nhost.auth.isAuthenticated()) {
    //   authHeaders['authorization'] = `Bearer ${nhost.auth.getAccessToken()}`
    // }

    return {
      'Content-Type': 'application/json',
    //   ...authHeaders,
    }
  },
})