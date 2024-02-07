import {
    faBookmark,
    faPalette,
    faComment,
    faTrash,
    faPlus
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { UseMutateFunction } from "@tanstack/react-query"

import { UpdateBoolInput } from "@/src/hooks"

import { ArticleBase } from "@/src/models/article"

import { getAppStaticSettings } from "@/src/store/static"

import {  utils, cnItemCardActions, cnSmallIcon, cnItemCardActionsInline } from "@/src/styles/classnames.tailwind"

interface Props { 
    article: ArticleBase;
    onToggleComment: () => void;
    onToggleExtras: () => void;
    onToggleColorPicker: () => void;
    onBookmarkArticle: UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
    onDeleteArticle: UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
}

export const ArticleActionsHeaderComponent = ({ 
        article, 
        onToggleComment, 
        onToggleExtras,
        onToggleColorPicker,
        onBookmarkArticle,
        onDeleteArticle }: Props) => {
    
    const staticAppSettings = getAppStaticSettings()

    return <div className={ cnItemCardActions } style={{ height: '40px' }}>
        <div className={ cnItemCardActionsInline }>
            <FontAwesomeIcon
                icon={ faPalette }
                className={ utils.cnJoin([cnSmallIcon(staticAppSettings.txt), 'clickable-icon'])}
                onClick={ onToggleColorPicker }
            />
            <FontAwesomeIcon
                icon={ faBookmark }
                className={ utils.cnJoin([article.article_bookmark ? cnSmallIcon(staticAppSettings.txtEvidence) : cnSmallIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                onClick={ () => {
                    try {
                        onBookmarkArticle({ item_id: Number(article.article_id), val: !article.article_bookmark }) 

                    } catch (err) {
                        console.log(err)
                    }
               
                }}
            />
            <div>
                <FontAwesomeIcon
                    icon={ faComment }
                    className={ utils.cnJoin([article.comments?.length ? cnSmallIcon(staticAppSettings.txtEvidence) : cnSmallIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                    onClick={ onToggleComment }
                />
            </div>
            <FontAwesomeIcon
                icon={ faTrash }
                className={ utils.cnJoin([cnSmallIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                onClick={ () => onDeleteArticle({ item_id: Number(article.article_id), val: true }) }
            />
            </div>
            <div className="pl-8">
                <FontAwesomeIcon
                    icon={ faPlus }
                    className={ utils.cnJoin([cnSmallIcon(staticAppSettings.txt), 'clickable-icon'])}
                    onClick={ onToggleExtras }
                />
        </div>
    </div>
}