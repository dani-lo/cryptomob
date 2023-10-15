import { UseQueryResult, useQuery } from "@tanstack/react-query"
import request from "graphql-request";

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import { READ_AUTHORS } from "../queries/authorQueries";
import { AuthorApiData } from "../models/author";
import { QueryFilterParams } from "../store/app";

export const useAuthorsWithArticlesCount = (params ?: Partial<QueryFilterParams>) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData 
    } : UseQueryResult<{ authors: AuthorApiData[]}> = useQuery({

        queryKey: [GqlCacheKeys.authors, JSON.stringify(params || {})],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_AUTHORS(params))
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

// export const useAddtag = () => {
    
//     const client = useQueryClient()

//     return useMutation({
//         mutationFn: (input: TagInput) => {
//         return gqlClient.request(
//             CREATE_TAG,
//             input
//         )
//         },
//         onSuccess: () => {
//             client.invalidateQueries([GqlCacheKeys.tags])
//         },
//     })
    
// }