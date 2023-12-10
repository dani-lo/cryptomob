"use client"

import { useContext, useEffect } from 'react'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import request from 'graphql-request'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { ArticlesToolbarComponent } from "@/components/article/articlesToolbar"
import { ArticlesListComponent } from '@/components/article/articlesList'

import { ArticleAPiData } from "@/src/models/article";

import { ApiParamsContext } from '@/context/apiParams.context'

import { GRAPHQL_ENDPOINT, GqlCacheKeys } from '@/src/queries'
import { ArticlesSortby, READ_ARTICLES } from '@/src/queries/articleQueries'

import { dateToPostgresDateString } from '@/src/helpers/date'
import { gqlCacheKey } from '@/src/helpers/gqlCacheKey'
import { SortDirection } from '@/src/helpers/sort'

import { useUsers } from '@/src/hooks/useUsers'

import { currUserAtom } from '@/src/store/userAtoms'
// import { currSettingAtom } from '@/src/store/settingAtoms'
import { limitOptions } from '@/src/store/app'

import { getAppStaticSettings } from '@/src/store/static'
// import { useMeta } from '@/src/hooks'

interface ArticleApiDataResult {
  recordsCount: number;
  articles: ArticleAPiData[];
}

const sortOptions = [
  {
      label: 'Publish Date - desc',
      value: SortDirection.desc,
  },
  {
    label: 'Publish Date - asc',
    value: SortDirection.asc,
  }
]

export const ArticlesScreenComponent = () => {

  const ctx = useContext(ApiParamsContext)

  const [publicFilters] = useAtom(ctx.filterParams.articles.pub)
  const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.articles)
  const [user, setUser] = useAtom(currUserAtom)

  const { data: udata } = useUsers()

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
  } : UseQueryResult<{ paginatedArticles:ArticleApiDataResult }, unknown> = useQuery({

      queryKey: [GqlCacheKeys.paginatedArticles, gqlCacheKey([fetchParams, publicFilters])],
      queryFn: async () => {
          return await request(
              GRAPHQL_ENDPOINT, 
              READ_ARTICLES(
                appId,
                fetchParams.offset, 
                fetchParams.limit, 
                fetchParams.sortBy, 
                fetchParams.sortDir, 
                dateToPostgresDateString(fetchParams.dateFrom), 
                dateToPostgresDateString(fetchParams.dateTo), 
                publicFilters
              )
          )
      },
      keepPreviousData: true,
      suspense: true
  })

  if (isLoading) {
    return <LoadingComponent appStaticSettings={ appStaticSettings } />
  }

  if (isError) {
    return <ErrorComponent />
  }
 
  const isEMpty = (!data || !data.paginatedArticles || data.paginatedArticles.articles.length === 0) 

return <div> 
    <ArticlesToolbarComponent 
      onFromDateChange={ (date) => {
        setFetchParams({ ...fetchParams, dateFrom: date})
      }}
      onToDateChange={ (date) => {
        setFetchParams({ ...fetchParams, dateTo: date})
      }}
      onSortbyChange={ (opt: ArticlesSortby) => {
        setFetchParams({ ...fetchParams, sortBy: opt })
      }}
      onSortdirChange={ (opt: SortDirection) => {
        setFetchParams({ ...fetchParams, sortDir: opt })
      }}
      fromDate={ fetchParams.dateFrom }
      toDate={ fetchParams.dateTo }
      sortby={ fetchParams.sortBy }
      sortdir={ fetchParams.sortDir }
      sortOptions={ sortOptions }
      onLimitChange={ (opt: string) => {
        setFetchParams({ ...fetchParams, limit: Number(opt), offset: 0 })
      }}
      limitOptions={ limitOptions }
      limit={ fetchParams.limit }
    />  
    {
      !isEMpty ? <ArticlesListComponent paginatedArticles={ data.paginatedArticles } /> : null
    }
  </div>
}

