import { ArticleAPiData } from "./article";
import { WatchlistApiData } from "./watchlist";

export interface AuthorApiData {
    author_id: number;
    author_name: string;
    articles: ArticleAPiData[];
    watchlists: WatchlistApiData[];
}

export class Author {
    public author_id: number;
    public author_name: string;
    // articles: ArticleAPiData[];
    // watchlists: WatchlistApiData[];

    public constructor (a: AuthorApiData) {
        this.author_id = a.author_id
        this.author_name = a.author_name

        // this.articles = a.articles.map(a => new Article(a))
        // this.watchlists = a.watchlists.map(w => )
    }
}