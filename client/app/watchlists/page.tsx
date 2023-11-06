"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { WatchlistsListComponent } from '@/components/watchlists/watchlistsList';
import { WatchlistDetailModalComponent } from '@/components/widgets/modal/watchlistDetail';

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useWatchlistsWIthItemsCount } from '@/src/hooks/useWatchlist';

import { useUsers } from '@/src/hooks/useUsers';
import { currUserAtom } from '@/src/store/userAtoms';

const WatchlistsPage = () => {

  const { data: udata } = useUsers()

  const [user, setUser] = useAtom(currUserAtom)

  const searchParams = useSearchParams()
  const router = useRouter()

  const watchlistId = searchParams.get('watchlistId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])
  
  const { data, isError, isLoading, isFetching } = useWatchlistsWIthItemsCount ()

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

  const reqWatchlist = watchlistId ? (data.watchlists.find(apiT => Number(apiT.watchlist_id) === Number(watchlistId)) || null) : null
  
  const opacity = isFetching ? 1 : 0

  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    <div style={{ opacity }} className={ utils.cnJoin(['status-widget']) }>
      working...
    </div> 
    {
    reqWatchlist ? 
      <WatchlistDetailModalComponent 
          watchlist={ reqWatchlist } 
          onClose={ () => {
              router.replace('/watchlists')
          }} 
      /> 
      : null
    }
    <WatchlistsListComponent watchlists={ data.watchlists } />
  </div>
}

export default WatchlistsPage