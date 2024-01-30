import { Suspense } from 'react'

import { WatchlistsScreenComponent } from '@/components/watchlists/watchlistsScreen'
import { GhostTableLoadingComponent } from '@/components/widgets/status/loading'

import { getAppStaticSettings } from '@/src/store/static'
import {  cnPage, utils } from '@/src/styles/classnames.tailwind'

const WatchlistsPage = () => {

  const appStaticSettings = getAppStaticSettings()
  
  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostTableLoadingComponent staticAppSettings={ appStaticSettings } />
        }
      >
        <WatchlistsScreenComponent  />
      </Suspense>
  </div>
}

export default WatchlistsPage