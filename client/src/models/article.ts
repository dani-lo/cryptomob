import { Model } from ".";
import { Author, AuthorApiData } from "./author";
import { withWatchlist } from "./base-classes/watchlistable";
import { Category, CategoryApiData } from "./category";
import { Comment, CommentApiData } from "./comment";
import { Tag, TagApiData } from "./tag";
import { Watchlist, WatchlistApiData } from "./watchlist";

export interface ArticleAPiData {
    article_id: number;
    article_title: string;
    article_link: string;
    article_datepub: string;
    article_bookmark: boolean;
    article_delete: boolean;
    article_content: string;
    article_description: string;
    category: CategoryApiData;
    author: AuthorApiData | null;
    tags: TagApiData[];
    comments: CommentApiData[];
    watchlists: WatchlistApiData[];
}


export class ArticleBase extends Model {
    
    public article_id: number;
    public article_title: string;
    public article_link: string;
    public article_datepub: string;
    public article_content: string;
    public article_description: string;
    public article_bookmark: boolean;
    public article_delete: boolean;

    public author: Author | null;
    public tags:Tag[]
    public comments:Comment[]
    public watchlists:Watchlist[]
    public category: Category | null

    public constructor (a: ArticleAPiData) {

        super()
        
        this.article_id = a.article_id
        this.article_title = a.article_title
        this.article_link = a.article_link
        this.article_datepub = a.article_datepub
        this.article_content = a.article_content
        this.article_description = a.article_description
        this.article_bookmark = a.article_bookmark
        this.article_delete = a.article_delete
        this.author = a.author !== null ? new Author(a.author) : null
        this.category = a.category !== null ? new Category(a.category) : null
        this.tags = a.tags.map(t => new Tag(t))
        this.comments = a.comments.map(c => new Comment(c))
        this.watchlists = a.watchlists.map(w => new Watchlist(w))
    }

    // categorize (c: Category) {}
    // comment (c: Comment) {}
    // watch (w: Watchlist, m: MutateFunction) {
    //     // super.watch(w, m)
    // }

}

export const Article = withWatchlist(ArticleBase)// withCategorize(withComment(withWatchlist(ArticleBase)))