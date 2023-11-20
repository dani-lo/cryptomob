import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { CategoriesScreenComponent } from '@/components/category/categoriesScreen'

const CategoriesPage = () => {

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <CategoriesScreenComponent  />
      </Suspense>
    
  </div>
}

export default CategoriesPage