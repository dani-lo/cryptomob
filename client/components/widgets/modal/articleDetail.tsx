import { useState } from "react"
import Dropdown from 'react-dropdown'
 
import { useCategoriesWithArticlesCount } from "@/src/hooks/useCategories"
import { useArticleExtras } from "@/src/hooks/useArticles"

import { ArticleBase } from "@/src/models/article"

import { StyledContainedBar } from "@/src/styles/main.styled"
import { useWatchlistsWIthItemsCount } from "@/src/hooks/useWatchlist"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { cnBold, cnButton, cnCardTitle, cnParagraph, cnPayoff, cnSectionSmallTitle, cnTag, utils } from "@/src/styles/classnames.tailwind"
import { timestampToDateString } from "@/src/helpers/date"
import { Tag } from "@/src/models/tag"
import { CommentBaloonsComponent } from "@/components/comment/commentBaloons"



export const ArticleDetailModalComponent = ({ article, userId, onClose }: { article: ArticleBase, userId: number, onClose: () => void }) => {

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

    const currentCategory = article.category || null

    const [wid, setWid] = useState<string | undefined>(undefined)
    const [cid, setCid] = useState<string | undefined>(currentCategory ? `${currentCategory.category_id}` : undefined)

    const articleExtrasMutation = useArticleExtras()

    const handleSubmit = () => {

        articleExtrasMutation.mutate({
                article_id: Number(article.article_id),
                user_id: Number(userId),
                watchlist_id: wid ? Number(wid) : null,
                category_id: cid ? Number(cid) : null ,
        })

        setWid(undefined)
        setCid(undefined)
    }

    const disabledWatchlist = (watchlistID: number) => article.watchlists?.some(w => w.watchlist_id === Number(watchlistID))
    // const disabledCategory = (categoryID: number) => article.category?.category_id === categoryID

    const watchlistOpts = watchlists ? watchlists.watchlists.map(w => {
        return { label: w.watchlist_name, value: `${ w.watchlist_id }` , className: disabledWatchlist(w.watchlist_id) ? 'disabled' : '' }
    }) : []
    const categoriesOpts = categories ? categories.categories.map(c => {
        return { label: c.category_name, value: `${ c.category_id }` }// , className: disabledCategory(c.category_id)  ? 'disabled' : ''}
    }) : []
    
    const catChanged = !!currentCategory && Number(currentCategory.category_id) !== Number(cid)

    const disabled = !wid && (!cid || !catChanged)

    const uniqueTags = article.tags.reduce((acc: Tag[], curr: Tag) => {

        if (acc.find(d => d.tag_id === curr.tag_id)) {
            return acc
        }

        acc.push(curr)

        return acc
    }, [])

    const description = article.article_description.replace(/(&nbsp;|<([^>]+)>)/ig, "")

    return <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className={ cnCardTitle }>
                    <a target="blank" href={ article.article_link }>
                    {
                        article.article_title
                    }
                    </a>
                </h5> 
                <p  className={ cnParagraph }>
                {
                    description
                }
                </p>
                <p className={ cnParagraph }>By: <a href="">{ article.author?.author_name || 'Unknown Author' }</a>, { timestampToDateString(Number(article.article_datepub), true) }</p>
                
                <p className="flex flex-wrap items-baseline m-0" style={{ maxHeight: '100px',  overflowY: 'scroll'}}>
                    { uniqueTags.length > 0 ?

                        uniqueTags.map(tag => {
                            return <span className={ cnTag } key={ tag.tag_id }>{ tag.tag_name }</span>
                        }) :

                        <span className={ cnPayoff }>No Tags AVaialble for this article</span>
                    }
                </p>
                <div className="flex">
                    <div  className="pr-8"> 
                        <div className="my-4" style={{ width: '300px' }}>
                            <h5 className={cnSectionSmallTitle}>Member of <span className={ cnBold }>{ article.watchlists?.length || 0 }</span> watchlist</h5>
                            <p className={ cnParagraph }>{  article.watchlists?.length ? 'Move to different watchlist' : 'Add article to watchlist'}</p>
                            <Dropdown 
                                options={ watchlistOpts } 
                                onChange={(opt) =>  setWid(`${ opt.value }`) } 
                                value={ cid } 
                                placeholder="Select a watchlist" 
                            />
                        
                        </div>
                        <div className="my-4" style={{ width: '300px' }}>
                            <h5 className={cnSectionSmallTitle}>Category: <span className={ cnBold }>{ article.category ? article.category.category_name : 'none'}</span></h5>
                            
                            <p className={ cnParagraph }>{  article.category ? 'Assign to different category' : 'Assign  category to article'}</p>
                            <Dropdown 
                                options={ categoriesOpts } 
                                onChange={(opt) =>  setCid(`${ opt.value }`) } 
                                value={ cid } 
                                placeholder="Select a category" 
                            />
                        </div>
                        
                        <div className="my-4" >
                            <button 
                                className={ disabled ? utils.disabled(cnButton) :  cnButton }
                                onClick={ handleSubmit }
                            >Save changes</button>
                        </div>
                    </div>
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