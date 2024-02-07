import { CREATE_COMMENT, GqlCacheKeys } from "../queries"
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { gqlClient } from "@/src/utils/graphqlClient"
import { CommentApiData } from "../models/comment"
import request from "graphql-request"
import { READ_COMMENTS } from "../queries/commentQueries"
import { GRAPHQL_ENDPOINT } from "../config"

import { useAtom } from "jotai"
import { toastAtom, toastWarning } from "../store/userAtoms"

interface CommentInput {comment_text: string, article_id: number, user_id: number}

export const useComments = (appId: number) => {
    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } : UseQueryResult<{ comments: CommentApiData[]}> = useQuery({

        queryKey: [GqlCacheKeys.comments],
        queryFn: async () => {
            return await request(GRAPHQL_ENDPOINT, READ_COMMENTS(appId))
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


export const useAddComment = () => {

  const [, setToast] = useAtom(toastAtom)

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
      onError: (err: any) : void => {
          
          const thrownError = err.response?.errors[0] || null

          toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')
      }
  })
}
