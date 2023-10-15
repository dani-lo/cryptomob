import { Constructor } from "@/src/helpers/extend"
import { Comment } from "@/src/models/comment"

interface WithCommentMethods {
    comment: (comm: Comment) => void;
}

export const withComment = <C extends Constructor<WithCommentMethods>> (Class: C) => {
    return class extends Class {

        public addComment(comm: Comment) {
            this.comment(comm)
        }
    }
}