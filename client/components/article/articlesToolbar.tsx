import DatePicker from "react-datepicker"
import Dropdown from 'react-dropdown'
import {
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ArticlesSortby } from "@/src/queries/articleQueries"
import { cnBigIcon, cnInputText, cnTextClear, utils } from "@/src/styles/classnames.tailwind"
import { ArticlesFetchFiltersComponent } from "../widgets/fetchFilters"
import { useState } from "react"
import { SortDirection } from "@/src/helpers/sort"

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

    return <div id="toolbar">
        <div>
            <div className="flex bg-cyan-950 justify-between p-5 shadow-lg items-center toolbar">
                <div className="flex items-center ml-5">
                    <span className={ utils.cnJoin(['mr-2', cnTextClear])}>Date Range</span>
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
                    <span className={ utils.cnJoin(['mr-2', cnTextClear])}>Records</span>
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
                    <span className={ utils.cnJoin(['mr-2', cnTextClear])}>Sort By</span>
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
                    <FontAwesomeIcon
                        icon={ filters ? faChevronUp : faChevronDown }
                        className={ utils.cnJoin([cnBigIcon, 'clickable-icon']) }
                        onClick={ () => setFilters(!filters)}
                    />
                </div>
            </div>
            {
                filters ? 
                    <ArticlesFetchFiltersComponent /> : 
                    null
            }
            
        </div>

    </div>
}