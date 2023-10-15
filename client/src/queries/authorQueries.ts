import { gql } from "graphql-request"
import { QueryFilterParams } from "../store/app"

export enum AuthorSortby {
  'name' = 'name',
} 

export const READ_AUTHORS = (filters?: Partial<QueryFilterParams> ) => {
  
  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
    
  return gql`
  {
    authors(params: {
        whereTags: ${ whereTags },
        whereAuthors:  ${ whereAuthors },
      }) {
        author_id
        author_name,
        articles {
            article_id
        }
    }
  }
`
}

// export const BOOKMARK_ARTICLE = gql`
//     mutation bookmarkArticle($input: UpdateBoolInput!) {
//       bookmarkArticlez(input: $input) {
//           article_id
//       }
//     }
// `

// export const DELETE_ARTICLE = gql`
//     mutation deleteArticle($input: UpdateBoolInput!) {
//       deleteArticlez(input: $input) {
//           article_id
//       }
//     }
// `