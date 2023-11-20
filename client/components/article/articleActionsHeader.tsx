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

import { getAppStaticSettings } from "@/src/store/settingAtoms"

import { cnBigIconActive, utils, cnBigIcon, cnItemCardActions } from "@/src/styles/classnames.tailwind"

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
        <div>
            <FontAwesomeIcon
                icon={ faPlus }
                className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon'])}
                onClick={ onToggleExtras }
            />
        </div>
        <div className="flex items-center">
            <FontAwesomeIcon
                icon={ faPalette }
                className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon'])}
                onClick={ onToggleColorPicker }
            />
            <FontAwesomeIcon
                icon={ faBookmark }
                className={ utils.cnJoin([article.article_bookmark ? cnBigIconActive(staticAppSettings.txtEvidence) : cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                onClick={ () => onBookmarkArticle({ item_id: Number(article.article_id), val: !article.article_bookmark }) }
            />
            <div>
                <FontAwesomeIcon
                    icon={ faComment }
                    className={ utils.cnJoin([article.comments?.length ? cnBigIconActive(staticAppSettings.txtEvidence) : cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                    onClick={ onToggleComment }
                />
            </div>
            <FontAwesomeIcon
                icon={ faTrash }
                className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon', 'pl-3'])}
                onClick={ () => onDeleteArticle({ item_id: Number(article.article_id), val: true }) }
            />
        </div>
    </div>
}