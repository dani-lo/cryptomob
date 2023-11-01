import { ellipsys } from '@/src/helpers/ellipsys';
import { cnBold, cnTable } from '@/src/styles/classnames.tailwind';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
import { useState } from 'react';
import { CategoryApiData } from '@/src/models/category';
import { CreateCategoryComponent } from './createCategory';
import { ResourceItemsCount } from '@/src/queries';
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
import { SortIconComponent } from '../widgets/sortIcon';
import Link from 'next/link';
 
type CategoryProps = CategoryApiData & ResourceItemsCount

export const CategoriesListComponent = ({ categories}: { categories: CategoryProps[]}) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof CategoryProps, SortDirection | null]>(['category_name', null])

    const onSortBy = (newSortField : keyof CategoryProps) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<CategoryProps>(categories, sortby[0], sortby[1])

    return <div>
        <div className="flex items-center justify-between">
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent 
                    onSearch={ (term: string) => {
                        if (term === '') {
                            setSearchterm(term)
                        }
                    }} 
                />
            </div>
            <div style={{ flex: 1 }}>
                <CreateCategoryComponent />
            </div>
        </div>
        <table className={ cnTable.table }>
            <thead className={ cnTable.thead}>
                <tr>
                    <th scope="col" className={ cnTable.th }onClick={ () => {
                            onSortBy('category_name')
                    }}>
                        <div className={ cnTable.thContent}>
                            Category name
                                { sortby[0] === 'category_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                         </div>
                    </th>
                    <th scope="col" className={ cnTable.th }onClick={ () => {
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

                    if (searchterm !== '' && t.category_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                        return null
                    }

                    return <tr key={ t.category_id }>
                        <td className={ cnTable.td }>     
                            <span className={ cnBold }>
                            {
                                ellipsys(t.category_name, 20)
                            }
                            </span>                 
                        </td>
                        <td className={ cnTable.td }>
                            {
                                `${t.articles_count } articles`
                            }
                        </td>
                        <td className={ cnTable.td }>
                            <Link href={ `/categories?categoryId=${ t.category_id }` }>view</Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}