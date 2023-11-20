import Link from "next/link"

import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Watchlist } from "@/src/models/watchlist"

import { cnActionablesList, cnSectionSmallTitle } from "@/src/styles/classnames.tailwind"

export const ItemWatchlists = ({ 
        watchlists, 
        title, 
        onDeleteWatchlist 
    }: {
        watchlists: Watchlist[]; 
        title: string; 
        onDeleteWatchlist: (wid: number) => void; 
     }) => {

    return <div className={ cnActionablesList.div } style={{ minWidth: '300px' }}>
        <h2 className={ cnSectionSmallTitle }>{ title }</h2>
        <ul className={ cnActionablesList.ul }>
            {
                watchlists.map(watchlist => {
                    return <li 
                            key={ watchlist.watchlist_id }  
                            className={ cnActionablesList.li }>
                                <Link href={ `/watchlists?watchlistId=${ watchlist.watchlist_id }` }>{ watchlist.watchlist_name }</Link>
                                <FontAwesomeIcon
                                    icon={ faTimes }
                                    className="action-icon"
                                    onClick={ () => onDeleteWatchlist(watchlist.watchlist_id) }
                                />
                    </li>


                })
            }
        </ul>
    </div>
}