import { useState } from "react"
import { UseMutateFunction } from "@tanstack/react-query"

import { ArticleBase } from "@/src/models/article"
import { Tag } from "@/src/models/tag"

import { timestampToDateString } from "@/src/helpers/date"
import { ellipsys } from "@/src/helpers/ellipsys"

import { StyledCard } from '@/src/styles/main.styled' 
import { cnBold, cnCardTitle, cnItemCard, cnParagraph, cnPayoff, cnTag, cnCardContainer } from "@/src/styles/classnames.tailwind"

import { UpdateBoolInput } from "@/src/hooks"

import { ArticleActionsHeaderComponent } from "@/components/article/articleActionsHeader"
import { ArticleModalActions } from "@/components/widgets/modal"
import { ArticleColorizeActionModalComponent, ArticleCommentActionModalComponent } from "@/components/widgets/modal/articleActions"
import { DeleteditemOverlayComponent } from "@/components/widgets/deletedItemOverlay"

import { getAppStaticSettings } from "@/src/store/static"
import { stripHtml } from "@/src/helpers/strip"

interface Props {
    article: ArticleBase;
    bookmarkArticle:  UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
    deleteArticle:  UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
    selectTag: (tagId: number) => void;
    selectArticle: (articleId: number) => void;
    userId: number;
}

export const ArticleCardComponent = (props: Props) => {

    const { article, bookmarkArticle, deleteArticle } = props

    const [modalaction, setModalAction] = useState<ArticleModalActions | null>(null)

    const uniqueTags = article.tags.reduce((acc: Tag[], curr: Tag) => {

        if (acc.find(d => d.tag_id === curr.tag_id)) {
            return acc
        }

        acc.push(curr)

        return acc
    }, [])

    const description = stripHtml(article.article_description)

    const appStaticSettings = getAppStaticSettings()

    return <StyledCard 
            minw='400px' 
            h='auto' 
            className={ cnItemCard }
            style={{ background: article.article_bg || 'white' }}
            >      
        {
            article.article_delete ? 
                <DeleteditemOverlayComponent item={ article } onDeleteArticle={ deleteArticle } /> :
                null
        }
        <ArticleActionsHeaderComponent 
            article={ article } 
            onToggleComment={ () => setModalAction(modalaction === null ? ArticleModalActions.AddComment : null) }
            onToggleExtras={ () => props.selectArticle( article.article_id) }
            onToggleColorPicker={ () => setModalAction(modalaction === null ? ArticleModalActions.ArticleBg : null) }
            onBookmarkArticle={ bookmarkArticle }
            onDeleteArticle={ deleteArticle }
        />
        <div className={ cnCardContainer}>
            <h5 className={ cnCardTitle }>
                <a target="blank" href={ article.article_link }>
                {
                    ellipsys(article.article_title, 40)
                }
                </a>
            </h5> 
            <p  className={ cnParagraph }>
            {
                ellipsys(description, 70)
            }
            </p>
            <p className={ cnParagraph }>By: <a href="">{ article.author?.author_name || 'Unknown Author' }</a>, { timestampToDateString(Number(article.article_datepub), true) }</p>
            <p className={ cnParagraph }>
                Category: <span className={ cnBold }>{ article.category ? article.category.category_name : 'none'}</span>. 
                Member of <span className={ cnBold }>{ article.watchlists?.length || 0 }</span> watchlists
            </p>
            <p className="flex flex-wrap items-baseline m-0" style={{ height: uniqueTags.length > 0 ? '50px' : 'auto', overflowY: 'scroll'}}>
                { uniqueTags.length > 0 ?

                    uniqueTags.map(tag => {
                        return <span 
                            className={ cnTag(appStaticSettings.bg) } 
                            onClick={ () => props.selectTag(tag.tag_id) }
                            key={ tag.tag_id }>
                            { tag.tag_name }
                        </span>
                    }) :

                    <span className={ cnPayoff }>No Tags AVaialble for this article</span>
                }
            </p>
            
            {
                modalaction === ArticleModalActions.AddComment ? 
                    <ArticleCommentActionModalComponent 
                        article={ article } 
                        userId={ props.userId } 
                        onClose={ () => setModalAction(null) }
                    /> : null 
            }
            {
                modalaction === ArticleModalActions.ArticleBg ? 
                    <ArticleColorizeActionModalComponent
                        article={ article } 
                        userId={ props.userId } 
                        onClose={ () => setModalAction(null) }
                    /> : null 
            }
        </div>

    </StyledCard>
}