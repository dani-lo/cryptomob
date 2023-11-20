import { gql } from "graphql-request";

export const READ_RSS_SOURCES = (appId: number) => {
    
  return gql`
  {
    rssSources(params: {
        appId: ${ appId }
      }) {
      source_id
      source_url
    }
  }
`
}
