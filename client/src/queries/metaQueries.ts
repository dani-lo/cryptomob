import { gql } from "graphql-request";

export const READ_COUNTS = (appId: number) => {
    
  return gql`
  {
    appCounts(params: {
        appId: ${ appId }
      }) {
      tags_count
    }
  }
`
}
