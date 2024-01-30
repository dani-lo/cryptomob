/* eslint max-params: ["error", 4] */

import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import request from "graphql-request";

import { GqlCacheKeys } from "../queries"

import { CREATE_AUTHOR, READ_AUTHORS, UNWATCHLIST_AUHTOR, WATCHLIST_AUHTOR } from "../queries/authorQueries";
import { AuthorApiData } from "../models/author";
import { QueryFilterParams } from "../store/app";
import { gqlClient } from "../utils/graphqlClient";
import { updateClientAuthorsCache } from "../helpers/reactQueryCacheUtil";
import { GRAPHQL_ENDPOINT } from "@/src/config"

interface AuthorInput { author_name: string }

export const useAuthorsWithArticlesCount = (
        appId: number,
        dateFrom = '2000-01-01', 
        dateTo = '2030-12-31', 
        filterParams ?: Partial<QueryFilterParams>) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } :  UseQueryResult<{ authors: (AuthorApiData & { articles_count: number})[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.authors],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_AUTHORS(appId, dateFrom, dateTo, filterParams))
        },
        keepPreviousData: true,
        suspense: true
    })

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData
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


export const useAddAuthor = (onCreate: (newAuthor: number) => void) => {
    
    const client = useQueryClient()

    return useMutation({
        mutationFn: (input: AuthorInput) => {
            return gqlClient.request(
                CREATE_AUTHOR,
                {input}
            )
        },
        onSuccess: (f: any) => {
            // console.log(f)
            onCreate(Number(f.createAuthor.author_id))
            client.invalidateQueries([GqlCacheKeys.authors])
        },
    })
    
}