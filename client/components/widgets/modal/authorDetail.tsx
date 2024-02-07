import { useEffect, useRef, useState } from "react"
import Dropdown from 'react-dropdown'
import { faPerson } from "@fortawesome/free-solid-svg-icons"
import { CSSTransition } from 'react-transition-group'

import { StyledContainedBar } from "@/src/styles/main.styled"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnButton, cnParagraph, cnSectionSmallTitle, utils } from "@/src/styles/classnames.tailwind"
import { IconTitleComponent } from "../iconed"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { ItemWatchlists } from "../itemWatchlists"
import { AuthorApiData } from "@/src/models/author"
import { useUnwatchlistAuthor, useWatchlistAuthor } from "@/src/hooks/useAuthors"
import { getAppStaticSettings } from "@/src/store/static"
import { PaginationCtrl } from "@/src/utils/paginationCtrl"
import { PaginationComponent } from "../pagination"
import { stripHtml } from "@/src/helpers/strip"

const ARTICLE_PER_PAGE = 4

export const AuthorDetailModalComponent = ({
        author, 
        userId,
        onClose 
    }: { 
        author: AuthorApiData; 
        onClose: () => void; 
        userId: number;
    }) => {
    
    const { appId, bg } = getAppStaticSettings()
    
    const modRef = useRef(null)

    const { data: watchlistsData } = useWatchlistsWIthItemsCount(appId)

    const [wid, setWid] = useState<string | undefined>(undefined)
    
    const watchlistAuthorMuotation = useWatchlistAuthor()
    const unwatchlistAuthorMutation = useUnwatchlistAuthor()

    const numArticles = author?.articles?.length || 0
    
    const [articlesOffset, setArticlesOffset] = useState(0)
    
    const [act, setAct] = useState(false)

    useEffect(() => {

        const to = setTimeout(() => setAct(true), 200)

        return () => clearTimeout(to)
    }, [])

    const paginator = numArticles > ARTICLE_PER_PAGE ? new PaginationCtrl(
        numArticles,
        articlesOffset,
        ARTICLE_PER_PAGE
    ) : null

    if (!author) {
        return null
    }

    const disabledWatchlist = (watchlistID: number) => author.watchlists?.some(w => w.watchlist_id === Number(watchlistID))

    const watchlistOpts = watchlistsData?.watchlists ? watchlistsData.watchlists.map(w => {
        return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
    }) : []

    const onSetWatchlist = () => {

        watchlistAuthorMuotation.mutate({
            author_id: Number(author.author_id),
            user_id: Number(userId),
            watchlist_id: wid ? Number(wid) : 0,
        })
    }

    const onDeleteWatchlist = (watchlistId: number) => {
        
        unwatchlistAuthorMutation.mutate({
            author_id: Number(author.author_id),
            user_id: Number(userId),
            watchlist_id: watchlistId,
        })
    }
 
    return <CSSTransition
            in={ act }
            nodeRef={modRef}
            timeout={200}
            classNames="widget"
            unmountOnExit
            // onEnter={() => setShowButton(false)}
            // onExited={() => setShowButton(true)}
        >
        <div className="overlay-full p-4 bg-white" style={{ overflowY: 'scroll' }} ref={ modRef }>
            <div className="overlay-full-content rounded-lg shadow article-detail">
                <StyledContainedBar>
                    <CloseIconButtonComponent onClose={ onClose } />
                </StyledContainedBar>
                <IconTitleComponent
                    text={ author.author_name }
                    icon={ faPerson }
                    bgColor={ bg }
                />
                
                <div className="flex  p-6">
                    <div style={{ width: '400px' }}>
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
                    </div>
                    { 
                        author.watchlists?.length ? <ItemWatchlists
                            watchlists={ author.watchlists || [] }
                            title="Member of watchlists"
                            onDeleteWatchlist={ onDeleteWatchlist }
                        /> : null
                    }
                </div>
                {
                    author.articles ? 
                    <div className="p-6">
                        {
                            author.articles.map((a, i) => {

                                if (paginator && !paginator.pageItemInRange(i)) {
                                    return null
                                }

                                return <div  key={ a.article_id }>
                                <h2 className={ cnSectionSmallTitle }><a href={ a.article_link} target="_blank">{ a.article_title }</a></h2>
                                <p className={ cnParagraph }>{ stripHtml(a.article_description) }</p>
                                </div>
                            })
                        }
                    </div> : null
                }
                {
                paginator  ? 
                    <PaginationComponent 
                        paginationCtrl={ paginator } 
                        onSelectPage={ (nextOffset) => { 
                            setArticlesOffset(nextOffset)
                        }} 
                    /> 
                    : null
                }
            </div>
        </div>
    </CSSTransition>
}
