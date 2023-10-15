"use client"

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind'

import { CreateTagComponent } from '@/components/tag/createTag'
import { TagsListComponent } from '@/components/tag/tagsList'

import { useTagsWithArticlesCount } from '@/src/hooks/useTags';
 

const TagsPage = () => {
    
    const { data, isError, isLoading } = useTagsWithArticlesCount()

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

    return <div  className={ utils.cnJoin([cnPage, 'content']) }>
        <TagsListComponent tags={ data.tags} />
    </div>
}

export default TagsPage