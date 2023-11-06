// import { Article } from "@/src/gql/graphql"
import { UpdateBoolInput } from "@/src/hooks"
import { ArticleBase } from "@/src/models/article"
import { cnBigIconActive, utils, cnBigIcon, cnItemCardActions } from "@/src/styles/classnames.tailwind"
import {
    faBookmark,
    faComment,
    faTrash,
    faPlus
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { UseMutateFunction } from "@tanstack/react-query"

interface Props { 
    article: ArticleBase;
    onToggleComment: () => void;
    onToggleExtras: () => void;
    onBookmarkArticle: UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
    onDeleteArticle: UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
}

export const ArticleActionsHeaderComponent = ({ 
        article, 
        onToggleComment, 
        onToggleExtras,
        onBookmarkArticle,
        onDeleteArticle }: Props) => {

    return <div className={ cnItemCardActions } style={{ height: '40px' }}>
        <div>
            <FontAwesomeIcon
                icon={ faPlus }
                className={ utils.cnJoin([cnBigIcon, 'clickable-icon'])}
                onClick={ onToggleExtras }
            />
        </div>
        <div className="flex items-center">
            <FontAwesomeIcon
                icon={ faBookmark }
                className={ utils.cnJoin([article.article_bookmark ? cnBigIconActive : cnBigIcon, 'clickable-icon'])}
                onClick={ () => onBookmarkArticle({ item_id: Number(article.article_id), val: !article.article_bookmark }) }
            />
            <div>
            <FontAwesomeIcon
                icon={ faComment }
                className={ utils.cnJoin([article.comments?.length ? cnBigIconActive : cnBigIcon, 'clickable-icon', 'pl-3'])}
                onClick={ onToggleComment }
            />
            </div>
            <FontAwesomeIcon
                icon={ faTrash }
                className={ utils.cnJoin([cnBigIcon, 'clickable-icon', 'pl-3'])}
                onClick={ () => onDeleteArticle({ item_id: Number(article.article_id), val: true }) }
            />
        </div>
    </div>
}