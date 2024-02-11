import { useCallback, useState } from 'react'

import { ResourceItemsCount } from '@/src/queries'

import { cnBold, cnTable, utils } from '@/src/styles/classnames.tailwind';

import { WatchlistApiData } from '@/src/models/watchlist'

import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch'
import { SortIconComponent } from '@/components/widgets/sortIcon';

import { ellipsys } from '@/src/helpers/ellipsys'
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort'
import Link from 'next/link';
import { getAppStaticSettings } from '@/src/store/static';
import { useAtom } from 'jotai';
import { currPanelAtom } from '@/src/store/uiAtoms';
import { IconTitleComponent } from '../widgets/iconed';
import { faBinoculars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 
type WatchlistProp = WatchlistApiData & ResourceItemsCount

export const WatchlistsListComponent = ({ watchlists } : { watchlists: WatchlistProp[] }) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof WatchlistProp, SortDirection | null]>(['watchlist_name', null])

    const [, setPanel] = useAtom(currPanelAtom)

    const onSortBy = (newSortField : keyof WatchlistProp) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorter = (t: WatchlistApiData) => {
        
        switch (sortby[0]) {
            case 'articles_count' :
                return t.articles?.length || 0

            case 'tags_count':
                return t.tags?.length || 0

            case 'authors_count':
                return t.authors?.length || 0        
        }

        return 0
    }

    const sorted = sortItemsArray<WatchlistProp>(watchlists, sortby[0], sortby[1], sortby[0] !== 'watchlist_name' ? sorter : null) 

    const appStaticSettings = getAppStaticSettings()
    const cnTableFull = cnTable(appStaticSettings.bg)

    const onSearchCb = useCallback((term: string) => {
        setSearchterm(term)
    }, [])

    return <div className="items-list">
        <div className="flex items-center justify-between items-list-util">
            <div>
                    <InlineSearchComponent currTerm={searchterm} onSearch={ onSearchCb } />
                </div>
                <div>
                    <CreateWatchlistComponent />
                </div>
            </div>
            <table className={ cnTableFull.table }>
                <thead className={ cnTableFull.thead}>
                    <tr>
                        <th scope="col" className={ cnTableFull.th } onClick={ () => {
                            onSortBy('watchlist_name')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Watchlist name
                                { sortby[0] === 'watchlist_name' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                            </div>
                            
                        </th>
                        <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('articles_count')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Articles count
                                { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                            </div>
                        </th>
                        <th scope="col" className={ cnTableFull.th } onClick={ () => {
                            onSortBy('tags_count')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Tags Count
                                { sortby[0] === 'tags_count' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                            </div>
                        </th>
                        
                        <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('authors_count')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Authors count
                                { sortby[0] === 'authors_count' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                            </div>
                        </th>
                        <th scope="col" className={ cnTableFull.th }>
                            <span className="sr-only" />
                        </th>
                    </tr>
                </thead>
                <tbody className={ cnTableFull.tbody }>
                {
                    sorted.map(w => {

                        if (searchterm !== '' && w.watchlist_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                            return null
                        }

                        return <tr  key={ w.watchlist_id }  className={ cnTableFull.tr }>
                            <td className={ cnTableFull.td }>
                                <span className={ utils.cnJoin([cnBold, 'row-title']) }>
                                    {
                                        ellipsys(w.watchlist_name, 20)
                                    }        
                                </span> 
                                <div className="list-item-header">
                                    <IconTitleComponent
                                        text={ ellipsys(w.watchlist_name, 20) }
                                        icon={ faBinoculars }
                                        bgColor={ appStaticSettings.bg }
                                        actionLink={ `/watchlists?watchlistId=${ w.watchlist_id }` }
                                    />
                                </div>    
                            </td>
                            <td className={ cnTableFull.td }>
                                <span>
                                    <span className="inline-head">
                                        Watchlist Articles:
                                    </span>
                                    {
                                        `${ w.articles?.length || 0 }`
                                    }
                                </span>
                            </td>
                            <td className={ cnTableFull.td }>
                                <span><span className="inline-head">
                                        Watchlist Tags:
                                    </span>{
                                    `${ w.tags?.length || 0 }`
                                }</span>
                            </td>
                            {/* <td className={ cnTableFull.td }>
                                {
                                    `${ w.categories_count || 0 }`
                                }
                            </td> */}
                            <td className={ cnTableFull.td }>
                                <span><span className="inline-head">
                                        Watchlist Authors:
                                    </span>{
                                    `${ w.authors?.length || 0 }`
                                }</span>
                            </td>
                            <td className={ cnTableFull.tdAction }>
                                <Link 
                                    href={ `/watchlists?watchlistId=${ w.watchlist_id }` }
                                    onClick={ () => setPanel('right')}
                                >
                                    <FontAwesomeIcon
                                        // className={ cname }
                                        icon={ faPlus }
                                    />
                                </Link>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
}