import { UpdateBoolInput } from "@/src/hooks"
import { Article, ArticleBase } from "@/src/models/article"
import { Comment } from "@/src/models/comment"
import { cnBaloon, cnButton, cnParagraph, cnSectionTitle, utils } from "@/src/styles/classnames.tailwind"
import { StyledContainedOverlay } from "@/src/styles/main.styled"
import { UseMutateFunction } from "@tanstack/react-query"

interface Props {
    item: ArticleBase | Comment;
    onDeleteArticle: UseMutateFunction<unknown, unknown, UpdateBoolInput, unknown>;
}
  
export const DeleteditemOverlayComponent = ({ item, onDeleteArticle }: Props) => {

        return <StyledContainedOverlay>
            <div className={ utils.cnJoin([cnBaloon, 'w-4/5']) }>
            <h3 className={ utils.cnJoin([cnSectionTitle, 'm-0']) }>This item was deleted</h3>
            <p className={ cnParagraph}>You can undo the deletion by clicking n the undo button below</p>
            <p className={ cnParagraph}>If not undone, this item will be removed permanently soon</p>
            <div className="mt-6">
                <button 
                    className={ cnButton }
                    onClick={ () => {
                        
                        if (item instanceof Article &&  item.article_id) {
                            onDeleteArticle({item_id: Number(item.article_id), val: false})
                        }
                    }}
                    >Undo
                </button>
                        
                
            </div>
        </div>
    </StyledContainedOverlay>

}