


// "use client";

import { TagApiData } from '@/src/models/tag'
import {  ResourceItemsCount } from '@/src/queries'
import { ellipsys } from '@/src/helpers/ellipsys';
import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';
import { CreateTagComponent } from '@/components/tag/createTag';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
import { useState } from 'react';
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
import { SortIconComponent } from '../widgets/sortIcon';
 
type TagProps = TagApiData & ResourceItemsCount

export const TagsListComponent = ({ tags}: { tags: TagProps[]}) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof TagProps, SortDirection | null]>(['tag_name', null])

    const onSortBy = (newSortField : keyof TagProps) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<TagProps>(tags, sortby[0], sortby[1])

    return <div>
        <div className="flex items-center justify-between">
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent onSearch={ (term: string) => {
                        if (term === '') {
                            setSearchterm(term)
                        }
                }} />
            </div>
            <div style={{ flex: 1}}>  
                <CreateTagComponent />
            </div>
        </div>
             <table className={ cnTable.table }>
                <thead className={ cnTable.thead}>
                    <tr>
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('tag_name')
                        }}>
                            <div className={ cnTable.thContent}>
                                Tag name
                                { sortby[0] === 'tag_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('tag_origin')
                        }}>
                            <div className={ cnTable.thContent}>
                                Tag Origin
                                { sortby[0] === 'tag_origin' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        <th scope="col" className={ cnTable.th } onClick={ () => {
                            onSortBy('articles_count')
                        }}>
                            <div className={ cnTable.thContent}>
                                Count in Articles
                                { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                            </div>
                        </th>
                        <th scope="col" className={ cnTable.th }>
                            <span className="sr-only" />
                        </th>
                    </tr>
            </thead>
        <tbody>
        {
            sorted.map(t => {

                if (searchterm !== '' && t.tag_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                    return null
                }

                return <tr key={ t.tag_id }>
                    <td className={ cnTable.td }>     
         
                        <span className={ cnBold }>
                            {
                                ellipsys(t.tag_name, 20)
                            }        
                        </span>            
                    </td>
                    <td className={ cnTable.td }>
                                    {
                                        `${t.tag_origin }`
                                    }
                    </td>
                    <td className={ cnTable.td }>
                                    {
                                        `${t.articles_count } articles`
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