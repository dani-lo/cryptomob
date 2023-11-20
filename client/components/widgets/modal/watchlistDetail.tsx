// import { useState } from "react"
// import Dropdown from 'react-dropdown'

import { StyledContainedBar } from "@/src/styles/main.styled"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnParagraph, cnSectionSmallTitle, cnSectionTitle } from "@/src/styles/classnames.tailwind"
import { IconTitleComponent } from "../iconed"
import { faBinoculars } from "@fortawesome/free-solid-svg-icons"
// import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
// import { ItemWatchlists } from "../itemWatchlists"
import { WatchlistApiData } from "@/src/models/watchlist"
import Link from "next/link"
// import { useUnwatchlistAuthor, useWatchlistAuthor } from "@/src/hooks/useAuthors"

export const WatchlistDetailModalComponent = ({
        watchlist, 
        // userId,
        onClose 
    }: { 
        watchlist: WatchlistApiData; 
        onClose: () => void; 
        // userId: number;
    }) => {
    
        
    // const { data: watchlistsData } = useWatchlistsWIthItemsCount()

    // const [wid, setWid] = useState<string | undefined>(undefined)
    
    // const watchlistAuthorMuotation = useWatchlistAuthor()
    // const unwatchlistAuthorMutation = useUnwatchlistAuthor()

    // const disabledWatchlist = (watchlistID: number) => watchlist.watchlists?.some(w => w.watchlist_id === Number(watchlistID))

    // const watchlistOpts = watchlistsData?.watchlists ? watchlistsData.watchlists.map(w => {
    //     return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
    // }) : []

    // const onSetWatchlist = () => {

    //     watchlistAuthorMuotation.mutate({
    //         watchlist_id: Number(watchlist.watchlist_id),
    //         user_id: Number(userId),
    //         watchlist_id: wid ? Number(wid) : 0,
    //     })
    // }

    // const onDeleteWatchlist = (watchlistId: number) => {
        
    //     unwatchlistAuthorMutation.mutate({
    //         watchlist_id: Number(watchlist.watchlist_id),
    //         user_id: Number(userId),
    //         watchlist_id: watchlistId,
    //     })
    // }

    return <div className="overlay-full p-4 bg-white" style={{ overflowY: 'scroll' }}>
        <div className="overlay-full-content rounded-lg shadow article-detail">
            <StyledContainedBar>
                <CloseIconButtonComponent onClose={ onClose } />
            </StyledContainedBar>
            <IconTitleComponent
                text={ watchlist.watchlist_name }
                icon={ faBinoculars }
            />
            
            {/* <div className="my-4" style={{ borderBottom: '1px dotted black' }}>
                <p className={ cnParagraph }>Add to Watchlist</p>
                <Dropdown 
                    options={ watchlistOpts } 
                    onChange={(opt) =>  setWid(`${ opt.value }`) } 
                    value={watchlistOpts.find(wopt => wopt.value === wid) } 
                    placeholder="Select a watchlist" 
                />
                <div className="my-4 flex">
                    <div>
                        <button 
                            className={ !wid ? utils.disabled(cnButton) :  cnButton }
                            onClick={ () => setWid(undefined) }
                        >Discard</button>
                    </div>
                    <div>
                        <button 
                            className={ !wid ? utils.disabled(cnButton) :  cnButton }
                            onClick={ onSetWatchlist }
                        >Save</button>
                    </div>
                </div>
            </div> */}
            <div style={{ height: '100%' }}>
                <div  style={{ overflowY: 'scroll', height: 'calc(100% - 200px)' }}>
                {
                    watchlist.articles ? 
                        <div>
                            <h3 className={ cnSectionTitle }>Articles</h3>
                            {
                                watchlist.articles.map(a => {
                                    return <div  key={ a.article_id }>
                                    
                                    <h2 className={ cnSectionSmallTitle }><a href={ a.article_link} target="_blank">{ a.article_title }</a></h2>
                                    <p className={ cnParagraph }>{ a.article_description }</p>
                                    </div>
                                })
                            }
                        </div> : null
                }
                {
                    watchlist.authors ? 
                        <div>
                            <h3 className={ cnSectionTitle }>Authors</h3>
                            {
                                watchlist.authors.map(a => {
                                    return <div  key={ a.author_id }>
                                        <h2 className={ cnSectionSmallTitle }><Link href={ `/authors?authorId=${ a.author_id }` } target="_blank">{ a.author_name }</Link></h2>
                                        <p>{ a.articles?.length || 0 } articles</p>
                                    </div>
                                })
                            }
                        </div> : null
                }
                {
                    watchlist.tags ? 
                        <div>
                            <h3 className={ cnSectionTitle }>Tags</h3>
                            {
                                watchlist.tags.map(a => {
                                    return <div  key={ a.tag_id }>
                                        <h2 className={ cnSectionSmallTitle }><Link href={ `/tags?tagId=${ a.tag_id }` } target="_blank">{ a.tag_name }</Link></h2>
                                        <p>{ a.articles?.length || 0 } articles</p>
                                    </div>
                                })
                            }
                        </div> : null
                }
                </div>
            </div>
        </div>
    </div>
}
