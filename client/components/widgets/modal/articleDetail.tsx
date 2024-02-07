/*
eslint complexity: ["error", 30]
*/

import { useEffect, useRef, useState } from "react"
import Dropdown from 'react-dropdown'
import { CSSTransition } from 'react-transition-group'

import { useCategoriesWithArticlesCount } from "@/src/hooks/useCategories"
import { useCategoriseArticle, useTagArticle, useUnwatchlistArticle, useWatchlistArticle } from "@/src/hooks/useArticles"

import { ArticleAPiData, ArticleBase } from "@/src/models/article"

import { StyledContainedBar } from "@/src/styles/main.styled"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnBold, cnButton, cnParagraph, cnSectionSmallTitle, utils } from "@/src/styles/classnames.tailwind"
// import { timestampToDateString } from "@/src/helpers/date"
// import { Tag } from "@/src/models/tag"
import { CommentBaloonsComponent } from "@/components/comment/commentBaloons"
import { IconTitleComponent } from "../iconed"
import { faNewspaper } from "@fortawesome/free-solid-svg-icons"
// import Link from "next/link"
import { Watchlist } from "@/src/models/watchlist"
import { Category } from "@/src/models/category"
import { ItemWatchlists } from "../itemWatchlists"
import { getAppStaticSettings } from "@/src/store/static"
import { Tag } from "@/src/models/tag"
import { useTagsWithArticlesCount } from "@/src/hooks/useTags"
import { stripHtml } from "@/src/helpers/strip"

export const ArticleDetailModalComponent = ({ article, userId, onClose }: { 
        article: ArticleAPiData | null, 
        userId: number, 
        onClose: () => void }) => {

    const modRef = useRef(null)
    const [act, setAct] = useState(false)

    useEffect(() => {

        const to = setTimeout(() => setAct(true), 200)

        return () => clearTimeout(to)
    }, [])
    
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
                    <ArticleDetailComponent
                        article={ article }
                        userId={ userId}
                    />
                </div>
                
            </div>
        </CSSTransition>
}

export const ArticleDetailComponent = ({ article, userId }: { article: ArticleAPiData | null, userId: number }) => {

    const {appId, bg } = getAppStaticSettings()

    const { data: watchlists } = useWatchlistsWIthItemsCount(appId)
    const { data: categories } = useCategoriesWithArticlesCount(appId)
    const { data: tags } = useTagsWithArticlesCount(appId)
    
    if (article === null) {
        return null
    }
    
    const description = stripHtml(article.article_description)

    return <div className="flex flex-col justify-between leading-normal" style={{ display: 'flex',flexDirection: 'column',height: '100%' }}>
            <IconTitleComponent
                text={ article.article_title }
                link={ article.article_link }
                icon={ faNewspaper }
                bgColor={ bg }
            />
            <p  className={ utils.cnJoin([cnParagraph, 'my-6 mx-6']) }>
            {
                description
            }
            </p>
        <div className="flex p-6 pt-0 article-detail-content" style={{ overflowY: 'scroll', flex: 2 }}>
                
            <ArticleDetailActions
                watchlists={ watchlists?.watchlists || [] }
                categories={ categories?.categories || [] }
                tags= { tags?.tags.map(t => new Tag(t, false)) || [] }
                article={ new ArticleBase(article) }
                userId={ userId }
            />
            <div className="my-2 pl-8 article-detail-comments">
                <h5 className={cnSectionSmallTitle }>User comments</h5>
                {
                    article.comments?.length ? 
                    <CommentBaloonsComponent comments={ article.comments } />:
                    <p className={ cnParagraph }>No comments for this article. You can add comments from the comment button within the article card toolbar</p>
                }
            </div>
    </div>
            
        </div>
}

const ArticleDetailActions = ({ 
        article, 
        watchlists, 
        categories, 
        tags,
        userId
    }: {
        article: ArticleBase | null;
        watchlists: Watchlist[];
        categories: Category[];
        tags: Tag[],
        userId: number;
    }) => {

        const currentCategory = article?.category || null

        const [wid, setWid] = useState<string | undefined>(undefined)
        const [cid, setCid] = useState<string | undefined>(currentCategory ? `${currentCategory.category_id}` : undefined)
        const [tid, setTid] = useState<string | undefined>(undefined)
        
        const categoriseArticleMutation = useCategoriseArticle()
        const watchlistArticleMutation = useWatchlistArticle()
        const unwatchlistTagMutation = useUnwatchlistArticle()
        const tagArticleMutation = useTagArticle()

        if (article === null) {
            return null
        }

        const onSetCategory = () => {

            categoriseArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                category_id: cid ? Number(cid) : 0 ,
            })

            // setCid(undefined)
        }

        const onSetTag = () => {

            tagArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                tag_id: tid ? Number(tid) : 0 ,
            })

            setTid(undefined)
        }

        const onSetWatchlist = () => {

            watchlistArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                watchlist_id: wid ? Number(wid) : 0,
            })

            // setWid(undefined)
        }

        const onDeleteWatchlist = (watchlistId: number) => {

            unwatchlistTagMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                watchlist_id: watchlistId,
            })
        }

        const disabledWatchlist = (watchlistID: number) => article.watchlists?.some(w => w.watchlist_id === Number(watchlistID))
        const disabledCategory = (categoryID: number) => article.category?.category_id === categoryID
        const disabledTag = (tagID: number) => article.tags?.some(t => t.tag_id === Number(tagID))

        const watchlistOpts = watchlists ? watchlists.map(w => {
            return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
        }) : []
        const categoriesOpts = categories ? categories.map(c => {
            return { label: c.category_name, value: `${ c.category_id }` , className: disabledCategory(c.category_id)  ? 'disabled' : ''}
        }) : []
        const tagOpts = tags ? tags.map(t => {
            return { label: t.tag_name, value: `${ t.tag_id }` , className: disabledTag(t.tag_id)  ? 'disabled' : ''}
        }) : []

        const catSelected = !!cid
        const catChanged = (!!currentCategory && Number(currentCategory.category_id) !== Number(cid)) || (!currentCategory && catSelected)

        const wlSelected = !!wid 
        const wlChanged = wlSelected // (!!currentWatchlist && Number(currentWatchlist.watchlist_id) !== Number(wid)) || (!currentWatchlist && wlSelected)
        
        const tagSelected = !!tid
        const tagChanged = tagSelected

        return <div className="my-2 pr-8 sectioned">
            <div style={{ width: '300px' }}>
                <h3 className={cnSectionSmallTitle}>Watchlists: <span className={ cnBold }>{ article.watchlists?.length || 0 }</span></h3>
                <p className={ cnParagraph }>Add article to watchlist</p>
                <Dropdown 
                    options={ watchlistOpts } 
                    onChange={(opt) =>  setWid(`${ opt.value }`) } 
                    value={ wid } 
                    placeholder="Select a watchlist" 
                />
                <div className="my-4 flex">
                    <div>
                        <button 
                            className={ !wlChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ () => setWid(undefined) }
                        >Discard</button>
                    </div>
                    <div>
                        <button 
                            className={ !wlChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ onSetWatchlist }
                        >Save</button>
                    </div>
                </div>
                { 
                    article.watchlists?.length ? <ItemWatchlists
                        watchlists={ article.watchlists || [] }
                        title="Member of watchlists"
                        onDeleteWatchlist={ onDeleteWatchlist }
                    /> : null
                }
            </div>
            
            <div style={{ width: '300px' }}>
                <h3 className={cnSectionSmallTitle}>Tags: <span className={ cnBold }>{ article.tags?.length || 0 }</span></h3>
                <p className={ cnParagraph }>Add tag to article</p>
                <Dropdown 
                    options={ tagOpts } 
                    onChange={(opt) =>  setTid(`${ opt.value }`) } 
                    value={ tid } 
                    placeholder="Select a tag" 
                />
                <div className="my-4 flex">
                    <div>
                        <button 
                            className={ !tagChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ () => setWid(undefined) }
                        >Discard</button>
                    </div>
                    <div>
                        <button 
                            className={ !tagChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ onSetTag }
                        >Save</button>
                    </div>
                </div>
                { 
                    article.watchlists?.length ? <ItemWatchlists
                        watchlists={ article.watchlists || [] }
                        title="Member of watchlists"
                        onDeleteWatchlist={ onDeleteWatchlist }
                    /> : null
                }
            </div>
            <div className="my-2" style={{ width: '300px' }}>
                <h3 className={cnSectionSmallTitle}>Category: <span className={ cnBold }>{ article.category ? article.category.category_name : 'none'}</span></h3>
                <p className={ cnParagraph }>{  article.category ? 'Assign to different category' : 'Assign  category to article'}</p>
                <Dropdown 
                    options={ categoriesOpts } 
                    onChange={(opt) =>  setCid(`${ opt.value }`) } 
                    value={ cid } 
                    placeholder="Select a category" 
                />
                <div className="my-4 flex">
                    <div>
                        <button 
                            className={ !catChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ () => setCid(undefined) }
                        >Discard</button>
                    </div>
                    <div>
                        <button 
                            className={ !catChanged ? utils.disabled(cnButton) :  cnButton }
                            onClick={ onSetCategory }
                        >Save</button>
                    </div>
                </div>
            </div>
        </div>
}