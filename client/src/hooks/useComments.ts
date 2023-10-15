import { CREATE_COMMENT, GRAPHQL_ENDPOINT, GqlCacheKeys } from "../queries"
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { gqlClient } from "@/src/utils/graphqlClient"
import { CommentApiData } from "../models/comment"
import request from "graphql-request"
import { READ_COMMENTS } from "../queries/commentQueries"

interface CommentInput {comment_text: string, article_id: number, user_id: number}

export const useComments = () => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData 
    } : UseQueryResult<{ comments: CommentApiData[]}> = useQuery({

        queryKey: [GqlCacheKeys.users],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_COMMENTS())
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


export const useAddComment = () => {
  const client = useQueryClient()

  return useMutation({
      mutationFn: (input: CommentInput) => {
        return gqlClient.request(
          CREATE_COMMENT,
          {input}
        )
      },
      onSuccess: () => {
        client.invalidateQueries([GqlCacheKeys.paginatedArticles])
      },
  })
}
