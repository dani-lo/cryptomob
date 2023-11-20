/* eslint max-params: ["error", 4] */

import { gql } from "graphql-request"
import { QueryFilterParams } from "../store/app";

export enum TagsSortby {
  'date' = 'date',
  'article' = 'article',
  'user' = 'user',
} 

export const READ_TAGS = (
  appId: number,
  fromDate = '2000-01-01', 
  toDate='2030-12-31',
  filters?: Partial<QueryFilterParams> ) => {
  
  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
  const whereCategories = JSON.stringify(filters?.categories || [])
  const minItems = filters?.minItems || {}

  return gql`
  {
      tags(params: {
        appId: ${ appId }, 
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
        tag_id
        tag_name,
        tag_origin,
        articles_count,
        articles {
          article_id,
          article_title,
          article_description,
          article_link
        }
        watchlists {
          watchlist_id,
          watchlist_name,
        }
    }
  }
`
}

//   export const READ_PAGINATED_TAGS = (
//     appId: number,
//     offset: number, 
//     limit: number,
//     sortby: ArticlesSortby, 
//     sortdir: SortDirection,
//     fromDate = '2000-01-01', 
//     toDate='2030-12-31',
//     filters?: Partial<QueryFilterParams>
//     // eslint-disable-next-line max-params 
//     ) => {

//   const whereTags = JSON.stringify(filters?.tags || [])
//   const whereAuthors = JSON.stringify(filters?.authors || [])
//   const whereCategories = JSON.stringify(filters?.categories || [])
//   const minItems = filters?.minItems || {}
  
//   return gql`
//   {
//     paginatedArticles (
//       params: {
//         appId: ${ appId }, 
//         offset: ${ offset }, 
//         limit: ${ limit }, 
//         sortBy: ${ "\"" + sortby + "\"" },
//         sortDirection:  ${ "\"" + sortdir + "\"" },
//         fromDate: ${ "\"" + fromDate + "\"" },
//         toDate: ${ "\"" + toDate + "\"" },
//         whereTags: ${ whereTags },
//         whereAuthors:  ${ whereAuthors },
//         whereCategories:  ${ whereCategories },
//         tagged:  ${ minItems.hasOwnProperty('tagged') ? minItems.tagged  : null },
//         userTagged:  ${minItems.hasOwnProperty('userTagged') ? minItems.userTagged  : null },
//         commented:  ${ minItems.hasOwnProperty('commented') ? minItems.commented  : null },
//         watchlisted:  ${ minItems.hasOwnProperty('watchlisted') ? minItems.watchlisted  : null },
//         categoryized:  ${ minItems.hasOwnProperty('categoryized') ? minItems.categoryized  : null },
//         authored:  ${ minItems.hasOwnProperty('authored') ? minItems.authored  : null },
//         userAdded:  ${ minItems.hasOwnProperty('userAdded') ? minItems.userAdded  : null },
//       }
        
//     ) {
//       recordsCount,
//       articles {
//         article_id
//         article_link
//         article_bookmark
//         article_delete
//         article_description
//         article_title
//         article_datepub
//         article_content
//         article_origin
//         author {
//             author_id
//             author_name
//         }
//         category {
//           category_id
//           category_name
//         }
//         comments {
//           comment_id
//           comment_text
//           user {
//             user_id 
//             user_name
//           }
//         }
//         tags {
//             tag_id
//             tag_name
//             tag_origin
//         }
//         watchlists {
//           watchlist_id
//           watchlist_name
//         }

//       }
        
//     }
//   }
// `
// }

export const CREATE_TAG  = gql`
mutation createTagMutation($input: TagInput!) {
  createTag(input: $input) {
        tag_id
        tag_name
    }
}
`;

export const WATCHLIST_TAG = gql`
  mutation setWatchlistTag($input: TagWatchlistMutation) {
    setWatchlistTag(input: $input) {
      tag_id
      tag_name,
      tag_origin,
      articles_count,
      articles {
        article_id,
        article_title,
        article_description,
        article_link
      }
      watchlists {
        watchlist_id,
        watchlist_name,
      }
    }
  }
`


export const UNWATCHLIST_TAG = gql`
  mutation deleteWatchlistTag($input: TagWatchlistMutation) {
    deleteWatchlistTag(input: $input) {
      tag_id
      tag_name,
      tag_origin,
      articles_count,
      articles {
        article_id,
        article_title,
        article_description,
        article_link
      }
      watchlists {
        watchlist_id,
        watchlist_name,
      }
    }
  }
`

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