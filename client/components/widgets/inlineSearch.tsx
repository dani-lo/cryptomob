import { useEffect, useState } from "react"

import { cnInputText, utils } from "@/src/styles/classnames.tailwind"

export const InlineSearchComponent = ({ onSearch } : { onSearch: (term: string) => void }) => {

    const [searchval, setSearchval] = useState('')

    useEffect(() => {

        const delayInputTimeoutId = setTimeout(() => {
            onSearch(searchval);
        }, 500)
        
        return () => clearTimeout(delayInputTimeoutId);
      }, [searchval, onSearch])

    return <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
            type="search" 
            className={ utils.cnJoin([cnInputText, 'pl-8 my-4']) } 
            value={ searchval }
            placeholder="Refine items by label" 
            onChange={ (e) => setSearchval(e.target.value )}
        />
    </div>
}