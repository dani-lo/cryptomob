

import { ellipsys } from '@/src/helpers/ellipsys';
import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
import { useCallback, useContext, useState } from 'react';
import { ResourceItemsCount } from '@/src/queries';
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
import { SortIconComponent } from '../widgets/sortIcon';
import { AuthorApiData } from '@/src/models/author';
import Link from 'next/link';
import { getAppStaticSettings } from '@/src/store/static';
import { useAtom } from 'jotai';
import { PaginationCtrl } from '@/src/utils/paginationCtrl';
import { AuthorsApiDataResult } from './authorsScreen';
import { ApiParamsContext } from '@/context/apiParams.context';
import { PaginationComponent } from '../widgets/pagination';
 
export const AuthorsListComponent = ({ paginatedAuthors }: { paginatedAuthors: AuthorsApiDataResult}) => {

    const [searchterm, setSearchterm] = useState('')

    // const [sortby, setSortby] = useState<[keyof AuthorProps, SortDirection | null]>(['author_name', null])
    const [sortby, setSortby] = useState<[keyof (AuthorApiData & ResourceItemsCount), SortDirection | null]>(['author_name', null])
    
    const ctx = useContext(ApiParamsContext)

    const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.authors)

    // console.log(fetchParams)

    const onSortBy = (newSortField : keyof (AuthorApiData & ResourceItemsCount)) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<AuthorApiData & ResourceItemsCount>(
        paginatedAuthors.authors, 
        sortby[0], 
        sortby[1], 
        sortby[0] === 'articles_count' ? (t: AuthorApiData) => t.articles.length : null)

    const filtered = sorted.filter(t => {
        if (searchterm !== '' && t.author_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
            return false
        }
        return true
    })

    const paginator = new PaginationCtrl(
        filtered.length,
        fetchParams.offset,
        fetchParams.limit
    )

    const paginated = paginator.takeLocal(filtered)
    
    const appStaticSettings = getAppStaticSettings()
    const cnTableFull = cnTable(appStaticSettings.bg)

    const onSearchCb = useCallback((term: string) => {
        setSearchterm(term)
        setFetchParams({ ...fetchParams, offset: 0 })
    }, [])
    
    return <div>
        <div className="flex items-center justify-between">

            <div style={{ flex: 1 }} className='pb-4'>
                <InlineSearchComponent 
                    currTerm={ searchterm }
                    onSearch={ onSearchCb } 
                />
            </div>
        </div>
        <table className={ cnTableFull.table }>
            <thead className={ cnTableFull.thead}>
                <tr>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('author_name')
                    }}>
                        <div className={ cnTableFull.thContent}>
                            Author name
                                { sortby[0] === 'author_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                         </div>
                    </th>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('articles_count')
                    }}>
                        <div className={ cnTableFull.thContent}>
                                Articles count
                                { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                        </div>
                    </th>
                    <th scope="col" className={ cnTableFull.th }>
                        <span className="sr-only" />
                    </th>
                </tr>
            </thead>
            <tbody>
            {
                paginated.map(t => {

                    return <tr key={ t.author_name }>
                        <td className={ cnTableFull.td }>     
                  
                            <span className={ cnBold }>
                            {
                                ellipsys(t.author_name, 20)
                            }
                            </span>                 
                        </td>
                        <td className={ cnTableFull.td }>
                            {
                                `${t.articles?.length } articles`
                            }
                        </td>
                        <td className={ cnTableFull.tdAction }>
                            <Link href={ `/authors?authorId=${ t.author_id }` }>view</Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
        {
            paginator.displaySelf(filtered) ? 
                <PaginationComponent 
                    paginationCtrl={ paginator } 
                    onSelectPage={ (nextOffset) => { 
                        setFetchParams({ ...fetchParams, offset: nextOffset })
                    }} 
                /> 
                : null
        }
    </div>
}