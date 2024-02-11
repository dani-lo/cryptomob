"use client"

import { useContext, useEffect, useState } from 'react'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import request from 'graphql-request'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { ArticlesToolbarComponent } from "@/components/article/articlesToolbar"
import { ArticlesListComponent } from '@/components/article/articlesList'

import { ArticleAPiData } from "@/src/models/article";

import { ApiParamsContext } from '@/context/apiParams.context'

import { GqlCacheKeys } from '@/src/queries'
import { ArticlesSortby, READ_ARTICLES } from '@/src/queries/articleQueries'

import { GRAPHQL_ENDPOINT } from '@/src/config'

import { dateToPostgresDateString } from '@/src/helpers/date'
import { gqlCacheKey } from '@/src/helpers/gqlCacheKey'
import { SortDirection } from '@/src/helpers/sort'

import { useUsers } from '@/src/hooks/useUsers'

import { currUserAtom } from '@/src/store/userAtoms'
import { limitOptions } from '@/src/store/app'

import { getAppStaticSettings } from '@/src/store/static'
import { useWatchlistsWIthItemsCount } from '@/src/hooks/useWatchlist'
import { useCategoriesWithArticlesCount } from '@/src/hooks/useCategories'
import { useTagsWithArticlesCount } from '@/src/hooks/useTags'
import { HeaderComponent } from '../header'
import { ThreePanel } from '../widgets/threePanel'
import { ArticleDetailModalComponent } from '../widgets/modal/articleDetail'
import { currPanelAtom } from '@/src/store/uiAtoms'
import { TagDetailModalComponent } from '../widgets/modal/tagDetail'
import { TagApiData } from '@/src/models/tag'
import { AuthorDetailModalComponent } from '../widgets/modal/authorDetail'
import { AuthorApiData } from '@/src/models/author'


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
  const [, setPanel] = useAtom(currPanelAtom)

  const [selectedArticle, setSelectedArticle] = useState(0)
  const [selectedArticleTag, setSelectedArticleTag] = useState(0)
  const [selectedArticleAuthor, setSelectedArticleAuthor] = useState(0)

  const appStaticSettings = getAppStaticSettings()
  const appId = appStaticSettings.appId

  useWatchlistsWIthItemsCount(appId)
  useCategoriesWithArticlesCount(appId)
  useTagsWithArticlesCount(appId)

  const { data: udata } = useUsers()

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])

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

  
  const allTags = data.paginatedArticles.articles.reduce((acc: TagApiData[], curr) => {

    const c = acc.concat(curr.tags)
    return c
  }, [])

  const allAuthors = data.paginatedArticles.articles.reduce((acc: AuthorApiData[], curr) => {

    if (curr.author) {
      acc.push(curr.author)
    }

    return acc
  }, [])

  const activeArticle = data.paginatedArticles.articles.find(a => a.article_id === selectedArticle)
  const activeTag = allTags.find(a => a.tag_id === selectedArticleTag)
  const activeAuthor = allAuthors.find(a => a.author_id === selectedArticleAuthor)

  return <ThreePanel> 
      <HeaderComponent />
      <div className="qrated-ctn"> 
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
          !isEMpty ? 
          <ArticlesListComponent 
            paginatedArticles={ data.paginatedArticles }  
            selectArticle={ (id: number) => {
              setSelectedArticle(id)
              setPanel('right')
             }} 
             selectArticleTag={ (id: number) => {
              setSelectedArticleTag(id)
              setPanel('right')
             }} 
             selectArticleAuthor={ (id: number) => {
              setSelectedArticleAuthor(id)
              setPanel('right')
             }}
          /> : null
        }
    </div>
    {
        selectedArticle ? 
            <ArticleDetailModalComponent
                article={ activeArticle || null } 
                userId={ user?.user_id || 0 } 
                onClose={ () => {
                  setPanel('mid')
                  setSelectedArticle(0) 
                }}
            /> : 
        selectedArticleTag ? 
            <TagDetailModalComponent 
              userId={ user?.user_id || 0 } 
              tag={ activeTag } 
              fetchOwn={ true }
              onClose={ () => {
                  setPanel('mid')
                  setSelectedArticleTag(0)

              }} 
            /> : 
        selectedArticleAuthor ?
            <AuthorDetailModalComponent 
              userId={ user?.user_id || 0 } 
              author={ activeAuthor || null } 
              onClose={ () => {
                  setPanel('mid')
                  setSelectedArticleAuthor(0)

              }} 
            /> : 
            null

    }
  </ThreePanel>

}

