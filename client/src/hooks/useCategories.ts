import { GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries"
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { gqlClient } from "@/src/utils/graphqlClient"
import { CREATE_CATEGORY, READ_CATEGORIES } from "../queries/categoryQueries"
import { CategoryApiData } from "../models/category"
import request from "graphql-request"
import { QueryFilterParams } from "../store/app"

interface CategoryInput {
    category_name: string, 
    user_id: number
}

export const useCategoriesWithArticlesCount = (params?: Partial<QueryFilterParams>) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData 
    } : UseQueryResult<{ categories: (CategoryApiData & { articles_count: number})[] }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.categories, JSON.stringify(params || {})],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_CATEGORIES(params))
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

export const useAddCategory = () => {
  const client = useQueryClient()

  return useMutation({
      mutationFn: (input: CategoryInput) => {
        return gqlClient.request(
          CREATE_CATEGORY,
          {input}
        )
      },
      onSuccess: () => {
        client.invalidateQueries([GqlCacheKeys.categories])
      },
  })
}

