import { Suspense } from 'react'

import { AuthorsScreenComponent } from '@/components/author/authorsScreen'
import { GhostTableLoadingComponent } from '@/components/widgets/status/loading'

import { cnPage, utils } from "@/src/styles/classnames.tailwind"

import { getAppStaticSettings } from '@/src/store/static'

const AuthorsPage = () => {
  const appStaticSettings = getAppStaticSettings()

  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostTableLoadingComponent staticAppSettings={ appStaticSettings } />
        }
      >
        <AuthorsScreenComponent  />
      </Suspense>
    
  </div>
}

export default AuthorsPage