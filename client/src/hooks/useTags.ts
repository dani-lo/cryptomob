/* eslint max-params: ["error", 4] */

import {  UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import request from "graphql-request";

import { TagApiData } from "../models/tag";

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import { CREATE_TAG, READ_TAGS, UNWATCHLIST_TAG, WATCHLIST_TAG } from "../queries/tagQueries";
import { gqlClient } from "../utils/graphqlClient";
import { QueryFilterParams } from "../store/app";
import { updateClientTagsCache } from "../helpers/reactQueryCacheUtil";

interface TagInput {tag_name: string, tag_origin: string}

export const useTagsWithArticlesCount = (
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
    } : UseQueryResult<{ tags: (TagApiData & { articles_count: number})[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.tags],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_TAGS(appId, dateFrom, dateTo, filterParams))
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

export const useAddtag = () => {
    
    const client = useQueryClient()

    return useMutation({
        mutationFn: (input: TagInput) => {
        return gqlClient.request(
            CREATE_TAG,
            {input}
        )
        },
        onSuccess: () => {
            client.invalidateQueries([GqlCacheKeys.tags])
        },
    })
    
}

export const useWatchlistTag = () => {

    const client = useQueryClient()
  
    return useMutation({ 
        // @ts-ignore
        mutationFn: (input: { tag_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                WATCHLIST_TAG,
                { input }
            )
        },
        onSuccess: (data: { setWatchlistTag: { data: TagApiData }}) => {
            
            const returned = data.setWatchlistTag as unknown as  TagApiData

            updateClientTagsCache(client, returned)
        },
      })
}

export const useUnwatchlistTag = () => {

    const client = useQueryClient()
    
    return useMutation({ 
        // @ts-ignore
        mutationFn: (input: { tag_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                UNWATCHLIST_TAG,
                { input }
            )
        },
        onSuccess: (data: { deleteWatchlistTag: { data: TagApiData }}) => {
            
            const returned = data.deleteWatchlistTag as unknown as  TagApiData

            updateClientTagsCache(client, returned)
        },
      })
}
