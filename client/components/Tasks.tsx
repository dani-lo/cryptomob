import { useMutation, useQuery } from '@tanstack/react-query'

import { graphql } from '../src/gql/gql'
import { gqlClient } from '../src/utils/graphqlClient'

// const GET_TASKS = graphql(`
//   query GetTasks {
//     tasks(order_by: { createdAt: desc }) {
//       id
//       name
//       done
//     }
//   }
// `)

const GET_AUTHORS = graphql(`
    query GetAuthors { 
        authors  { 
            author_name, 
            articles 
        } 
    }
`)



export function TasksComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      return gqlClient.request(GET_AUTHORS)
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    console.error(error)
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  const { tasks } = data

  return (
    <div>
      <h2>Todos</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  )
}