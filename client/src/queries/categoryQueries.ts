import { gql } from "graphql-request";
import { QueryFilterParams } from "../store/app";

export enum CategoySortby {
  'added' = 'added',
  'article' = 'article',
  'user' = 'user',
  'name' = 'name'
} 

export const READ_CATEGORIES = (filters?: Partial<QueryFilterParams> ) => {
  
  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
    
    return gql`
    {
        categories(params: {
          whereTags: ${ whereTags },
          whereAuthors:  ${ whereAuthors },
        }) {
            category_id
            category_name
            articles_count
            articles {
              article_id
              article_link
              article_title
            }
            # user {
            #   user_id
            #   user_name
            # }
      }
    }
  `
}
  

export const CREATE_CATEGORY = gql`
    mutation createCategoryMutation($input:CategoryInput!) {
      createCategory(input: $input) {
            category_id
            category_name
            user {
              user_id
              user_name
            }
        }
    }
`;
