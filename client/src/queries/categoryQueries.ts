import { gql } from "graphql-request";
import { QueryFilterParams } from "../store/app";

export enum CategoySortby {
  'added' = 'added',
  'article' = 'article',
  'user' = 'user',
  'name' = 'name'
} 

export const READ_CATEGORIES = (
    fromDate = '2000-01-01', 
    toDate='2030-12-31',
    filters?: Partial<QueryFilterParams> ) => {
  
  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
  const whereCategories = JSON.stringify(filters?.categories || [])
  const minItems = filters?.minItems || {}
    
  return gql`
  {
    categories(params: {
        fromDate: ${ "\"" + fromDate + "\"" },
        toDate: ${ "\"" + toDate + "\"" },
        whereTags: ${ whereTags },
        whereAuthors:  ${ whereAuthors },
        whereCategories: ${ whereCategories },
        tagged:  ${ minItems.hasOwnProperty('tagged') ? minItems.tagged  : null },
        userTagged:  ${minItems.hasOwnProperty('userTagged') ? minItems.userTagged  : null },
        commented:  ${ minItems.hasOwnProperty('commented') ? minItems.commented  : null },
        watchlisted:  ${ minItems.hasOwnProperty('watchlisted') ? minItems.watchlisted  : null },
        categoryized:  ${ minItems.hasOwnProperty('categoryized') ? minItems.categoryized  : null },
        authored:  ${ minItems.hasOwnProperty('authored') ? minItems.authored  : null },
        userAdded:  ${ minItems.hasOwnProperty('userAdded') ? minItems.userAdded  : null },
        bookmarked:  ${ minItems.hasOwnProperty('bookmarked') ? minItems.bookmarked  : null },
        }) {
            category_id
            category_name
            articles_count
            articles {
              article_id
              article_link
              article_title
              article_description
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
