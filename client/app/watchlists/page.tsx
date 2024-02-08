import { Suspense } from 'react'

import { WatchlistsScreenComponent } from '@/components/watchlists/watchlistsScreen'
import { GhostTabularLoader } from '@/components/widgets/status/loading'

import { getAppStaticSettings } from '@/src/store/static'
import {  cnPage, utils } from '@/src/styles/classnames.tailwind'

const WatchlistsPage = () => {

  const appStaticSettings = getAppStaticSettings()
  
  return <div  className={ utils.cnJoin([cnPage, 'content']) }> 
    <Suspense
        fallback={
          <GhostTabularLoader staticAppSettings={ appStaticSettings } section="watchlists" />
        }
      >
        <WatchlistsScreenComponent  />
      </Suspense>
  </div>
}

export default WatchlistsPage