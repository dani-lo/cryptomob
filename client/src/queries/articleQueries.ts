import { gql } from "graphql-request";
import { QueryFilterParams } from "../store/app";
import { SortDirection } from "../helpers/sort";

export enum ArticlesSortby {
  'date' = 'date',
  'author' = 'author',
} 

export const READ_ARTICLES = (
    appId: number,
    offset: number, 
    limit: number,
    sortby: ArticlesSortby, 
    sortdir: SortDirection,
    fromDate = '2000-01-01', 
    toDate='2030-12-31',
    filters?: Partial<QueryFilterParams>
    // eslint-disable-next-line max-params 
    ) => {

  const whereTags = JSON.stringify(filters?.tags || [])
  const whereAuthors = JSON.stringify(filters?.authors || [])
  const whereCategories = JSON.stringify(filters?.categories || [])
  const minItems = filters?.minItems || {}
  
  return gql`
  {
    paginatedArticles (
      params: {
        appId: ${ appId }, 
        offset: ${ offset }, 
        limit: ${ limit }, 
        sortBy: ${ "\"" + sortby + "\"" },
        sortDirection:  ${ "\"" + sortdir + "\"" },
        fromDate: ${ "\"" + fromDate + "\"" },
        toDate: ${ "\"" + toDate + "\"" },
        whereTags: ${ whereTags },
        whereAuthors:  ${ whereAuthors },
        whereCategories:  ${ whereCategories },
        tagged:  ${ minItems.hasOwnProperty('tagged') ? minItems.tagged  : null },
        userTagged:  ${minItems.hasOwnProperty('userTagged') ? minItems.userTagged  : null },
        commented:  ${ minItems.hasOwnProperty('commented') ? minItems.commented  : null },
        watchlisted:  ${ minItems.hasOwnProperty('watchlisted') ? minItems.watchlisted  : null },
        categoryized:  ${ minItems.hasOwnProperty('categoryized') ? minItems.categoryized  : null },
        authored:  ${ minItems.hasOwnProperty('authored') ? minItems.authored  : null },
        userAdded:  ${ minItems.hasOwnProperty('userAdded') ? minItems.userAdded  : null },
        bookmarked:  ${ minItems.hasOwnProperty('bookmarked') ? minItems.bookmarked  : null },
      }
        
    ) {
      recordsCount,
      articles {
        article_id
        article_link
        article_bookmark
        article_delete
        article_description
        article_title
        article_datepub
        article_content
        article_origin
        article_bg
        author {
            author_id
            author_name
        }
        category {
          category_id
          category_name
        }
        comments {
          comment_id
          comment_text
          user {
            user_id 
            user_name
          }
        }
        tags {
            tag_id
            tag_name
            tag_origin
        }
        watchlists {
          watchlist_id
          watchlist_name
        }

      }
        
    }
  }
`
}

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

export const CREATE_ARTICLE = gql`
    mutation createArticleMutation($input: ArticleInput!) {
      createArticle(input: $input) {
            article_id
        }
    }
`;

// export const ASSIGN_ARTICLE_EXTRAS =  gql`
//   mutation articleExtrasMutation($input: ArticleExtras) {
//     articleExtras(input: $input) {
//       article_id
//     }
// }
// `

export const CATEGORISE_ARTICLE = gql`
  mutation setCategoriseArticle($input: ArticleCategoryMutation) {
    setCategoriseArticle(input: $input) {
      article_id
    }
  }
`

export const WATCHLIST_ARTICLE = gql`
  mutation setWatchlistArticle($input: ArticleWatchlistMutation) {
    setWatchlistArticle(input: $input) {
      article_id
    }
  }
`
export const UNWATCHLIST_ARTICLE = gql`
  mutation deleteWatchlistArticle($input: ArticleWatchlistMutation) {
    deleteWatchlistArticle(input: $input) {
      article_id
    }
  }
`

export const COLOR_ARTICLE = gql`
  mutation setArticleBg($input: ArticleColorMutation) {
    setArticleBg(input: $input) {
      article_id
    }
  }
`

export const TAG_ARTICLE = gql`
  mutation setArticleTag($input: ArticleTagMutation) {
    setArticleTag(input: $input) {
      article_id
    }
  }
`