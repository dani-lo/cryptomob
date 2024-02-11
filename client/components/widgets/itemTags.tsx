import Link from "next/link"

import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cnActionablesList, cnSectionSmallTitle } from "@/src/styles/classnames.tailwind"
import { Tag } from "@/src/models/tag"

export const ItemTags = ({ 
        tags, 
        title, 
        onDeleteTag
    }: {
        tags: Tag[]; 
        title: string; 
        onDeleteTag: (wid: number) => void; 
     }) => {

    return <div className={ cnActionablesList.div } style={{ minWidth: '300px' }}>
        <h2 className={ cnSectionSmallTitle }>{ title }</h2>
        <ul className={ cnActionablesList.ul }>
            {
                tags.map(tag => {
                    return <li 
                            key={ tag.tag_id }  
                            className={ cnActionablesList.li }>
                                <Link href={ `/watchlists?watchlistId=${ tag.tag_id }` }>{ tag.tag_name }</Link>
                                <FontAwesomeIcon
                                    icon={ faTimes }
                                    className="action-icon"
                                    onClick={ () => onDeleteTag(tag.tag_id) }
                                />
                    </li>


                })
            }
        </ul>
    </div>
}