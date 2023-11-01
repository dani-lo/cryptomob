import { READ_ARTICLES } from "./articleQueries"
import { CREATE_COMMENT } from "./commentQueries"

export const GRAPHQL_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://cryptomob.net' : 'http://localhost:8000/graphql/'

export {
    READ_ARTICLES,
    CREATE_COMMENT
}

export interface PaginatedResult {
    recordsCount: number
}

export interface ResourceItemsCount {
    tags_count ?: number; 
    categories_count ?: number; 
    authors_count ?: number;
    articles_count ?: number;
    watchlists_count ?: number;
  }

export type PaginatedTypeResult<T> = PaginatedResult & T;

export enum GqlCacheKeys {
    'paginatedArticles' = 'paginatedArticles',
    'tags' = 'tags',
    'watchilsts' = 'watchilsts',
    'categories' = 'categories',
    'authors' = 'authors',
    'users' = 'users'
}