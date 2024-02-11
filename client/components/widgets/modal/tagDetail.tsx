
import { useEffect, useRef, useState } from "react"
import Dropdown from 'react-dropdown'
import { CSSTransition } from 'react-transition-group'

import { StyledContainedBar } from "@/src/styles/main.styled"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnButton, cnParagraph, cnSectionSmallTitle, utils } from "@/src/styles/classnames.tailwind"
import { TagApiData } from "@/src/models/tag"
import { IconTitleComponent } from "../iconed"
import { faTags } from "@fortawesome/free-solid-svg-icons"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { useTag, useUnwatchlistTag, useWatchlistTag } from "@/src/hooks/useTags"
import { ItemWatchlists } from "../itemWatchlists"
import { getAppStaticSettings } from "@/src/store/static"
import { PaginationCtrl } from "@/src/utils/paginationCtrl"
import { PaginationComponent } from "../pagination"
import { stripHtml } from "@/src/helpers/strip"
import { ellipsys } from "@/src/helpers/ellipsys"
import { later } from "@/src/helpers/later"

const ARTICLE_PER_PAGE = 4

export const TagDetailModalComponent = ({
        tag, 
        userId,
        onClose,
        fetchOwn
    }: { 
        tag: TagApiData | undefined; 
        onClose: () => void; 
        userId: number;
        fetchOwn ?: boolean;
    }) => {
    
    const modRef = useRef(null)
    
    const [act, setAct] = useState(false)

    useEffect(() => {

        const to = setTimeout(() => setAct(true), 200)

        return () => clearTimeout(to)
    }, [])

    const {appId, bg } = getAppStaticSettings()

    const { data: watchlistsData } = useWatchlistsWIthItemsCount(appId)

    const [wid, setWid] = useState<string | undefined>(undefined)
    
    const watchlistTagMutation = useWatchlistTag()
    const unwatchlistTagMutation = useUnwatchlistTag()

    const [articlesOffset, setArticlesOffset] = useState(0)
    
    // const numArticles = tag?.articles?.length || 0

    const tData = useTag(tag?.tag_id || 0) 

    if (!tag || (fetchOwn && tData.isLoading) ) {
        return null
    }

    const articles = fetchOwn ? (tData.data?.tag?.articles || []) : (tag?.articles || [])

    const numArticles = articles.length

    const paginator = numArticles > ARTICLE_PER_PAGE ? new PaginationCtrl(
        numArticles,
        articlesOffset,
        ARTICLE_PER_PAGE
    ) : null

    const disabledWatchlist = (watchlistID: number) => tag.watchlists?.some(w => w.watchlist_id === Number(watchlistID))

    const watchlistOpts = watchlistsData?.watchlists ? watchlistsData.watchlists.map(w => {
        return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
    }) : []

    
    const onSetWatchlist = () => {

        watchlistTagMutation.mutate({
            tag_id: Number(tag.tag_id),
            user_id: Number(userId),
            watchlist_id: wid ? Number(wid) : 0,
        })
    }

    const onDeleteWatchlist = (watchlistId: number) => {

        unwatchlistTagMutation.mutate({
            tag_id: Number(tag.tag_id),
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
            <div className="overlay-full-content rounded-lg shadow">
                <StyledContainedBar>
                    <CloseIconButtonComponent onClose={ () => { 
                        setAct(false) 
                        later(300).then(onClose)
                    }}  />
                </StyledContainedBar>
                <IconTitleComponent
                    text={ tag.tag_name }
                    icon={ faTags }
                    bgColor={ bg }
                />
                {/* <h4 className={ cnSectionSubTitle}>Added by: { tag.tag_origin === 'user' ? `User` : 'System' }</h4>  */}
                <div className="flex  px-6">
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
                        tag.watchlists?.length ? <ItemWatchlists
                            watchlists={ tag.watchlists || [] }
                            title="Member of watchlists"
                            onDeleteWatchlist={ onDeleteWatchlist }
                        /> : null
                    }
                </div>
                {
                    articles ? 
                        <div className="my-2  px-6">
                            {
                                articles.map((a, i) => {

                                    if (paginator && !paginator.pageItemInRange(i)) {
                                        return null
                                    }

                                    return <div  key={ a.article_id }>
                                        <h2 className={ cnSectionSmallTitle }>
                                            <a href={ a.article_link} target="_blank">{ a.article_title }</a>
                                        </h2>
                                        <p className={ cnParagraph }>{ellipsys(stripHtml(a.article_description), 200)  }</p>
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
