import { gql } from "graphql-request";

export enum WatchlistSortby {
  'date' = 'date',
  'article' = 'article',
  'user' = 'user',
} 

export const READ_WATCHLISTS = () => {
    
    return gql`
    {
        watchlists {
            watchlist_id
            watchlist_name,
            articles {
              article_id
              article_link
              article_title
              article_description
            }
            user {
              user_id
              user_name
            }
            tags {
                tag_id
                tag_name
                tag_origin
                articles {
                  article_id
                }
            }
            authors {
                author_id
                author_name
                articles {
                  article_id
                }
            }
            # categories {
            #     category_id
            #     category_name
            # }
      }
    }
  `
}
  

export const CREATE_WATCHLIST = gql`
    mutation createWatchlistMutation($input: WatchlistInput!) {
      createWatchlist(input: $input) {
            watchlist_id
            watchlist_name
            user {
              user_id
              user_name
            }
        }
    }
`;
