import { Suspense } from 'react'

import { AuthorsScreenComponent } from '@/components/author/authorsScreen'
import { GhostTabularLoader } from '@/components/widgets/status/loading'

import { cnPage, utils } from "@/src/styles/classnames.tailwind"

import { getAppStaticSettings } from '@/src/store/static'

const AuthorsPage = () => {
  const appStaticSettings = getAppStaticSettings()

  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    
    <div>
    <Suspense
        fallback={
          <GhostTabularLoader staticAppSettings={ appStaticSettings } section="authors" />
        }
      >
        <AuthorsScreenComponent  />
      </Suspense>
    </div>
  </div>
}

export default AuthorsPage