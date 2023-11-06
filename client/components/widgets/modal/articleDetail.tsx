/*
eslint complexity: ["error", 30]
*/

import { useState } from "react"
import Dropdown from 'react-dropdown'
 
import { useCategoriesWithArticlesCount } from "@/src/hooks/useCategories"
import { useCategoriseArticle, useUnwatchlistArticle, useWatchlistArticle } from "@/src/hooks/useArticles"

import { ArticleBase } from "@/src/models/article"

import { StyledContainedBar } from "@/src/styles/main.styled"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnBold, cnButton, cnParagraph, cnPayoff, cnSectionSmallTitle, cnTag, utils } from "@/src/styles/classnames.tailwind"
import { timestampToDateString } from "@/src/helpers/date"
import { Tag } from "@/src/models/tag"
import { CommentBaloonsComponent } from "@/components/comment/commentBaloons"
import { IconTitleComponent } from "../iconed"
import { faNewspaper } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { Watchlist } from "@/src/models/watchlist"
import { Category } from "@/src/models/category"
import { ItemWatchlists } from "../itemWatchlists"

export const ArticleDetailModalComponent = ({ article, userId, onClose }: { article: ArticleBase, userId: number, onClose: () => void }) => {

    console.log('Articl(artigeDetailModalComponent')
    console.log(article.article_id)

    return <div className="overlay-full p-4 bg-white" style={{ overflowY: 'scroll' }}>
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
}

export const ArticleDetailComponent = ({ article, userId }: { article: ArticleBase, userId: number }) => {

    const { data: watchlists } = useWatchlistsWIthItemsCount()
    const { data: categories } = useCategoriesWithArticlesCount()

    const uniqueTags = article.tags.reduce((acc: Tag[], curr: Tag) => {

        if (acc.find(d => d.tag_id === curr.tag_id)) {
            return acc
        }

        acc.push(curr)

        return acc
    }, [])

    const description = article.article_description.replace(/(&nbsp;|<([^>]+)>)/ig, "")

    return <div className="flex flex-col justify-between px-4 leading-normal" style={{ display: 'flex',flexDirection: 'column',height: '100%' }}>
            <div>
                <IconTitleComponent
                    text={ article.article_title }
                    link={ article.article_link }
                    icon={ faNewspaper }
                />
                <p  className={ cnParagraph }>
                {
                    description
                }
                </p>
                <p className={ cnParagraph }>By: <a href="">{ article.author?.author_name || 'Unknown Author' }</a>, { timestampToDateString(Number(article.article_datepub), true) }</p>
                
                <p className="flex flex-wrap items-baseline my-4" style={{ maxHeight: '100px',  overflowY: 'scroll'}}>
                    { uniqueTags.length > 0 ?

                        uniqueTags.map(tag => {
                            return <span className={ cnTag } key={ tag.tag_id }><Link href={ `/tags?tagId=${ tag.tag_id }` }>{ tag.tag_name }</Link></span>
                        }) :

                        <span className={ cnPayoff }>No Tags AVaialble for this article</span>
                    }
                </p>
            </div>
            <div className="flex" style={{ overflowY: 'scroll', flex: 2 }}>
                <ArticleDetailActions
                    watchlists={ watchlists?.watchlists || [] }
                    categories={ categories?.categories || [] }
                    article={ article }
                    userId={ userId }
                />
                <div className="my-4 pl-8">
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
        userId
    }: {
        article: ArticleBase;
        watchlists: Watchlist[];
        categories: Category[];
        userId: number;
    }) => {

        const currentCategory = article.category || null

        const [wid, setWid] = useState<string | undefined>(undefined) // (currentWatchlist ? `${currentWatchlist.watchlist_id}` : undefined )
        const [cid, setCid] = useState<string | undefined>(currentCategory ? `${currentCategory.category_id}` : undefined)
        
        const categoriseArticleMutation = useCategoriseArticle()
        const watchlistArticleMutation = useWatchlistArticle()
        const unwatchlistTagMutation = useUnwatchlistArticle()

        const onSetCategory = () => {

            categoriseArticleMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                category_id: cid ? Number(cid) : 0 ,
            })

            // setCid(undefined)
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

        const watchlistOpts = watchlists ? watchlists.map(w => {
            return { label: w.watchlist_name, value: `${ w.watchlist_id }`, className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
        }) : []
        const categoriesOpts = categories ? categories.map(c => {
            return { label: c.category_name, value: `${ c.category_id }` , className: disabledCategory(c.category_id)  ? 'disabled' : ''}
        }) : []

        const catSelected = !!cid
        const catChanged = (!!currentCategory && Number(currentCategory.category_id) !== Number(cid)) || (!currentCategory && catSelected)

        const wlSelected = !!wid 
        const wlChanged = wlSelected // (!!currentWatchlist && Number(currentWatchlist.watchlist_id) !== Number(wid)) || (!currentWatchlist && wlSelected)

        return <div className="my-2 pr-8">
        <div style={{ width: '300px' }}>
            <h5 className={cnSectionSmallTitle}>Watchlists: <span className={ cnBold }>{ article.watchlists?.length || 0 }</span></h5>
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
        <div className="my-2" style={{ width: '300px' }}>
            <h5 className={cnSectionSmallTitle}>Category: <span className={ cnBold }>{ article.category ? article.category.category_name : 'none'}</span></h5>
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