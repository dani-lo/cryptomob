import { ellipsys } from '@/src/helpers/ellipsys';
import { cnBold, cnTable, utils } from '@/src/styles/classnames.tailwind';
import { InlineSearchComponent } from '@/components/widgets/inlineSearch';
import { useCallback, useState } from 'react';
import { CategoryApiData } from '@/src/models/category';
import { CreateCategoryComponent } from './createCategory';
import { ResourceItemsCount } from '@/src/queries';
import { SortDirection, nextSortDirection, sortItemsArray } from '@/src/helpers/sort';
import { SortIconComponent } from '../widgets/sortIcon';
import Link from 'next/link';
import { getAppStaticSettings } from '@/src/store/static';
import { IconTitleComponent } from '../widgets/iconed';
import { faClone, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAtom } from 'jotai';
import { currPanelAtom } from '@/src/store/uiAtoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 
type CategoryProps = CategoryApiData & ResourceItemsCount

export const CategoriesListComponent = ({ categories}: { categories: CategoryProps[]}) => {

    const [searchterm, setSearchterm] = useState('')
    const [sortby, setSortby] = useState<[keyof CategoryProps, SortDirection | null]>(['category_name', null])
    
    const [, setPanel] = useAtom(currPanelAtom)

    const onSortBy = (newSortField : keyof CategoryProps) => {

        const currSortDir = sortby[1]
        const currSortField = sortby[0]

        const sortDir = currSortField === newSortField ? nextSortDirection(currSortDir) : SortDirection.desc
        
        setSortby([newSortField , sortDir])
    }

    const sorted = sortItemsArray<CategoryProps>(categories, sortby[0], sortby[1])

    const appStaticSettings = getAppStaticSettings()
    const cnTableFull = cnTable(appStaticSettings.bg)

    const onSearchCb = useCallback((term: string) => {
        setSearchterm(term)
        // setFetchParams({ ...fetchParams, offset: 0 })
    }, [])

    return <div className="items-list">
        <div className="flex items-center justify-between items-list-util">
            <div>
                <InlineSearchComponent 
                    currTerm={searchterm}
                    onSearch={ onSearchCb } 
                />
            </div>
            <div>
                <CreateCategoryComponent />
            </div>
        </div>
        <table className={ cnTableFull.table }>
            <thead className={ cnTableFull.thead}>
                <tr className={ cnTableFull.tr}>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('category_name')
                    }}>
                        <div className={ cnTableFull.thContent}>
                            Category name
                                { sortby[0] === 'category_name' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                         </div>
                    </th>
                    <th scope="col" className={ cnTableFull.th }onClick={ () => {
                            onSortBy('articles_count')
                    }}>
                        <div className={ cnTableFull.thContent}>
                                Count in Articles
                                { sortby[0] === 'articles_count' ? <SortIconComponent sortDir={ sortby[1] } /> : <SortIconComponent sortDir={ null } />  }
                        </div>
                    </th>
                    <th scope="col" className={ cnTableFull.th }>
                        <span className="sr-only" />
                    </th>
                </tr>
            </thead>
            <tbody  className={ cnTableFull.tbody}>
            {
                sorted.map(t => {

                    if (searchterm !== '' && t.category_name.toLowerCase().indexOf(searchterm.toLowerCase()) === -1) {
                        return null
                    }

                    return <tr key={ t.category_id }  className={ cnTableFull.tr}>
                        <td className={ cnTableFull.td }>     
                            <span className={ utils.cnJoin([cnBold, 'row-title']) }>
                            {
                                ellipsys(t.category_name, 20)
                            }
                            </span>        
                            <div className="list-item-header">
                                <IconTitleComponent
                                    text={ ellipsys(t.category_name, 20) }
                                    icon={ faClone }
                                    bgColor={ appStaticSettings.bg }
                                />
                            </div>           
                        </td>
                        <td className={ cnTableFull.td }>
                            <span>
                                {
                                    `${t.articles_count } articles`
                                }
                            </span>
                        </td>
                        <td className={ cnTableFull.tdAction }>
                            <span>
                                <Link 
                                    href={ `/categories?categoryId=${ t.category_id }` }
                                    onClick={ () => setPanel('right')}
                                >
                                    <FontAwesomeIcon
                                        // className={ cname }
                                        icon={ faPlus }
                                    />
                                </Link>
                            </span>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}