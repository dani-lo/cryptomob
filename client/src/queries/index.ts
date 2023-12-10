import { READ_ARTICLES } from "./articleQueries"
import { CREATE_COMMENT } from "./commentQueries"

export const API_BASE = process.env.NODE_ENV === 'production' ? 'http://35.179.90.228:8080' : 'http://localhost:8080'

export const GRAPHQL_ENDPOINT = `${ API_BASE }/graphql`

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
    'paginatedTags' = 'paginatedTags',
    'paginatedAuthors' = 'paginatedAuthors',
    'tags' = 'tags',
    'tag' = 'tag',
    'watchilsts' = 'watchilsts',
    'categories' = 'categories',
    'authors' = 'authors',
    'users' = 'users',
    'comments' = 'comments',
    'etl' = 'etl',
    'meta' = 'meta'
}

