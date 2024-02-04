import { Suspense } from 'react'

import { GhostArticlesLoader } from '@/components/widgets/status/loading'
import { ArticlesScreenComponent } from '@/components/article/articlesScreen'

import { getAppStaticSettings } from '@/src/store/static'

const ArticlesPage = () => {

  const appStaticSettings = getAppStaticSettings()

  return <div> 
    
    <Suspense
        fallback={
          <GhostArticlesLoader staticAppSettings={ appStaticSettings } />
        }
      >
        <ArticlesScreenComponent  />
    </Suspense>
  </div>
}

export default ArticlesPage