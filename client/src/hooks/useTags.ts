import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import request from "graphql-request";

import { TagApiData } from "../models/tag";

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import { CREATE_TAG, READ_TAGS } from "../queries/tagQueries";
import { gqlClient } from "../utils/graphqlClient";
import { QueryFilterParams } from "../store/app";

interface TagInput {tag_name: string, tag_origin: string}

export const useTagsWithArticlesCount = ( params ?: Partial<QueryFilterParams>) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData 
    } : UseQueryResult<{ tags: (TagApiData & { articles_count: number})[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.tags, JSON.stringify(params || {})],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_TAGS(params))
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