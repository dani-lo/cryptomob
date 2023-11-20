import { gql } from "graphql-request";

export enum CommentsSortby {
  'date' = 'date',
  'article' = 'article',
  'user' = 'user',
} 

export const READ_COMMENTS = (appId: number) => {
    
  return gql`
  {
    comments(params: {
        appId: ${ appId }
      }) {
      comment_id
      comment_text
      
      article {
          article_id
          article_title
      }
    }
  }
`
}

export const CREATE_COMMENT = gql`
    mutation createCommentMutation($input: CommentInput!) {
      createComment(input: $input) {
            comment_id
            comment_text
            user {
              user_id
              user_name
            }
        }
    }
`;



