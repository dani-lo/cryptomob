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
import { getAppStaticSettings } from '@/src/store/static';
 
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

    const appStaticSettings = getAppStaticSettings()
    const cnTableFull = cnTable(appStaticSettings.bg)

    return <div>
        <div className="flex items-center justify-between">
            <div style={{ flex: 1, padding: '1rem' }}>
                <InlineSearchComponent 
                    onSearch={ (term: string) => {
                        // if (term !== '') {
                            setSearchterm(term)
                        // }
                    }} 
                />
            </div>
            <div style={{ flex: 1 }}>
                <CreateCategoryComponent />
            </div>
        </div>
        <table className={ cnTableFull.table }>
            <thead className={ cnTableFull.thead}>
                <tr>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('category_name')
                    }}>
                        <div className={ cnTableFull.thContent}>
                            Category name
                                { sortby[0] === 'category_name' ? <SortIconComponent sortDir={ sortby[1] } /> : null }
                         </div>
                    </th>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
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
                sorted.map(t => {

                    if (searchterm !== '' && t.category_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                        return null
                    }

                    return <tr key={ t.category_id }>
                        <td className={ cnTableFull.td }>     
                            <span className={ cnBold }>
                            {
                                ellipsys(t.category_name, 20)
                            }
                            </span>                 
                        </td>
                        <td className={ cnTableFull.td }>
                            {
                                `${t.articles_count } articles`
                            }
                        </td>
                        <td className={ cnTableFull.tdAction }>
                            <Link href={ `/categories?categoryId=${ t.category_id }` }>view</Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}