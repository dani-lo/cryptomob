"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { WatchlistsListComponente } from '@/components/watchlists/watchlistsList';

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useWatchlistsWIthItemsCount } from '@/src/hooks/useWatchlist';
 

const WatchlistsPage = () => {

    const { data, isError, isLoading } = useWatchlistsWIthItemsCount ()

    if (isLoading) {
        return <LoadingComponent />
      }
    
      if (isError) {
        return <ErrorComponent />
      }
    
      if (!data || !data.watchlists || data.watchlists.length === 0) {
        return <>
            <CreateWatchlistComponent  />
            <EmptyComponent />
        </>
      }

    return <div className={ utils.cnJoin([cnPage, 'content']) }>
        <WatchlistsListComponente watchlists={ data.watchlists } />
    </div>
}

export default WatchlistsPage