"use client"

import { useAtom } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { WatchlistsListComponent } from '@/components/watchlists/watchlistsList';

import { getAppStaticSettings } from '@/src/store/static'
import { currUserAtom } from '@/src/store/userAtoms'

import { LoadingComponent } from '@/components//widgets/status/loading'
import { ErrorComponent } from '@/components//widgets/status/error'
import { EmptyComponent } from '@/components//widgets/status/empty'
import { WatchlistDetailModalComponent } from '@/components/widgets/modal/watchlistDetail'

import { useWatchlistsWIthItemsCount } from '@/src/hooks/useWatchlist'
import { useUsers } from '@/src/hooks/useUsers'
import { HeaderComponent } from '../header';
import { ThreePanel } from '../widgets/threePanel';
import { currPanelAtom } from '@/src/store/uiAtoms';
 
export const WatchlistsScreenComponent = () => {

    const { data: udata } = useUsers()

    const [user, setUser] = useAtom(currUserAtom)
    const [, setPanel] = useAtom(currPanelAtom)

    const searchParams = useSearchParams()
    const router = useRouter()

    const watchlistId = searchParams.get('watchlistId')

    useEffect(() => {
        if (udata?.users && user === null) {
            setUser(udata.users[0])
        }
    }, [udata, user, setUser])
    
    const appStaticSettings = getAppStaticSettings()
    const appId =  appStaticSettings.appId

    const { data, isError, isLoading } = useWatchlistsWIthItemsCount(appId)
    // return <h1>HIHIIIIIIi</h1>
    if (isLoading) {
        return <LoadingComponent appStaticSettings={ appStaticSettings } />
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

    return <ThreePanel>
        <HeaderComponent />
        <div className="qrated-ctn"> 
            <WatchlistsListComponent watchlists={ data.watchlists } />
        </div>
        {
        reqWatchlist ? 
            <WatchlistDetailModalComponent 
                watchlist={ reqWatchlist } 
                onClose={ () => {
                    setPanel('mid')
                    router.replace('/watchlists')
                }} 
            /> 
            : null
        }
    </ThreePanel>
}