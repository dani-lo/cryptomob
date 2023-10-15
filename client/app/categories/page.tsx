"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useCategoriesWithArticlesCount } from '@/src/hooks/useCategories';

import { CreateCategoryComponent } from '@/components/category/createCategory';
import { CategoriesListComponent } from '@/components/category/categoriesList';
 

const TagsPage = () => {

    const { data, isError, isLoading } = useCategoriesWithArticlesCount()

    if (isLoading) {
        return <LoadingComponent />
      }
    
      if (isError) {
        return <ErrorComponent />
      }
    
      if (!data || !data.categories|| data.categories.length === 0) {
        return <>
            <CreateCategoryComponent />
            <EmptyComponent />
        </>
      }

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
            <CategoriesListComponent categories={ data.categories } />
        </div>
}

export default TagsPage