import { useState } from 'react'

import { ResourceItemsCount } from '@/src/queries'

import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';

import { WatchlistApiData } from '@/src/models/watchlist'

import { CreateWatchlistComponent } from '@/components/watchlists/createWatchlist';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch'
import { SortIconComponent } from '@/components/widgets/sortIcon';

import { ellipsys } from '@/src/helpers/ellipsys'
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort'
 
type WatchlistProp = WatchlistApiData & ResourceItemsCount

export const WatchlistsListComponente = ({ watchlists } : { watchlists: WatchlistProp[] }) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof WatchlistProp, SortDirection | null]>(['watchlist_name', null])

    const onSortBy = (newSortField : keyof WatchlistProp) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<WatchlistProp>(watchlists, sortby[0], sortby[1]) 

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
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('tags_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Tags Count
                                { sortby[0] === 'tags_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
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
                        {/* <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('categories_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Categories count
                                { sortby[0] === 'categories_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th> */}
                        <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('coins_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Coins count
                                { sortby[0] === 'coins_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
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
                                    `${ w.tags_count || 0 }`
                                }
                            </td>
                            <td className={ cnTable.td }>
                                {
                                    `${ w.articles_count || 0 }`
                                }
                            </td>
                            {/* <td className={ cnTable.td }>
                                {
                                    `${ w.categories_count || 0 }`
                                }
                            </td> */}
                            <td className={ cnTable.td }>
                                {
                                    `${ w.coins_count || 0 }`
                                }
                            </td>
                            <td className={ cnTable.td }>
                                <a href="#">edit</a>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
}