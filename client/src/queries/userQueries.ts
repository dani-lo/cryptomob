import { gql } from "graphql-request"

export const READ_USERS = () => {
  
  return gql`
  {
    users {
        user_id
        user_name
    }
  }
`
}