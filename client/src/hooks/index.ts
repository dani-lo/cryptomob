import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries";
import request from "graphql-request";
import { READ_COUNTS } from "../queries/metaQueries";

export interface UpdateBoolInput {
  item_id: number, val: boolean
}

export interface AppItemsCounts {
  tags_count: number;
}

export const useMeta = (appId: number) => {

  const { 
    isLoading,
    isError,
    error,
    data,
    isFetching,
    // isPreviousData 
} : UseQueryResult<{ counts: AppItemsCounts}> = useQuery({

    queryKey: [GqlCacheKeys.meta],
    queryFn: async () => {
        return await request(GRAPHQL_ENDPOINT, READ_COUNTS(appId))
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



