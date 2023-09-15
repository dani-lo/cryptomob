// import { nhost } from './nhost'
import { GraphQLClient } from 'graphql-request'

type AuthHeaderProps = {
  authorization?: string
}

export const graphqlApiAddress = 'localhost:8000/graphql'

export const gqlClient = new GraphQLClient(graphqlApiAddress, {
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