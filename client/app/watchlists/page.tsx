"use client";

import { LoadingComponent } from '@/components/widgets/status/loading'
import { ErrorComponent } from '@/components/widgets/status/error'
import { EmptyComponent } from '@/components/widgets/status/empty'
import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { WatchlistsListComponent } from '@/components/watchlists/watchlistsList';

import { cnPage, utils } from '@/src/styles/classnames.tailwind';

import { useWatchlistsWIthItemsCount } from '@/src/hooks/useWatchlist';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { useUsers } from '@/src/hooks/useUsers';
import { currUserAtom } from '@/src/store/userAtoms';
import { WatchlistDetailModalComponent } from '@/components/widgets/modal/watchlistDetail';
 

const WatchlistsPage = () => {

  const { data: udata } = useUsers()

  const [user, setUser] = useAtom(currUserAtom)
//   const [activeAuthor, setActiveAuthor] = useState<(AuthorApiData  & { articles_count: number; }) | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const watchlistId = searchParams.get('watchlistId')

  useEffect(() => {
      if (udata?.users && user === null) {
          setUser(udata.users[0])
      }
  }, [udata, user, setUser])
  
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

  const reqWatchlist = watchlistId ? (data.watchlists.find(apiT => Number(apiT.watchlist_id) === Number(watchlistId)) || null) : null
  
  
  return <div className={ utils.cnJoin([cnPage, 'content']) }>
    {
    reqWatchlist ? 
      <WatchlistDetailModalComponent 
          watchlist={ reqWatchlist } 
          onClose={ () => {
              // setTimeout(() => setActiveTag(null), 50)
              router.replace('/watchlists')
          }} 
      /> 
      : null
    }
    <WatchlistsListComponent watchlists={ data.watchlists } />
  </div>
}

export default WatchlistsPage