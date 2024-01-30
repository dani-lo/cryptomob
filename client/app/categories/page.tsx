import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { CategoriesScreenComponent } from '@/components/category/categoriesScreen'
import { getAppStaticSettings } from '@/src/store/static'
import { GhostTableLoadingComponent } from '@/components/widgets/status/loading'

const CategoriesPage = () => {

  const appStaticSettings = getAppStaticSettings()

  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostTableLoadingComponent staticAppSettings={ appStaticSettings } />
        }
      >
        <CategoriesScreenComponent  />
      </Suspense>
    
  </div>
}

export default CategoriesPage