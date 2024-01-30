"use client";


// import * as Tg from 'react-transition-group';

import { useSearchParams, useRouter, } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { CSSTransition } from 'react-transition-group'

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CategoryDetailModalComponent } from '@/components/widgets/modal/categoryDetail';
import { CreateCategoryComponent } from '@/components/category/createCategory'
import { CategoriesListComponent } from '@/components/category/categoriesList'

// import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useCategoriesWithArticlesCount } from '@/src/hooks/useCategories';

import { useUsers } from '@/src/hooks/useUsers';
import { currUserAtom } from '@/src/store/userAtoms';
import { getAppStaticSettings } from '@/src/store/static';

export const CategoriesScreenComponent = () => {

  const { data: udata } = useUsers()

  const [user, setUser] = useAtom(currUserAtom)
//   const [activeAuthor, setActiveAuthor] = useState<(AuthorApiData  & { articles_count: number; }) | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const modalRef = useRef(null)

  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])

  const appStaticSettings = getAppStaticSettings()
  const appId = appStaticSettings.appId
  const { data, isError, isLoading } = useCategoriesWithArticlesCount(appId)

  if (isLoading) {
      return <LoadingComponent appStaticSettings={ appStaticSettings } />
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
    // const reqCategory = data.categories.find(apiT => Number(apiT.category_id) === Number(categoryId)) 

    // const opacity = isFetching ? 1 : 0

    return <div>
      {
        reqCategory ?
            <CSSTransition
                in={ !!reqCategory }
                nodeRef={modalRef}
                timeout={1000}
                classNames="widget"
                unmountOnExit
                // onEnter={() => setShowButton(false)}
                // onExited={() => setShowButton(true)}
            >
            <div ref={ modalRef } style={{ background: 'red', width: '100%',  height: '100%'}}>
              <CategoryDetailModalComponent 
                  category={ reqCategory } 
                  onClose={ () => router.replace('/categories') } 
              /> 
            </div>
                    
            </CSSTransition> :
            null
      }
      
      {/* {
      reqCategory ? 
        <CategoryDetailModalComponent 
            category={ reqCategory } 
            onClose={ () => {
                // setTimeout(() => setActiveTag(null), 50)
                router.replace('/categories')
            }} 
        /> 
        : null
      } */}
      
        <CategoriesListComponent categories={ data.categories } />
    </div>
}