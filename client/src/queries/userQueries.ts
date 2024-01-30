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

export  const submitLogin = async (
    email: string, 
    password: string) => {

  const response = await fetch(`http://localhost:8080/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  })

  const userData = await response.json()
  
  return userData.user
}
