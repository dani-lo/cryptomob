

import { useContext, useState } from 'react';
import { useAtom } from 'jotai';
import Link from 'next/link';

import { SortIconComponent } from '@/components/widgets/sortIcon'
import { CreateTagComponent } from '@/components/tag/createTag'
import { InlineSearchComponent } from '@/components/widgets/inlineSearch'
import { TagApiDataResult } from '@/components/tag/tagsScreen'

import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort'
import { ellipsys } from '@/src/helpers/ellipsys'

import { getAppStaticSettings } from '@/src/store/static'

import { PaginationCtrl } from '@/src/utils/paginationCtrl'

import { ApiParamsContext } from '@/context/apiParams.context'

import { TagApiData } from '@/src/models/tag'

import { ResourceItemsCount } from '@/src/queries'

import { cnBold, cnTable, utils } from '@/src/styles/classnames.tailwind'
import { PaginationComponent } from '../widgets/pagination';

export const TagsListComponent = ({ paginatedTags }: { paginatedTags: TagApiDataResult}) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof (TagApiData & ResourceItemsCount), SortDirection | null]>(['tag_name', null])
    // const [paginator, setPaginator] = useState<PaginationCtrl | null>(null)

    const ctx = useContext(ApiParamsContext)
    
    const [fetchParams, setFetchParams]  = useAtom(ctx.queryParams.tags)

    const paginator = new PaginationCtrl(
        paginatedTags.recordsCount,
        fetchParams.offset,
        fetchParams.limit
    )

    const onSortBy = (newSortField : keyof (TagApiData & ResourceItemsCount)) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
        setFetchParams({ ...fetchParams, offset: 0 })
    }

    const sorted = sortItemsArray<TagApiData & ResourceItemsCount>(paginatedTags.tags, sortby[0], sortby[1])

    const appStaticSettings = getAppStaticSettings()
    const cnTableFull = cnTable(appStaticSettings.bg)

    return <div>
        <div className="flex items-center justify-between">
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent onSearch={ (term: string) => {
                        // if (term !== '') {
                            setSearchterm(term)
                        // }
                }} />
            </div>
            <div style={{ flex: 1}}>  
                <CreateTagComponent />
            </div>
        </div>
             <table className={ cnTableFull.table }>
                <thead className={ cnTableFull.thead}>
                    <tr>
                        <th scope="col" className={ cnTableFull.th } onClick={ () => {
                            onSortBy('tag_name')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Tag name
                                { sortby[0] === 'tag_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        
                        <th scope="col" className={ cnTableFull.th } onClick={ () => {
                            onSortBy('tag_origin')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Tag Origin
                                { sortby[0] === 'tag_origin' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        <th scope="col" className={ cnTableFull.th } onClick={ () => {
                            onSortBy('articles_count')
                        }}>
                            <div className={ cnTableFull.thContent}>
                                Count in Articles
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
            sorted.map((t, i) => {

                if (searchterm !== '' && t.tag_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                    return null
                }

                if (paginator && !paginator.pageItemInRange(i + fetchParams.offset)) {
                    return null
                }

                return <tr key={ t.tag_id }>
                    <td className={ cnTableFull.td }>     
         
                        <span className={ cnBold }>
                            {
                                ellipsys(t.tag_name, 20)
                            }        
                        </span>            
                    </td>
                    <td className={ cnTableFull.td }>
                                    {
                                        `${t.tag_origin }`
                                    }
                    </td>
                    <td className={ cnTableFull.td }>
                                    {
                                        `${t.articles_count } articles`
                                    }
                    </td>
                    <td className={ utils.cnJoin([cnTableFull.tdAction]) }>
                        <Link href={ `/tags?tagId=${ t.tag_id }` }>view</Link>
                    </td>
                </tr>
            })
        }
        </tbody>
    </table>
    {
      paginator ? 
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