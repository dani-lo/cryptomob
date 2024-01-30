"use client";

/*
eslint complexity: ["error", 30]
*/

import { useAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { AuthorDetailModalComponent } from '@/components/widgets/modal/authorDetail'

import { AuthorsListComponent } from '@/components/author/authorsLit'

import { useUsers } from '@/src/hooks/useUsers'

import { currUserAtom } from '@/src/store/userAtoms'
import { getAppStaticSettings } from '@/src/store/static'
import { AuthorApiData } from '@/src/models/author';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { GqlCacheKeys } from '@/src/queries'

import { GRAPHQL_ENDPOINT } from '@/src/config'

import { gqlCacheKey } from '@/src/helpers/gqlCacheKey'

import request from 'graphql-request'

import { ApiParamsContext } from '@/context/apiParams.context'
import { SortDirection } from '@/src/helpers/sort'
import { AuthorSortby, READ_PAGINATED_AUTHORS } from '@/src/queries/authorQueries'

export interface AuthorsApiDataResult {
  recordsCount: number;
  authors: AuthorApiDataWithArticlesCount[];
}

type  AuthorApiDataWithArticlesCount = AuthorApiData  & { articles_count: number; }


export const AuthorsScreenComponent = () => {

  const { data: udata } = useUsers()

  const ctx = useContext(ApiParamsContext)

  const [user, setUser] = useAtom(currUserAtom)

  const searchParams = useSearchParams()
  const router = useRouter()

  const [fetchParams] = useAtom(ctx.queryParams.tags)

  const authorId = searchParams.get('authorId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])
  
  const appStaticSettings = getAppStaticSettings()
  const appId = appStaticSettings.appId

  const { 
    isLoading,
    isError,
    data,
} : UseQueryResult<{ paginatedAuthors: AuthorsApiDataResult }, unknown> = useQuery({

    queryKey: [GqlCacheKeys.paginatedAuthors, gqlCacheKey([fetchParams])],
    queryFn: async () => {
        return await request(
            GRAPHQL_ENDPOINT, 
            READ_PAGINATED_AUTHORS(
              appId,
              fetchParams.offset, 
              fetchParams.limit,
              AuthorSortby.name,
              SortDirection.desc
            )
        )
    },
    keepPreviousData: true,
    suspense: true
  })

  if (isLoading) {
    return <LoadingComponent appStaticSettings={ appStaticSettings} />
  }

  if (isError) {
    return <ErrorComponent />
  }

  if (!data?.paginatedAuthors?.authors || data.paginatedAuthors.authors.length === 0) {
    return <EmptyComponent />
  }

  const reqAuthor = authorId !== null ? (data.paginatedAuthors.authors.find(apiT => Number(apiT.author_id) === Number(authorId)) || null) : null
  
  return <div>
  {
    reqAuthor ? 
      <AuthorDetailModalComponent 
          userId={ 1 }
          author={ reqAuthor } 
          onClose={ () => {
              router.replace('/authors')
          }} 
      /> 
      : null
  }
  <AuthorsListComponent paginatedAuthors={ data.paginatedAuthors } />
  </div>
}