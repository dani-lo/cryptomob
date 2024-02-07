import { GqlCacheKeys } from "../queries"
import { GRAPHQL_ENDPOINT } from '@/src/config'

import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { gqlClient } from "@/src/utils/graphqlClient"
import { CREATE_WATCHLIST, READ_WATCHLISTS } from "../queries/watchlistQueries"
import { WatchlistApiData } from "../models/watchlist"
import request from "graphql-request"

import { useAtom } from "jotai"
import { toastAtom, toastWarning } from "../store/userAtoms"

interface WatchlistInput {
  watchlist_id?: number, 
  watchlist_name: string,
  user_id: number
    app_id: number
}

export const useWatchlistsWIthItemsCount = (appId: number) => {
    
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } : UseQueryResult<{ 
        watchlists: (WatchlistApiData & { 
            articles_count: number; 
            tags_count: number; 
            categories_count: number; 
            authors_count: number; 

        })[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.watchilsts],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_WATCHLISTS(appId))
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


export const useAddWatchlist = () => {

    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()

    return useMutation({
        mutationFn: (input: WatchlistInput) => {
          return gqlClient.request(
            CREATE_WATCHLIST,
            {input}
          )
        },
        onSuccess: () => {
            client.invalidateQueries([GqlCacheKeys.watchilsts])
        },
        onError: (err: any) : void => {
            
            const thrownError = err.response?.errors[0] || null
  
            toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')
        }
    })
}

// export const useAddComment = () => {
//     return useMutation({
//         mutationFn: (text: string) => {
//           return gqlClient.request(CREATE_BOOK, {
//             text,
//           })
//         },
//         // onSuccess: () => {
//         //   queryClient.invalidateQueries(['tasks'])
//         // },
//     })
// }


