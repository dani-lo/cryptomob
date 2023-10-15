import { gql } from "graphql-request"
import { QueryFilterParams } from "../store/app";

export enum TagsSortby {
  'date' = 'date',
  'article' = 'article',
  'user' = 'user',
} 

export const READ_TAGS = (filters?: Partial<QueryFilterParams> ) => {
  
  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
  
  return gql`
  {
    tags(params: {
        
        whereTags: ${ whereTags },
        whereAuthors:  ${ whereAuthors },
      }) {
        tag_id
        tag_name,
        tag_origin,
        articles_count
    }
  }
`
}

export const CREATE_TAG  = gql`
mutation createTagMutation($input: TagInput!) {
  createTag(input: $input) {
        tag_id
        tag_name
    }
}
`;

export const BOOKMARK_ARTICLE = gql`
    mutation bookmarkArticle($input: UpdateBoolInput!) {
      bookmarkArticlez(input: $input) {
          article_id
      }
    }
`

export const DELETE_ARTICLE = gql`
    mutation deleteArticle($input: UpdateBoolInput!) {
      deleteArticlez(input: $input) {
          article_id
      }
    }
`