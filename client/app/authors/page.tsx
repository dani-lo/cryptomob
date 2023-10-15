"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { CreateCategoryComponent } from '@/components/category/createCategory';
import { useAuthorsWithArticlesCount } from '@/src/hooks/useAuthors';
import { AuthorsListComponent } from '@/components/author/authorsLit';
 

const TagsPage = () => {

    const { data, isError, isLoading } = useAuthorsWithArticlesCount()

    if (isLoading) {
        return <LoadingComponent />
      }
    
      if (isError) {
        return <ErrorComponent />
      }
    
      if (!data || !data.authors || data.authors.length === 0) {
        return <>
            <CreateCategoryComponent  />
            <EmptyComponent />
        </>
      }

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
            <AuthorsListComponent authors={ data.authors } />
        </div>
}

export default TagsPage