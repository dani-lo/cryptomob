import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import request from "graphql-request";

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import { READ_AUTHORS, UNWATCHLIST_AUHTOR, WATCHLIST_AUHTOR } from "../queries/authorQueries";
import { AuthorApiData } from "../models/author";
import { QueryFilterParams } from "../store/app";
import { gqlClient } from "../utils/graphqlClient";
import { updateClientAuthorsCache } from "../helpers/reactQueryCacheUtil";

export const useAuthorsWithArticlesCount = (
        dateFrom = '2000-01-01', 
        dateTo = '2030-12-31', 
        filterParams ?: Partial<QueryFilterParams>) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData 
    } :  UseQueryResult<{ authors: (AuthorApiData & { articles_count: number})[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.authors],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_AUTHORS(dateFrom, dateTo, filterParams))
        },
        keepPreviousData: true
    })

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData
    }
}

export const useWatchlistAuthor = () => {

    const client = useQueryClient()
  
    return useMutation({ 
        // @ts-ignore
        mutationFn: (input: { author_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                WATCHLIST_AUHTOR,
                { input }
            )
        },
        onSuccess: (data: { setWatchlistAuthor: { data: AuthorApiData }}) => {
            
            const returned = data.setWatchlistAuthor as unknown as  AuthorApiData

            updateClientAuthorsCache(client, returned)
        },
      })
}

export const useUnwatchlistAuthor = () => {

    const client = useQueryClient()
    
    return useMutation({ 
        // @ts-ignore
        mutationFn: (input: { author_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                UNWATCHLIST_AUHTOR,
                { input }
            )
        },
        onSuccess: (data: { deleteWatchlistAuthor: { data: AuthorApiData }}) => {
            
            const returned = data.deleteWatchlistAuthor as unknown as  AuthorApiData            

            updateClientAuthorsCache(client, returned)
        },
      })
}
