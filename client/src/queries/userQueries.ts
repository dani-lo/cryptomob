import { gql } from "graphql-request"

export enum TagsSortby {
  'date' = 'date',
  'article' = 'article',
  'user' = 'user',
} 

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