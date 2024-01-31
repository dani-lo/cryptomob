import { useEffect, useState } from "react"

import { cnInputText, utils } from "@/src/styles/classnames.tailwind"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export const InlineSearchComponent = ({ onSearch, currTerm } : { onSearch: (term: string) => void, currTerm: string }) => {

    const [searchval, setSearchval] = useState('')

    // console.log('SEARCHYYYYY searchval, currTerm', searchval, currTerm)
    useEffect(() => {
        
        const delayInputTimeoutId =  setTimeout(() => {
            if (searchval !== '') {
                onSearch(searchval);
            }
        }, 500)
        
        return () => {
            if (delayInputTimeoutId) {
                clearTimeout(delayInputTimeoutId)
            }
        }
            
      }, [searchval, currTerm, onSearch])

    return <div className="relative">
        <input 
            type="search" 
            className={ utils.cnJoin([cnInputText, 'pl-2 my-4 pr-8']) } 
            value={ searchval }
            placeholder="Refine items by label" 
            onChange={ (e) => setSearchval(e.target.value )}
        />
        <FontAwesomeIcon icon={ faSearch } style={{ marginLeft: '-26px '}}/>

    </div>
}