/* eslint max-params: ["error", 4] */

import {  UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { TagApiData } from "../models/tag";

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import { CREATE_TAG, READ_TAG, UNWATCHLIST_TAG, WATCHLIST_TAG } from "../queries/tagQueries";
import { gqlClient } from "../utils/graphqlClient";
import { updateClientTagsCache } from "../helpers/reactQueryCacheUtil";
import request from "graphql-request";

interface TagInput {tag_name: string, tag_origin: string}

// export const useTagsWithArticlesCount = (
//         appId: number,
//         fetchParams: FetchParams<TagsSortby>) => {

//     const { 
//         isLoading,
//         isError,
//         error,
//         data,
//         isFetching,
//         // isPreviousData 
//     } : UseQueryResult<{ tags: (TagApiData & { articles_count: number})[] }, unknown> = useQuery({

//         queryKey: [GqlCacheKeys.tags],
//         queryFn: async () => {
//             return await request(GRAPHQL_ENDPOINT, READ_TAGS(appId))
//         },
//         keepPreviousData: true,
//         suspense: true
//     })

//     return {
//         isLoading,
//         isError,
//         error,
//         data,
//         isFetching,
//         // isPreviousData
//     }
// }

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

export const useTag = (tagId: number) => {

    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
    } : UseQueryResult<{ tag: TagApiData }> = useQuery({

        queryKey: [GqlCacheKeys.tag, tagId],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_TAG(tagId))
        },
        keepPreviousData: true
    })

    return {
        isLoading,
        isError,
        error,
        data,
        isFetching,
    }
}
