"use client"
import {  Suspense } from 'react'

import { cnPage, utils } from '@/src/styles/classnames.tailwind' 
import { getAppStaticSettings } from '@/src/store/static'

import { GhostArticlesLoader } from '@/components/widgets/status/loading'
import { EtlScreenComponent } from '@/components/etl/etlScreen'

const EtlPage = () => {
    
    const appStaticSettings = getAppStaticSettings()

    return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostArticlesLoader staticAppSettings={ appStaticSettings } />
        }
      >
        <EtlScreenComponent  />
      </Suspense>
  </div>
}

export default EtlPage