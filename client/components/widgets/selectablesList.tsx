import { cnInputCheckbox,  cnPayoff, cnPostscriptum, cnSectionSmallTitle } from "@/src/styles/classnames.tailwind"
import { InlineSearchComponent } from "./inlineSearch"
import { useEffect, useState } from "react"

export interface SelectableItem {
    label: string,
    value: number,
    payoff ?: string,
} 

export const CheckListComponent = ({ items, selected, onSelect }: { 
    items: SelectableItem[], 
    selected: number[], 
    onSelect: (val: number, selected: boolean) => void,
    // onUncheckAll: () => void
}) => {

    const [searched, setSearched] = useState(items)

    useEffect(() => {
        setSearched(items)
    }, [items])

    return <div>
        <InlineSearchComponent 
            onSearch={ (term: string) => {
                setSearched(items.filter(item => item.label.indexOf(term) !== -1))
            }} 
        />
        
        { 
            searched.length ?
            <ul style={{ overflowY: 'scroll', height: '280px'}}>
            {
                searched.map(item => {

                    const checked = selected.includes(item.value)
                    
                    return <li 
                        key={ item.value }
                        className="p-0 m-0"
                        style={{ marginRight: '12px' }}
                        >
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                                <p className={ cnPayoff}>
                                { item.label }
                                </p>
                                {   item.payoff ?
                                    <p className={ cnPostscriptum }>
                                        { item.payoff }
                                    </p> :
                                    null
                                }
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                    <input 
                                        checked={ checked }
                                        type="checkbox" 
                                        value={ item.value} 
                                        className={ cnInputCheckbox }
                                        onChange={ () => onSelect(Number(item.value), !checked) }
                                    />
                                </div>
                            </div>
                        </div>
                    </li>
                })
            }
            </ul> :
            <h3 className={ cnSectionSmallTitle }>Nothing to select: try to change other selected filters...</h3>
        }
    </div>
}