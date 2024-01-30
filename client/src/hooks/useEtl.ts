import { GqlCacheKeys } from "../queries"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

import request from "graphql-request"
import { READ_RSS_SOURCES } from "../queries/etlQueries"

import { GRAPHQL_ENDPOINT } from '@/src/config'

export const useRssSources = (appId: number) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } : UseQueryResult<{ rssSources: { source_id: number; source_url: string; }[]}>  = useQuery({

        queryKey: [GqlCacheKeys.etl],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_RSS_SOURCES(appId))
        },
        keepPreviousData: true
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