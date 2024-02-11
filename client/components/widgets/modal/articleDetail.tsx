/*
eslint complexity: ["error", 30]
*/

import { useEffect, useRef, useState } from "react"
import Dropdown from 'react-dropdown'
import { CSSTransition } from 'react-transition-group'

import { useCategoriesWithArticlesCount } from "@/src/hooks/useCategories"
import { useCategoriseArticle, useTagArticle, useUntagArticle, useUnwatchlistArticle, useWatchlistArticle } from "@/src/hooks/useArticles"

import { ArticleAPiData, ArticleBase } from "@/src/models/article"

import { StyledContainedBar } from "@/src/styles/main.styled"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnBold, cnButton, cnParagraph, cnSectionSmallTitle, utils } from "@/src/styles/classnames.tailwind"
// import { timestampToDateString } from "@/src/helpers/date"
// import { Tag } from "@/src/models/tag"
import { CommentBaloonsComponent } from "@/components/comment/commentBaloons"
import { IconTitleComponent } from "../iconed"
import { faBolt, faComment, faNewspaper } from "@fortawesome/free-solid-svg-icons"
// import Link from "next/link"
import { Watchlist } from "@/src/models/watchlist"
import { Category } from "@/src/models/category"
import { ItemWatchlists } from "../itemWatchlists"
import { getAppStaticSettings } from "@/src/store/static"
import { Tag } from "@/src/models/tag"
import { useTagsWithArticlesCount } from "@/src/hooks/useTags"
import { stripHtml } from "@/src/helpers/strip"
import { later } from "@/src/helpers/later"
import { ellipsys } from "@/src/helpers/ellipsys"
import { fnCmpSortBy } from "@/src/helpers/compare"
import { TabbedHeader } from "../tabbed"
import { ItemTags } from "../itemTags"

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
                        <CloseIconButtonComponent onClose={ () => { 
                        setAct(false) 
                        later(300).then(onClose)
                    }}  />
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
    
    const [act, setAct] = useState(0)

    if (article === null) {
        return null
    }
    
    const description = stripHtml(article.article_description)

    return <div>
        <IconTitleComponent
            text={ article.article_title }
            link={ article.article_link }
            icon={ faNewspaper }
            bgColor={ bg }
        />
        <p  className={ utils.cnJoin([cnParagraph, 'my-6 mx-6']) }>
        {
            ellipsys(description, 1000)
        }
        </p>
        <TabbedHeader
            tabitems={ [
                {
                    icon: faBolt,
                    title: 'article actions',
                    idx: 0
                },
                {
                    icon: faComment,
                    title: 'article comments',
                    idx: 1
                }
            ]}
            activeTab={ act }
            onTabSelect={ (n: number) => setAct(n)}
        />
        <div className="p-4">
        {
            act === 0 ? <ArticleDetailActions
                watchlists={ watchlists?.watchlists || [] }
                categories={ categories?.categories || [] }
                tags= { tags?.tags.map(t => new Tag(t, false)) || [] }
                article={ new ArticleBase(article) }
                userId={ userId }
            /> : null
        }
        {
            act === 1 ? 
                article.comments?.length ? 
                    <CommentBaloonsComponent comments={ article.comments } /> :
                    <p className={ cnParagraph }>No comments for this article. You can add comments from the comment button within the article card toolbar</p>:
                    null 
            }
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
        const untagArticleMutation  = useUntagArticle()

        if (article === null) {
            return null
        }

        const onSetCategory = () => {

            categoriseArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                category_id: cid ? Number(cid) : 0 ,
            })
        }

        const onSetTag = () => {

            tagArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                tag_id: tid ? Number(tid) : 0 ,
            })

            setTid(undefined)
        }

        const onDeleteTag = (tagId: number) => {
            untagArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                tag_id: Number(tagId)
            })

        }
        const onSetWatchlist = () => {

            watchlistArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                watchlist_id: wid ? Number(wid) : 0,
            })
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

        const watchlistOpts = watchlists ? 
            watchlists.map(w => {
                return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
            }).sort((a,b) => fnCmpSortBy(a,b, 'label')) 
            : []

        const categoriesOpts = categories ? 
            categories.map(c => {
                return { label: c.category_name, value: `${ c.category_id }` , className: disabledCategory(c.category_id)  ? 'disabled' : ''}
            }).sort((a,b) => fnCmpSortBy(a,b, 'label')) 
            : []

        const tagOpts = tags ? 
            tags.map(t => {
                return { label: t.tag_name, value: `${ t.tag_id }` , className: disabledTag(t.tag_id)  ? 'disabled' : ''}
            }).sort((a,b) => fnCmpSortBy(a,b, 'label')) 
            : []

        console.log(tagOpts)
        
        const catSelected = !!cid
        const catChanged = (!!currentCategory && Number(currentCategory.category_id) !== Number(cid)) || (!currentCategory && catSelected)

        const wlSelected = !!wid 
        const wlChanged = wlSelected // (!!currentWatchlist && Number(currentWatchlist.watchlist_id) !== Number(wid)) || (!currentWatchlist && wlSelected)
        
        const tagSelected = !!tid
        const tagChanged = tagSelected

        return <div className=" flex justify-between">
            <div className="pr-8" style={ { flex: 1 }}>
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
            
            <div className="pr-8" style={ { flex: 1 }}>
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
                    article.tags?.length ? <ItemTags
                        tags={ article.tags || [] }
                        title="Tags List"
                        onDeleteTag={ onDeleteTag }
                    /> : null
                }
            </div>
            <div className="" style={ { flex: 1 }}>
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