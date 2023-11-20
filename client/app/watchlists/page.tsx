import { cnPage, utils } from '@/src/styles/classnames.tailwind'
import { Suspense } from 'react'
import { WatchlistsScreenComponent } from '@/components/watchlists/watchlistsScreen'

const WatchlistsPage = () => {

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <WatchlistsScreenComponent  />
      </Suspense>
  </div>
}

export default WatchlistsPage