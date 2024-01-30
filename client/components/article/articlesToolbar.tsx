import DatePicker from "react-datepicker"
import Dropdown from 'react-dropdown'
import {
    // faChevronDown,
    // faChevronUp,
    faFilter
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { CSSTransition } from 'react-transition-group'

import { ArticlesSortby } from "@/src/queries/articleQueries"
import { cnBigIcon, cnInputText, cnTextClear, utils } from "@/src/styles/classnames.tailwind"
import { ArticlesFetchFiltersComponent } from "../widgets/fetchFilters"
import { useContext, useRef, useState } from "react"
import { SortDirection } from "@/src/helpers/sort"
import { useAtom } from "jotai"
import { ApiParamsContext } from "@/context/apiParams.context"
import { getAppStaticSettings } from "@/src/store/static"

interface Props {
    fromDate: Date,
    toDate: Date,
    sortOptions: {
        label: string,
        value: SortDirection,
    }[],
    limitOptions: {
        label: string,
        value: string,
    }[],
    limit: number,
    sortby: ArticlesSortby;
    sortdir: SortDirection;
    onFromDateChange: (d: Date) => void;
    onToDateChange: (d: Date) => void;
    onSortbyChange: (opt: ArticlesSortby) => void;
    onSortdirChange: (opt: SortDirection) => void;
    onLimitChange: (opt: string) => void;
}

export const  ArticlesToolbarComponent = ({ 
        fromDate, 
        toDate, 
        sortOptions,
        sortdir,
        limitOptions,
        limit,
        onFromDateChange, 
        onToDateChange, 
        onSortdirChange,
        onLimitChange
    }: Props) => {
    
    const [filters, setFilters] = useState(false) 

    const ctx = useContext(ApiParamsContext)

    const filtersRef = useRef(null)

    const [protectedFilters] = useAtom(ctx?.filterParams?.articles.protect)
    const [publicFilters] = useAtom(ctx?.filterParams?.articles.pub)
    
    const publicFiltersLen = Object.keys(publicFilters.minItems).filter(d => {
        // @ts-ignore
        return !!publicFilters.minItems[d]
    }).length

    const protectedFiltersLen = Object.keys(protectedFilters.minItems).filter(d => {
        // @ts-ignore
        return !!protectedFilters.minItems[d]
    }).length

    const staticAppSettings = getAppStaticSettings()

    const unappliedFiltersLen = protectedFiltersLen - publicFiltersLen 
    const filtersBaloonCn = unappliedFiltersLen > 0 ? staticAppSettings.bgEvidence : 'bg-gray-200'
    
    return <div id="toolbar">
        <div>
            <div className={ `flex  justify-between p-5 shadow-lg items-center toolbar ${ staticAppSettings.bg }` } style={{ borderRadius: '0.25rem' }}>
                <div className="flex items-center ml-5">
                    <span className={ utils.cnJoin(['mr-2', 'text-sm', cnTextClear])}>Date Range</span>
                    <div className="mr-2">
                        <DatePicker 
                            className={ utils.cnDirectDescendant('input', cnInputText) }
                            selected={fromDate} 
                            onChange={(date) => {
                                if (date !== null) {
                                    onFromDateChange(date)
                                }
                            }} 
                        />
                    </div>
                    <div>
                        <DatePicker 
                            className={ utils.cnDirectDescendant('input', cnInputText) }
                            selected={toDate} 
                            onChange={(date) => {
                                if (date !== null) {
                                    onToDateChange(date)
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <span className={ utils.cnJoin(['mr-2', 'text-sm', cnTextClear])}>Records</span>
                    <Dropdown 
                        options={ limitOptions } 
                        onChange={(opt) => {
                            onLimitChange(opt.value)
                        }} 
                        value={ `${ limit }` } 
                        placeholder="Select an option" 
                    />
                </div>
                <div className="flex items-center">
                    <span className={ utils.cnJoin(['mr-2', 'text-sm', cnTextClear])}>Sort By</span>
                    <Dropdown 
                        options={ sortOptions } 
                        onChange={(opt) => {
                            onSortdirChange(opt.value as SortDirection)
                        }} 
                        value={ sortdir } 
                        placeholder="Select an option" 
                    />
                </div>
                <div className="mr-5">
                    <div className={ utils.cnJoin(['icon-with-baloon']) }>
                        {
                        protectedFiltersLen ? <span className={ filtersBaloonCn }>
                            {
                                protectedFiltersLen
                            }
                        </span> : null
                        }
                        
                        <FontAwesomeIcon
                            icon={ filters ? faFilter : faFilter }
                            className={ utils.cnJoin([filters ?  cnBigIcon(staticAppSettings.txtEvidence) : 'text-gray-200 text-xl', 'clickable-icon']) }
                            onClick={ () => setFilters((currStateFilters) => !currStateFilters)}
                        />
                    </div>
                </div>
            </div>
            {/* {
                filters ? 
                    <ArticlesFetchFiltersComponent /> : 
                    null
            } */}
            {/* <TransitionGroup className="todo-list"> */}

            <CSSTransition
                in={ filters }
                nodeRef={filtersRef}
                timeout={300}
                classNames="widget"
                unmountOnExit
                // onEnter={() => setShowButton(false)}
                // onExited={() => setShowButton(true)}
            >
            <div ref={ filtersRef }>
             <ArticlesFetchFiltersComponent />
            </div>
                    
            </CSSTransition>
            {/* </TransitionGroup> */}
        </div>

    </div>
}