/* eslint max-params: ["error", 4] */

import { gql } from "graphql-request"
import { QueryFilterParams } from "../store/app"

export enum AuthorSortby {
  'name' = 'name',
} 

export const READ_AUTHORS = (
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
    authors(params: {
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
        author_id
        author_name,
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

export const WATCHLIST_AUHTOR = gql`
  mutation setWatchlistAuthor($input: AuthorWatchlistMutation) {
    setWatchlistAuthor(input: $input) {
      author_id
      author_name,
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


export const UNWATCHLIST_AUHTOR = gql`
  mutation deleteWatchlistAuthor($input: AuthorWatchlistMutation) {
    deleteWatchlistAuthor(input: $input) {
      author_id
      author_name,
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