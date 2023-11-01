import { useState } from 'react'

import { ResourceItemsCount } from '@/src/queries'

import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';

import { WatchlistApiData } from '@/src/models/watchlist'

import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch'
import { SortIconComponent } from '@/components/widgets/sortIcon';

import { ellipsys } from '@/src/helpers/ellipsys'
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort'
import Link from 'next/link';
 
type WatchlistProp = WatchlistApiData & ResourceItemsCount

export const WatchlistsListComponent = ({ watchlists } : { watchlists: WatchlistProp[] }) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof WatchlistProp, SortDirection | null]>(['watchlist_name', null])

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

    return <div>
        <div className="flex items-center justify-between">
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent onSearch={ (term: string) => {
                    if (term === '') {
                        setSearchterm(term)
                    }
                }} />
            </div>
            <div style={{ flex: 1 }}>
                <CreateWatchlistComponent />
            </div>
        </div>
        
            <table className={ cnTable.table }>
                <thead className={ cnTable.thead}>
                    <tr>
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('watchlist_name')
                        }}>
                            <div className={ cnTable.thContent}>
                                Watchlist name
                                { sortby[0] === 'watchlist_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                            
                        </th>
                        <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('articles_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Articles count
                                { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('tags_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Tags Count
                                { sortby[0] === 'tags_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        
                        <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('authors_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Authors count
                                { sortby[0] === 'authors_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        <th scope="col" className={ cnTable.th }>
                            <span className="sr-only" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    sorted.map(w => {

                        if (searchterm !== '' && w.watchlist_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                            return null
                        }

                        return <tr  key={ w.watchlist_id }>
                            <td className={ cnTable.td }>
                 
                                <span className={ cnBold }>
                                    {
                                        ellipsys(w.watchlist_name, 20)
                                    }        
                                </span> 
                            </td>
                            <td className={ cnTable.td }>
                                {
                                    `${ w.articles?.length || 0 }`
                                }
                            </td>
                            <td className={ cnTable.td }>
                                {
                                    `${ w.tags?.length || 0 }`
                                }
                            </td>
                            {/* <td className={ cnTable.td }>
                                {
                                    `${ w.categories_count || 0 }`
                                }
                            </td> */}
                            <td className={ cnTable.td }>
                                {
                                    `${ w.authors?.length || 0 }`
                                }
                            </td>
                            <td className={ cnTable.td }>
                                <Link href={ `/watchlists?watchlistId=${ w.watchlist_id }` }>view</Link>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
}