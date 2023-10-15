import { Comment } from "@/src/models/comment";
import { cnBaloon, cnParagraph, cnPayoff } from "@/src/styles/classnames.tailwind";

export const CommentBaloonsComponent = ({ comments } : { comments: Comment[]}) => {

    return [...comments].reverse().map(comment => {
        return  <div 
                key={ comment.comment_id }
                className={ cnBaloon }>
            <p className={ cnParagraph }>{ comment.comment_text }</p>
            <p className={ cnPayoff }>added by: <a href="#">{ comment.user.user_name }</a></p>
        </div>
    })
}