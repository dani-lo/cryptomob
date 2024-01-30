import { Suspense } from 'react'

import { GhostArticlesLoadingComponent } from '@/components/widgets/status/loading'
import { ArticlesScreenComponent } from '@/components/article/articlesScreen'

import { cnPage, utils } from "@/src/styles/classnames.tailwind"

import { getAppStaticSettings } from '@/src/store/static'

const ArticlesPage = () => {

  const appStaticSettings = getAppStaticSettings()

  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostArticlesLoadingComponent staticAppSettings={ appStaticSettings } />
        }
      >
        <ArticlesScreenComponent  />
    </Suspense>
  </div>
}

export default ArticlesPage