"use client"

/*
eslint complexity: ["error", 30]
*/

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAtom } from 'jotai'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateTagComponent } from '@/components/tag/createTag'
import { TagsListComponent } from '@/components/tag/tagsList'
import { TagDetailModalComponent } from '@/components/widgets/modal/tagDetail'

import { cnPage, utils } from '@/src/styles/classnames.tailwind'

import { useTagsWithArticlesCount } from '@/src/hooks/useTags'
import { useUsers } from '@/src/hooks/useUsers'

import { currUserAtom } from '@/src/store/userAtoms'

import { TagApiData } from '@/src/models/tag' 

const TagsPage = () => {

    const { data: udata } = useUsers()

    const [user, setUser] = useAtom(currUserAtom)
    const [activeTag, setActiveTag] = useState<(TagApiData  & { articles_count: number; }) | null>(null)

    const searchParams = useSearchParams()
    const router = useRouter()

    const tagId = searchParams.get('tagId')

    useEffect(() => {
        if (udata?.users && user === null) {
            setUser(udata.users[0])
        }
    }, [udata, user, setUser])

    const { data, isError, isLoading, isFetching } = useTagsWithArticlesCount()

    if (isLoading) {
        return <LoadingComponent />
    }

    if (isError) {
    return <ErrorComponent />
    }

    if (!data || !data.tags || data.tags.length === 0) {
        return <>
            <CreateTagComponent />
            <EmptyComponent />
        </>
    } 
    
    const reqTag = tagId !== null ? (data?.tags.find(t => Number(t.tag_id) === Number(tagId)) || null) : null

    if (data && data.tags && activeTag && tagId !== null &&  Number(activeTag.tag_id) !== Number(tagId)) {

        const t = data.tags.find(apiT => Number(apiT.tag_id) === Number(tagId))

        if (t) {
            setActiveTag(t)
        }
        
    } else if (data && data.tags && activeTag === null &&  tagId) {

        const t = data.tags.find(apiT => Number(apiT.tag_id) === Number(tagId))

        if (t) {
            setActiveTag(t)
        }
        
    } else if (reqTag && activeTag && reqTag.watchlists?.length !== activeTag.watchlists?.length) {
        setActiveTag(reqTag)
    } else if (tagId === null && !!activeTag) {
        setActiveTag(null)
    }

    const opacity = isFetching ? 1 : 0

    return <div  className={ utils.cnJoin([cnPage, 'content']) }>
        <div style={{ opacity }} className={ utils.cnJoin(['status-widget']) }>
            working...
          </div> 
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
        <TagsListComponent tags={ data.tags} />
    </div>
    
}

export default TagsPage