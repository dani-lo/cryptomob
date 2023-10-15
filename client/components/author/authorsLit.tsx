

import { ellipsys } from '@/src/helpers/ellipsys';
import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
import { useState } from 'react';
import { ResourceItemsCount } from '@/src/queries';
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
import { SortIconComponent } from '../widgets/sortIcon';
import { AuthorApiData } from '@/src/models/author';
 
type AuthorProps = AuthorApiData & ResourceItemsCount

export const AuthorsListComponent = ({ authors }: { authors: AuthorProps[]}) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof AuthorProps, SortDirection | null]>(['author_name', null])

    const onSortBy = (newSortField : keyof AuthorProps) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<AuthorProps>(
        authors, 
        sortby[0], 
        sortby[1], 
        sortby[0] === 'articles_count' ? (t: AuthorApiData) => t.articles.length : null)

    return <div>
        <div className="flex items-center justify-between">
            {/* <div style={{ flex: 1 }}>
                <CreateCategoryComponent />
            </div> */}
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent 
                    onSearch={ (term: string) => {
                        if (term === '') {
                            setSearchterm(term)
                        }
                    }} 
                />
            </div>
        </div>
        <table className={ cnTable.table }>
            <thead className={ cnTable.thead}>
                <tr>
                    <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('author_name')
                    }}>
                        <div className={ cnTable.thContent}>
                            Autrho name
                                { sortby[0] === 'author_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
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
                    <th scope="col" className={ cnTable.th }>
                        <span className="sr-only" />
                    </th>
                </tr>
            </thead>
            <tbody>
            {
                sorted.map(t => {

                    if (searchterm !== '' && t.author_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                        return null
                    }

                    return <tr key={ t.author_name }>
                        <td className={ cnTable.td }>     
                  
                            <span className={ cnBold }>
                            {
                                ellipsys(t.author_name, 20)
                            }
                            </span>                 
                        </td>
                        <td className={ cnTable.td }>
                            {
                                `${t.articles?.length } articles`
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