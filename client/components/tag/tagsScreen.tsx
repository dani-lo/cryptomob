"use client"

/*
eslint complexity: ["error", 30]
*/

import { useContext, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import request from 'graphql-request'
import { UseQueryResult, useQuery } from '@tanstack/react-query'


import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateTagComponent } from '@/components/tag/createTag'
import { TagsListComponent } from '@/components/tag/tagsList'
import { TagDetailModalComponent } from '@/components/widgets/modal/tagDetail'

import { READ_PAGINATED_TAGS, TagsSortby } from '@/src/queries/tagQueries'
import { GRAPHQL_ENDPOINT, GqlCacheKeys } from '@/src/queries'

import { currUserAtom } from '@/src/store/userAtoms'
import { getAppStaticSettings } from '@/src/store/static'

import { useUsers } from '@/src/hooks/useUsers'

import { TagApiData } from '@/src/models/tag' 

import { ApiParamsContext } from '@/context/apiParams.context'

import { gqlCacheKey } from '@/src/helpers/gqlCacheKey'
import { SortDirection } from '@/src/helpers/sort'

export interface TagApiDataResult {
    recordsCount: number;
    tags: TagApiDataWithArticlesCount[];
}

type  TagApiDataWithArticlesCount = TagApiData  & { articles_count: number; }

export const TagsScreenComponent = () => {

    const { data: udata } = useUsers()

    const ctx = useContext(ApiParamsContext)

    const [user, setUser] = useAtom(currUserAtom)
    const [activeTag, setActiveTag] = useState<TagApiDataWithArticlesCount | null>(null)

    const [fetchParams] = useAtom(ctx.queryParams.tags)

    const searchParams = useSearchParams()
    const router = useRouter()

    const tagId = searchParams.get('tagId')

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
    } : UseQueryResult<{ paginatedTags: TagApiDataResult }, unknown> = useQuery({
  
        queryKey: [GqlCacheKeys.paginatedTags, gqlCacheKey([fetchParams])],
        queryFn: async () => {
            return await request(
                GRAPHQL_ENDPOINT, 
                READ_PAGINATED_TAGS(
                  appId,
                  fetchParams.offset, 
                  fetchParams.limit,
                  TagsSortby.date,
                  SortDirection.desc
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
    const isEMpty = (!data || !data.paginatedTags || data.paginatedTags.tags.length === 0) 

    if (isEMpty) {
        return <>
            <CreateTagComponent />
            <EmptyComponent />
        </>
    } 
    
    const reqTag = tagId !== null ? (data?.paginatedTags.tags.find(t => Number(t.tag_id) === Number(tagId)) || null) : null

    if (data && data.paginatedTags.tags && activeTag && tagId !== null &&  Number(activeTag.tag_id) !== Number(tagId)) {

        const t = data.paginatedTags.tags.find(apiT => Number(apiT.tag_id) === Number(tagId))

        if (t) {
            setActiveTag(t)
        }
        
    } else if (data && data.paginatedTags.tags && activeTag === null &&  tagId) {

        const t = data.paginatedTags.tags.find(apiT => Number(apiT.tag_id) === Number(tagId))

        if (t) {
            setActiveTag(t)
        }
        
    } else if (reqTag && activeTag && reqTag.watchlists?.length !== activeTag.watchlists?.length) {
        setActiveTag(reqTag)
    } else if (tagId === null && !!activeTag) {
        setActiveTag(null)
    }

    return <div>
        {/* <div style={{ opacity }} className={ utils.cnJoin(['status-widget']) }>
        <p>working...</p>
    </div>  */}
        {
         activeTag ? 
            <TagDetailModalComponent 
                userId={ 1 }
                tag={ activeTag } 
                onClose={ () => {
                    // setTimeout(() => setActiveTag(null), 50)
                    router.replace('/tags')
                }} 
            /> 
            : null
        }
        <TagsListComponent paginatedTags={ data.paginatedTags} />
    </div>
    
}