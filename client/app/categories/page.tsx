"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useCategoriesWithArticlesCount } from '@/src/hooks/useCategories';

import { CreateCategoryComponent } from '@/components/category/createCategory';
import { CategoriesListComponent } from '@/components/category/categoriesList';
import { useUsers } from '@/src/hooks/useUsers';
import { useAtom } from 'jotai';
import { currUserAtom } from '@/src/store/userAtoms';
import { useSearchParams, useRouter, } from 'next/navigation';
import { useEffect } from 'react';
import { CategoryDetailModalComponent } from '@/components/widgets/modal/categoryDetail';
 

const TagsPage = () => {

  const { data: udata } = useUsers()

  const [user, setUser] = useAtom(currUserAtom)
//   const [activeAuthor, setActiveAuthor] = useState<(AuthorApiData  & { articles_count: number; }) | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])

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
    
      const reqCategory = categoryId ? (data.categories.find(apiT => Number(apiT.category_id) === Number(categoryId)) || null) : null 

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
          {
          reqCategory ? 
            <CategoryDetailModalComponent 
                category={ reqCategory } 
                onClose={ () => {
                    // setTimeout(() => setActiveTag(null), 50)
                    router.replace('/categories')
                }} 
            /> 
            : null
          }
            <CategoriesListComponent categories={ data.categories } />
        </div>
}

export default TagsPage