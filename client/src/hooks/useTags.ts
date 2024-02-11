/* eslint max-params: ["error", 4] */

import {  UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { TagApiData } from "../models/tag";

import { GqlCacheKeys } from "../queries";
import { CREATE_TAG, READ_TAG, READ_TAGS, UNWATCHLIST_TAG, WATCHLIST_TAG } from "../queries/tagQueries";
import { gqlClient } from "../utils/graphqlClient";
import { updateClientTagsCache } from "../helpers/reactQueryCacheUtil";
import request from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../config";
// import { FetchParams } from "../store/app";

import { useAtom } from "jotai"
import { toastAtom, toastWarning } from "../store/userAtoms"

interface TagInput {tag_name: string, tag_origin: string, app_id ?: number}

export const useTagsWithArticlesCount = (
        appId: number) => {

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
            return await request(GRAPHQL_ENDPOINT, READ_TAGS(appId))
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

// export const usePaginatedTags = ()
// const { 
//     isLoading,
//     isError,
//     data,
// } : UseQueryResult<{ paginatedTags: TagApiDataResult }, unknown> = useQuery({

//     queryKey: [GqlCacheKeys.paginatedTags, gqlCacheKey([fetchParams])],
//     queryFn: async () => {
//         return await request(
//             GRAPHQL_ENDPOINT, 
//             READ_PAGINATED_TAGS(
//               appId,
//               fetchParams.offset, 
//               fetchParams.limit,
//               TagsSortby.date,
//               SortDirection.desc
//             )
//         )
//     },
//     keepPreviousData: true,
//     suspense: true
// })

export const useAddtag = () => {
    
    const [, setToast] = useAtom(toastAtom)

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
        onError: (err: any) : void => {
            
            const thrownError = err.response?.errors[0] || null
  
            toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')
        }
    })
    
}

export const useWatchlistTag = () => {

    const [, setToast] = useAtom(toastAtom)

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
        onError: (err: any) : void => {
            
            const thrownError = err.response?.errors[0] || null
  
            toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')
        }
      })
}

export const useUnwatchlistTag = () => {

    const [, setToast] = useAtom(toastAtom)

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
        onError: (err: any) : void => {
            
            const thrownError = err.response?.errors[0] || null
  
            toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')
        }
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
