import { User, UserApiData } from "./user";

export interface CommentApiData {
    comment_id: number;
    comment_text: string;
    // article: ArticleAPiData;
    user: UserApiData;
}

export class Comment {
    public comment_id: number
    public comment_text: string
    public user: User
    // article: Article

    public constructor (a: CommentApiData) {
        this.comment_id = a.comment_id
        this.comment_text = a.comment_text
        this.user = new User(a.user)
        // this.article = new Article(a.article)
    }
}