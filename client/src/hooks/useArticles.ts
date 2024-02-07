import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "../utils/graphqlClient";
import { request } from 'graphql-request'

import { READ_ARTICLES, GqlCacheKeys } from '@/src/queries'

import { GRAPHQL_ENDPOINT } from '@/src/config'

import { ArticleAPiData } from "../models/article";
import { dateToPostgresDateString } from "../helpers/date";
import { ArticlesSortby, BOOKMARK_ARTICLE, CATEGORISE_ARTICLE, COLOR_ARTICLE, CREATE_ARTICLE, DELETE_ARTICLE, TAG_ARTICLE, UNWATCHLIST_ARTICLE, WATCHLIST_ARTICLE } from "../queries/articleQueries";
import { FetchParams, QueryFilterParams } from "../store/app";

import { UpdateBoolInput } from ".";
import { AppColor } from "@/components/widgets/colorPicker";
import { useAtom } from "jotai";
import { toastAtom, toastWarning } from "../store/userAtoms";

interface ArticleApiDataResult {
    recordsCount: number;
    articles: ArticleAPiData[];
}

interface ArticleInput {
    article_id?: number;
    article_title: string;
    article_link: string;
    article_description: string; 
    app_id: number;
    author_id: number;
}

export const usePaginatedArticles = (
        appId: number,
        params: FetchParams<ArticlesSortby>, 
        filters: Partial<QueryFilterParams>,
        cacheKey: string
        // eslint-disable-next-line max-params 
    ) => {

    const {
        offset,
        limit,
        sortBy,
        sortDir,
        dateFrom,
        dateTo
    } = params 
    
    const fromStr = dateToPostgresDateString(dateFrom)
    const toStr = dateToPostgresDateString(dateTo)

    const { 
        isLoading,
        isError,
        error,
        data,
        isFetching,
        // isPreviousData 
    } : UseQueryResult<{ paginatedArticles:ArticleApiDataResult }, unknown> = useQuery({

        queryKey: [GqlCacheKeys.paginatedArticles, cacheKey],
        queryFn: async () => {
            return await request(
                GRAPHQL_ENDPOINT, 
                READ_ARTICLES(appId, offset, limit, sortBy, sortDir, fromStr, toStr, filters)
            )
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

export const useBookmarkArticle = () => {
    
    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: UpdateBoolInput) => {

            return gqlClient.request(
                BOOKMARK_ARTICLE,
                {input }
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

export const useDeleteArticle = () => {

    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()
  
    return useMutation({
        mutationFn: (input: UpdateBoolInput) => {
            return gqlClient.request(
                DELETE_ARTICLE,
                { input }
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

export const useAddArticle = (onCreate: (newArticle: number) => void, onErrorCustom: (err: any) => void) => {
    
    const [, setToast] = useAtom(toastAtom)
    
    const client = useQueryClient()
  
    return useMutation({
        mutationFn: (input: ArticleInput) => {
            return gqlClient.request(
                CREATE_ARTICLE,
                { input }
            )
        },
        onSuccess: (f: any) => {
            onCreate(f.createArticle.article_id)
            client.invalidateQueries([GqlCacheKeys.paginatedArticles])
        },
        onError: (err: any) : void => {
            
            const thrownError = err.response?.errors[0] || null

            toastWarning(setToast, thrownError?.message ? thrownError.message : 'An error occurred')

            onErrorCustom(err)
        }
      })
}

export const useArticlesDomains = () => {
    const client = useQueryClient()
  
    return useMutation({
        mutationFn: (input: ArticleInput) => {
            return gqlClient.request(
                CREATE_ARTICLE,
                { input }
            )
        },
        onSuccess: () => {
            client.invalidateQueries([GqlCacheKeys.paginatedArticles])
        },
      })
}


export const useCategoriseArticle = () => {

    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: { article_id: number; user_id: number; category_id: number; }) => {
            return gqlClient.request(
                CATEGORISE_ARTICLE,
                { input }
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


export const useWatchlistArticle = () => {

    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: { article_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                WATCHLIST_ARTICLE,
                { input }
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

export const useUnwatchlistArticle = () => {

    const [, setToast] = useAtom(toastAtom)

    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: { article_id: number; user_id: number; watchlist_id: number; }) => {
            return gqlClient.request(
                UNWATCHLIST_ARTICLE,
                { input }
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

export const useColorArticle = () => {

    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: { color: AppColor, article_id: number }) => {
            
            return gqlClient.request(
                COLOR_ARTICLE             ,
                { input }
            )
        },
        onSuccess: () => {
            client.invalidateQueries([GqlCacheKeys.paginatedArticles])
        },
      })
}

export const useTagArticle = () => {

    const [, setToast] = useAtom(toastAtom)
    
    const client = useQueryClient()
  
    return useMutation({ 
        mutationFn: (input: { article_id: number; user_id: number; tag_id: number; }) => {
            return gqlClient.request(
                TAG_ARTICLE,
                { input }
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